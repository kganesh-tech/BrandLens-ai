require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const { QdrantClient } = require("@qdrant/js-client-rest");
const { pipeline } = require("@huggingface/transformers");
const crypto = require("crypto");
const Groq = require("groq-sdk");

const app = express();

app.use(express.json());
app.use(cors());

const client = new MongoClient(process.env.MONGODB_URI);
const qdrant = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY
});
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});
let extractor;
async function loadEmbeddingModel() {
    extractor = await pipeline(
        "feature-extraction",
        "onnx-community/all-MiniLM-L6-v2-ONNX"
    );

    console.log("EMBEDDING MODEL LOADED");
}
async function  createKnowledgeCollection() {
    const collections = await qdrant.getCollections();

    const exists = collections.collections.some(
        collection => collection.name === "brandlens_knowledge"
    );

    if (!exists) {
        await qdrant.createCollection("brandlens_knowledge", {
            vectors: {
                size: 384,
                distance: "Cosine"
            }
        });

        console.log("QDRANT COLLECTION CREATED");
    } else {
        console.log("QDRANT COLLECTION ALREADY EXISTS");
    }
}

let reviews;
let knowledge;
async function connectDB() {
    await client.connect();

    const db = client.db("BRANDLENS");
    reviews = db.collection("reviews");
    knowledge = db.collection("knowledge");


    console.log("MONGODB connected successfully");

    const PORT = process.env.PORT || 3000;

    app.listen(PORT , () => {
           console.log(`server is running on ${PORT}`);
    });
};

app.post("/knowledge" , async(req,res)=>{
    const {addknowledgedetails} = req.body;

    console.log(addknowledgedetails);

   const  content = addknowledgedetails.content;
    const type = addknowledgedetails.type;
    const title = addknowledgedetails.title;

    const output = await extractor(content , {
        pooling : "mean",
        normalize : true
    });

    const embedding = Array.from(output.data);

    console.log("EMBEDDING:" , embedding);
     const knowledgeId = crypto.randomUUID();

    await knowledge.insertOne({
        id : knowledgeId,
        Type : type,
        Title : title,
        Content : content


    })

   

await qdrant.upsert("brandlens_knowledge", {
    wait: true,
    points: [
        {
            id: knowledgeId,
            vector: embedding,
            payload: {
                type,
                title,
                content
            }
        }
    ]
});

return res.status(201).json({
    message : "Knowledge saved successfully",
    details : addknowledgedetails

});


});

app.post("/review", async (req, res) => {

    try {

        const { content } = req.body;

        console.log("CONTENT:", content);

        const output = await extractor(content, {
            pooling: "mean",
            normalize: true
        });

        const embeddings = Array.from(output.data);

        console.log("CONTENT EMBEDDINGS:", embeddings);

        const searchResult = await qdrant.query("brandlens_knowledge", {
            query: embeddings,
            limit: 3,
            with_payload: true
        });

        console.log("QDRANT SEARCH RESULT:");
        console.dir(searchResult, { depth: null });

        const relevantKnowledge = searchResult.points.map(
            point => point.payload
        );

        console.log("RELEVANT KNOWLEDGE:");
        console.log(relevantKnowledge);

        const knowledgeText = relevantKnowledge.map((item, index) => {
            return `
     Knowledge ${index + 1}
     Type: ${item.type}
     Title: ${item.title}
    Content: ${item.content}
`;
        }).join("\n");

        const prompt = `
You are the compliance analysis component of BrandLens.

Your job is to check the submitted content against the retrieved brand knowledge.

Do NOT calculate a percentage score.

For every knowledge item:
- Determine whether the submitted content complies with it.
- Return either PASS or VIOLATION.
- Give a short reason.
- Do not invent rules that are not present in the provided knowledge.

Submitted content:
${content}

Retrieved brand knowledge:
${knowledgeText}

Return ONLY valid JSON in this exact structure:

{
    "checks": [
        {
            "title": "Knowledge title",
            "status": "PASS",
            "reason": "Short explanation"
        }
    ]
}

Use only these status values:
PASS
VIOLATION
`;

        const completion = await groq.chat.completions.create({
            model: "openai/gpt-oss-120b",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0
        });

        const aiResponse = completion.choices[0].message.content;

        console.log("AI RESPONSE:");
        console.log(aiResponse);

        const analysis = JSON.parse(aiResponse);
         

        const totalChecks = analysis.checks.length;

        const passedChecks = analysis.checks.filter(
            check => check.status === "PASS"
        ).length;

        const failedChecks = analysis.checks.filter(
            check => check.status === "VIOLATION"
        ).length;

        const score = totalChecks === 0
            ? 0
            : Math.round((passedChecks / totalChecks) * 100);

        const issues = analysis.checks.filter(
            check => check.status === "VIOLATION"
        );

        await reviews.insertOne({
            id: crypto.randomBytes(6).toString("hex"),
            content: content,
            Embedding: embeddings,
            score: score,
            passed: passedChecks,
            failed: failedChecks,
            checks: analysis.checks,
            issues: issues,
            createdAt: new Date()
        });

        return res.status(201).json({
            score: score,
            passed: passedChecks,
            failed: failedChecks,
            totalChecks: totalChecks,
            checks: analysis.checks,
            issues: issues
        });

    } catch (error) {

        console.error("REVIEW ERROR:", error);

        return res.status(500).json({
            message: "Review failed",
            error: error.message
        });

    }

});
app.get("/knowledge/counts", async (req, res) => {

    const counts = await knowledge.aggregate([
        {
            $group: {
                _id: "$Type",
                count: { $sum: 1 }
            }
        }
    ]).toArray();

    const result = {
        all: 0,
        rules: 0,
        facts: 0,
        terminology: 0,
        claims: 0
    };

    counts.forEach(item => {

        result.all += item.count;

        if (item._id === "Rule") {
            result.rules = item.count;
        }

        if (item._id === "Fact") {
            result.facts = item.count;
        }

        if (item._id === "Terminology") {
            result.terminology = item.count;
        }

        if (item._id === "Claim") {
            result.claims = item.count;
        }
    });

    res.json(result);
});

connectDB();
loadEmbeddingModel();
createKnowledgeCollection();


