const sidebarLinks = document.querySelectorAll(".sidebar-items a");

sidebarLinks.forEach(link => {
    link.addEventListener("click", function() {

        sidebarLinks.forEach(item => {
            item.classList.remove("active");
        });

        this.classList.add("active");
    });
});

const mainContent =
document.getElementById("maincontent");

const lenscontainer =
document.createElement("div");

lenscontainer.className ="lens-container";

const lensicon =
 document.createElement("i");

 lensicon.setAttribute("data-lucide" , "shield-check");
 lensicon.className = "lens-icon";

const lensheading =
document.createElement("h1");

lensheading.textContent = "Welcome to BrandLens";

const lenspara =
document.createElement("p");

lenspara.textContent = "Review your content against approved brand guidelines and keep your brand safe";

const reviewbtn =
document.createElement("button");

reviewbtn.className = "review-btn";

const reviewtext =
document.createElement("span");

reviewtext.textContent = "Start Reviewing";

const reviewicon =
document.createElement("i");

reviewicon.setAttribute("data-lucide" , "scan-search");

const arrowicon =
document.createElement("i");

arrowicon.setAttribute("data-lucide" , "arrow-right");



reviewbtn.appendChild(reviewtext);
reviewbtn.appendChild(reviewicon);
reviewbtn.appendChild(arrowicon);

lenscontainer.appendChild(lensicon);
lenscontainer.appendChild(lensheading);
lenscontainer.appendChild(lenspara);
lenscontainer.appendChild(reviewbtn);

mainContent.appendChild(lenscontainer);
 lucide.createIcons();

const review =
document.getElementById("reviewlink");

review.addEventListener("click" , function(event) {
    event.preventDefault();

    mainContent.innerHTML = "";

    const reviewcontainer =
    document.createElement("div");

    reviewcontainer.className = "review-container";

    const heading =
    document.createElement("h1");

    heading.textContent = "Review Content";

    const reviewpara =
    document.createElement("p");

    reviewpara.textContent = "Check your content against approved brand guidelines and knowledge base";

    const reviewcard =
    document.createElement("div");

    reviewcard.className = "review-card";

    const reviewicon =
    document.createElement("i");

    reviewicon.setAttribute("data-lucide" , "file-check");

    const reviewtext =
    document.createElement("span");

    reviewtext.textContent = "Content to Review";

    const contentlabel =
    document.createElement("label");

    contentlabel.textContent = "Content";

     const contentinput =
     document.createElement("textarea");

    contentinput.className = "content-input";

    contentinput.placeholder =
    "Paste the content you want BrandLens to review...";

    contentinput.maxLength = 5000;

    const reviewcontentbtn =
    document.createElement("button");

    reviewcontentbtn.className = "review-contentbtn";

    const reviewcontenttext =
    document.createElement("span");
    reviewcontenttext.textContent = "Review Content";



    const reviewcontenticon = 
    document.createElement("i");

    reviewcontenticon.setAttribute("data-lucide" , "scan-search");

    const reviewarrow =
    document.createElement("i");

    reviewarrow.setAttribute("data-lucide" , "arrow-right");

    reviewcontentbtn.addEventListener("click" , function(event) {
        event.preventDefault();
        console.log("review button is pressed");

        const content = contentinput.value;
         

        reviewcontainer.appendChild(analyzecard);
        lucide.createIcons();

        fetch("https://brandlens-ai-ptsr.onrender.com/review" , {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({content})
        })
        .then(res => res.json())
        .then(data => {

    console.log("REVIEW RESULT:", data);
    contentinput.value = "";

   

    analyzecard.remove();

   const resultCard = document.createElement("div");

resultCard.className = "result-panel";

resultCard.innerHTML = `
    <div class="result-success">
        <div class="success-left">
            <span class="success-icon">✓</span>
            <span>Review completed successfully</span>
        </div>

        <span class="success-close">×</span>
    </div>

    <div class="score-section">

        <div class="score-circle">
            <div class="score-value">${data.score}%</div>
        </div>

        <div class="score-info">
            <h2>Compliance Score</h2>

            <span class="score-status">
                ${data.score >= 90 ? "Compliant" :
                  data.score >= 70 ? "Mostly Compliant" :
                  data.score >= 50 ? "Needs Review" :
                  "Major Issues"}
            </span>

            <p>
                ${data.passed} passed • ${data.failed} violation${data.failed !== 1 ? "s" : ""}
            </p>
        </div>

    </div>

    <div class="review-details">

        <div class="details-heading">
            <span>▣</span>
            <h3>Review Details</h3>
        </div>

        <div class="detail-box">
            <h4>Overall Assessment</h4>
            <p>
                ${
                    data.failed === 0
                    ? "Your content is aligned with the retrieved brand guidelines and contains no detected violations."
                    : `Your content requires review because ${data.failed} brand guideline violation${data.failed !== 1 ? "s were" : " was"} detected.`
                }
            </p>
        </div>

        <div class="detail-box">
            <h4>Key Highlights</h4>

            <ul>
                <li>${data.passed} brand checks passed</li>
                <li>${data.failed} potential violation${data.failed !== 1 ? "s" : ""} detected</li>
                <li>${data.totalChecks} relevant knowledge checks analyzed</li>
            </ul>
        </div>

        <div class="detail-box issues-box">

            <h4>Issues Detected</h4>

            ${
                data.issues.length === 0
                ? `<p class="no-issues">✓ No violations detected.</p>`
                : data.issues.map(issue => `
                    <div class="issue-item">
                        <div class="issue-title">
                            <span>!</span>
                            <strong>${issue.title}</strong>
                        </div>

                        <p>${issue.reason}</p>
                    </div>
                `).join("")
            }

            

        </div>
         <button class="continue-button" id="continuebtn">Continue</button>

         

    </div>
`;

   

resultCard.querySelector(".score-circle").style.background =
    `conic-gradient(
        #22b573 0% ${data.score}%,
        #e8eef5 ${data.score}% 100%
    )`;

   

reviewcontainer.appendChild(resultCard);
 setTimeout(() => {
    const successMessage = resultCard.querySelector(".result-success");

    if (successMessage) {
        successMessage.remove();
    }
}, 5000);

const continuebtn = 
resultCard.querySelector("#continuebtn");

continuebtn.addEventListener("click", () => {
    resultCard.remove();

    resultCard.innerHTML = `
        <div class="review-success-message">
            <div id="tick">
                <i data-lucide="circle-check"></i>
            </div>

            <h3>Review completed successfully</h3>

            <p>
                Your content has been analyzed against your brand guidelines.
            </p>
        </div>
    `;

    reviewcontainer.appendChild(resultCard);

    lucide.createIcons();
});

});
    })

    const analyzecard =
    document.createElement("div");

    analyzecard.className = "analyze-card";
    const steps =
    document.createElement("div");

steps.className = "analysis-steps";
    const analyzeicon =
    document.createElement("i");

    analyzeicon.setAttribute("data-lucide" , "loader-circle");

    const analyzeheading =
    document.createElement("h3");

    analyzeheading.textContent = "Analyzing your content....";

    const analyzepara =
    document.createElement("p");

    analyzepara.textContent = "Checking brand guidelines and relevant knowledge";

    const stepone = document.createElement("div");
     stepone.className = "analysis-step";

    const onecircleicon =
    document.createElement("i");

    onecircleicon.setAttribute("data-lucide" , "circle");

    const onenumber =
    document.createElement("span");

    onenumber.textContent = "1";

    const onematter =
    document.createElement("p");

    onematter.textContent = "Retrieving Knowledge";

    const steptwo = document.createElement("div");
    steptwo.className = "analysis-step";

    const twocircleicon =
    document.createElement("i");

    twocircleicon.setAttribute("data-lucide" , "circle");

    const twonumber =
    document.createElement("span");

    twonumber.textContent = "2";

    const twomatter =
    document.createElement("p");

    twomatter.textContent = "Analyzing with AI";

     const stepthree = document.createElement("div");
     stepthree.className = "analysis-step";

    const threecircleicon =
    document.createElement("i");

    threecircleicon.setAttribute("data-lucide" , "circle");

    const threenumber =
    document.createElement("span");

    threenumber.textContent = "3";

    const threematter =
    document.createElement("p");

    threematter.textContent = "Generating Result";

     const stepfour = document.createElement("div");
     stepfour.className = "analysis-step";

    const fourcircleicon =
    document.createElement("i");

    fourcircleicon.setAttribute("data-lucide" , "circle");

    const fournumber =
    document.createElement("span");

    fournumber.textContent = "4";

    const fourmatter =
    document.createElement("p");

    fourmatter.textContent = "finalizing";

    





    reviewcard.appendChild(reviewicon);
    reviewcard.appendChild(reviewtext);
    reviewcontainer.appendChild(heading);
    reviewcontainer.appendChild(reviewpara);
    
    reviewcontainer.appendChild(reviewcard);
    
    reviewcard.appendChild(contentlabel);
    reviewcard.appendChild(contentinput);
    reviewcard.appendChild(reviewcontentbtn);
    reviewcontentbtn.appendChild(reviewcontenticon);
    reviewcontentbtn.appendChild(reviewcontenttext)
    reviewcontentbtn.appendChild(reviewarrow);

    analyzecard.appendChild(analyzeicon);
    analyzecard.appendChild(analyzeheading);
    analyzecard.appendChild(analyzepara);
    stepone.appendChild(onecircleicon);
    stepone.appendChild(onenumber);
    stepone.appendChild(onematter);
    steptwo.appendChild(twocircleicon);
    steptwo.appendChild(twonumber);
    steptwo.appendChild(twomatter);
    stepthree.appendChild(threecircleicon);
    stepthree.appendChild(threenumber);
    stepthree.appendChild(threematter);
    stepfour.appendChild(fourcircleicon);
    stepfour.appendChild(fournumber);
    stepfour.appendChild(fourmatter);
    steps.appendChild(stepone);
    steps.appendChild(steptwo);
    steps.appendChild(stepthree);
    steps.appendChild(stepfour);
    analyzecard.appendChild(steps);
    
    mainContent.appendChild(reviewcontainer);

    lucide.createIcons();
})

const knowledge =
document.getElementById("brandknowledgelink");

knowledge.addEventListener("click" , function(event) {
    event.preventDefault();

    mainContent.innerHTML = "";

    const knowledgecontainer =
    document.createElement("div");

    knowledgecontainer.className = "knowledge-container";

    const type =
    document.createElement("p");

    type.textContent = "KNOWLEDGE BASE";

    const knowledgeheading =
    document.createElement("h1");

    knowledgeheading.textContent = "Brand Knowledge";

    const knowledgepara =
    document.createElement("p");

    knowledgepara.textContent = "Manage your approved brand guidelines facts,terminology and claims.This knowledge powers BrandLens AI to ensure consistent and complaint content.";

    const cards=
    document.createElement("div");

    cards.className = "knowledge-cards";

   const allcard =
    document.createElement("div");

    allcard.className = "all-card";

    const alltop =
    document.createElement("div");

    alltop.className = "all-top";

    const allicon =
    document.createElement("i");

    allicon.setAttribute("data-lucide" , "layers");

    const all =
    document.createElement("p");

    all.textContent = "All";

    const allcount =
    document.createElement("span");

    allcount.textContent = "0";

    const rulecard =
    document.createElement("div");

    rulecard.className = "rule-card";

    const ruletop =
    document.createElement("div");

    ruletop.className = "rule-top";

    const ruleicon =
    document.createElement("i");

    ruleicon.setAttribute("data-lucide" , "shield-check");

    const rule =
    document.createElement("p");

    rule.textContent = "Rules";

    const rulecount =
    document.createElement("span");

    rulecount.textContent = "0";

    const factcard =
    document.createElement("div");

    factcard.className = "fact-card";

    const facttop =
    document.createElement("div");

    facttop.className = "fact-top";

    const facticon =
    document.createElement("i");

    facticon.setAttribute("data-lucide" , "book-open");

    const fact =
    document.createElement("p");

    fact.textContent = "Facts";

    const factcount =
    document.createElement("span");

    factcount.textContent = "0";

    const terminologycard =
    document.createElement("div");

    terminologycard.className = "all-card";

    const terminologytop =
    document.createElement("div");

    terminologytop.className = "terminology-top";

    const terminologyicon =
    document.createElement("i");

    terminologyicon.setAttribute("data-lucide" , "text");

    const terminology =
    document.createElement("p");

    terminology.textContent = "Terminology";

    const terminologycount =
    document.createElement("span");

    terminologycount.textContent = "0";

    const claimscard =
    document.createElement("div");

    claimscard.className = "claim-card";

    const claimstop =
    document.createElement("div");

    claimstop.className = "claims-top";

    const claimsicon =
    document.createElement("i");

    claimsicon.setAttribute("data-lucide" , "badge-check");

    const claim =
    document.createElement("p");

    claim.textContent = "Claims";

    const claimcount =
    document.createElement("span");

    claimcount.textContent = "0";


    const knowledgehistorycard = 
    document.createElement("div");

    knowledgehistorycard.className = "knowledgehistory-card";

    const historyheading =
    document.createElement("p");

    historyheading.textContent = "Knowledge items";

    const workingcard =
    document.createElement("div");

    workingcard.className = "working-card";

    const flowcontainer =
document.createElement("div");

flowcontainer.className = "flow-container";

    const workingtop =
document.createElement("div");

workingtop.className = "working-top";



    const workingicon =
    document.createElement("i");
    workingicon.setAttribute("data-lucide" , "sparkles");

    const workingheading = 
    document.createElement("p");

    workingheading.textContent = "How this works";

    const workingpara =
    document.createElement("p");

    workingpara.textContent = "BrandLens user this knowledge base(rules,fact,terminology and claims)to check your context against your company's brand guidelines.The AI retrives relevant information and ensures your content is accurate ,complaint and consistent with your brand";
    const contentstep =
document.createElement("div");

contentstep.className = "flow-step";

const contenticon =
document.createElement("i");

contenticon.setAttribute("data-lucide", "file-text");

const contenttext =
document.createElement("p");

contenttext.textContent = "Your Content";

contentstep.appendChild(contenticon);
contentstep.appendChild(contenttext);


const arrowone =
document.createElement("i");

arrowone.setAttribute("data-lucide", "arrow-right");


const ragstep =
document.createElement("div");

ragstep.className = "flow-step";

const ragicon =
document.createElement("i");

ragicon.setAttribute("data-lucide", "search");

const ragtext =
document.createElement("p");

ragtext.textContent = "RAG Search";

ragstep.appendChild(ragicon);
ragstep.appendChild(ragtext);


const arrowtwo =
document.createElement("i");

arrowtwo.setAttribute("data-lucide", "arrow-right");


const aistep =
document.createElement("div");

aistep.className = "flow-step";

const aiicon =
document.createElement("i");

aiicon.setAttribute("data-lucide", "brain");

const aitext =
document.createElement("p");

aitext.textContent = "AI Analysis";

aistep.appendChild(aiicon);
aistep.appendChild(aitext);


const arrowthree =
document.createElement("i");

arrowthree.setAttribute("data-lucide", "arrow-right");


const resultstep =
document.createElement("div");

resultstep.className = "flow-step";

const resulticon =
document.createElement("i");

resulticon.setAttribute("data-lucide", "circle-check");

const resulttext =
document.createElement("p");

resulttext.textContent = "Compliant Result";

resultstep.appendChild(resulticon);
resultstep.appendChild(resulttext);


flowcontainer.appendChild(contentstep);
flowcontainer.appendChild(arrowone);
flowcontainer.appendChild(ragstep);
flowcontainer.appendChild(arrowtwo);
flowcontainer.appendChild(aistep);
flowcontainer.appendChild(arrowthree);
flowcontainer.appendChild(resultstep);



workingtop.appendChild(workingicon);
workingtop.appendChild(workingheading);

workingcard.appendChild(workingtop);
workingcard.appendChild(workingpara);
workingcard.appendChild(flowcontainer);

knowledgehistorycard.appendChild(historyheading);
 fetch("http://localhost:3000/knowledge/history" , {
    method : "GET"
 })
 .then(res => res.json())
 .then(data => {
    console.log(data);

    data.forEach(knowledge => {
        const cards =
        document.createElement("div");

        cards.className = "knowledge-history-item";

        const knowledgecontent =
        document.createElement("p");

        knowledgecontent.textContent = `content : ${knowledge.Content}`;

        const knowledgeType =
        document.createElement("p");

        knowledgeType.textContent = `Type: ${knowledge.Type}`;

        const knowledgetitle =
        document.createElement("p");

        knowledgetitle.textContent = `Title: ${knowledge.Title}`;

        cards.appendChild(knowledgecontent);
        cards.appendChild(knowledgeType);
        cards.appendChild(knowledgetitle);

        knowledgehistorycard.appendChild(cards);
       
    })
 })

knowledgecontainer.appendChild(type);
knowledgecontainer.appendChild(knowledgeheading);
knowledgecontainer.appendChild(knowledgepara);

alltop.appendChild(allicon);
alltop.appendChild(all);
allcard.appendChild(alltop);
allcard.appendChild(allcount);

ruletop.appendChild(ruleicon);
ruletop.appendChild(rule);
rulecard.appendChild(ruletop);
rulecard.appendChild(rulecount);

facttop.appendChild(facticon);
facttop.appendChild(fact);
factcard.appendChild(facttop);
factcard.appendChild(factcount);

terminologytop.appendChild(terminologyicon);
terminologytop.appendChild(terminology);
terminologycard.appendChild(terminologytop);
terminologycard.appendChild(terminologycount);

claimstop.appendChild(claimsicon);
claimstop.appendChild(claim);
claimscard.appendChild(claimstop);
claimscard.appendChild(claimcount);

cards.appendChild(allcard);
cards.appendChild(rulecard);
cards.appendChild(factcard);
cards.appendChild(terminologycard);
cards.appendChild(claimscard);

knowledgecontainer.appendChild(cards);


const addknowledgecard =
document.createElement("div");

addknowledgecard.className =
"addknowledge-card";

const addknowledgetop =
document.createElement("div");

addknowledgetop.className =
"addknowledge-top";

const addknowledgeicon =
document.createElement("i");

addknowledgeicon.setAttribute(
    "data-lucide",
    "plus-circle"
);

const addknowledgeheading =
document.createElement("h2");

addknowledgeheading.textContent =
"Add New Knowledge";

addknowledgetop.appendChild(
    addknowledgeicon
);

addknowledgetop.appendChild(
    addknowledgeheading
);

const addknowledgepara =
document.createElement("p");

addknowledgepara.textContent =
"Add an approved rule, fact, terminology or claim to your brand knowledge.";

const addknowledgeform =
document.createElement("div");

addknowledgeform.className =
"addknowledge-form";

const knowledgetypelabel =
document.createElement("label");

knowledgetypelabel.textContent =
"Knowledge Type";

const knowledgetype =
document.createElement("select");

const ruleoption =
document.createElement("option");

ruleoption.textContent =
"Rule";

const factoption =
document.createElement("option");

factoption.textContent =
"Fact";

const terminologyoption =
document.createElement("option");

terminologyoption.textContent =
"Terminology";

const claimoption =
document.createElement("option");

claimoption.textContent =
"Claim";

knowledgetype.appendChild(ruleoption);
knowledgetype.appendChild(factoption);
knowledgetype.appendChild(terminologyoption);
knowledgetype.appendChild(claimoption);

const knowledgetitlelabel =
document.createElement("label");

knowledgetitlelabel.textContent =
"Title";

const knowledgetitle =
document.createElement("input");

knowledgetitle.type = "text";

knowledgetitle.placeholder =
"Example: Product pricing rule";

const knowledgecontentlabel =
document.createElement("label");

knowledgecontentlabel.textContent =
"Knowledge";

const knowledgecontent =
document.createElement("textarea");

knowledgecontent.placeholder =
"Enter the approved rule, fact, terminology or claim...";

const saveknowledgebtn =
document.createElement("button");

saveknowledgebtn.className =
"save-knowledge-btn";

const saveknowledgeicon =
document.createElement("i");

saveknowledgeicon.setAttribute(
    "data-lucide",
    "save"
);

const saveknowledgetext =
document.createElement("span");

saveknowledgetext.textContent =
"Save Knowledge";

saveknowledgebtn.addEventListener("click" , function(event) {
    event.preventDefault();

    console.log("saveknowledgebtn is pressed");
     const type = knowledgetype.value;
     const title = knowledgetitle.value;
     const content = knowledgecontent.value;

     const addknowledgedetails = {
        type,
        title,
        content
     };

     console.log(addknowledgedetails);

     fetch("https://brandlens-ai-ptsr.onrender.com/knowledge" , {
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({addknowledgedetails})
     })

     .then(res => res.json())
     .then(data => {
        alert(data.message);

         knowledgetype.value = "Rule";
        knowledgetitle.value = "";
        knowledgecontent.value = "";
     })
})

saveknowledgebtn.appendChild(
    saveknowledgeicon
);

saveknowledgebtn.appendChild(
    saveknowledgetext
);

addknowledgeform.appendChild(
    knowledgetypelabel
);

addknowledgeform.appendChild(
    knowledgetype
);

addknowledgeform.appendChild(
    knowledgetitlelabel
);

addknowledgeform.appendChild(
    knowledgetitle
);

addknowledgeform.appendChild(
    knowledgecontentlabel
);

addknowledgeform.appendChild(
    knowledgecontent
);

addknowledgeform.appendChild(
    saveknowledgebtn
);

addknowledgecard.appendChild(
    addknowledgetop
);

addknowledgecard.appendChild(
    addknowledgepara
);

addknowledgecard.appendChild(
    addknowledgeform
);


const knowledgebottom =
document.createElement("div");

knowledgebottom.className = "knowledge-bottom";

knowledgebottom.appendChild(knowledgehistorycard);
workingcard.appendChild(addknowledgecard);

knowledgebottom.appendChild(workingcard);

knowledgecontainer.appendChild(knowledgebottom);





mainContent.appendChild(knowledgecontainer);
fetch("https://brandlens-ai-ptsr.onrender.com/knowledge/counts")
   
.then(res => res.json())
.then(data => {
     allcount.textContent = data.all;
     rulecount.textContent = data.rules;
     factcount.textContent = data.facts;
     terminologycount.textContent = data.terminology;
     claimcount.textContent = data.claims;
})

lucide.createIcons();
});
const reviewhistory =
document.getElementById("reviewhistorylink");

reviewhistory.addEventListener("click" , function(event) {
    event.preventDefault();

    mainContent.innerHTML = "";

    const historycontainer =
    document.createElement("div");

    historycontainer.className = "history-container";

    const historyheadings = 
    document.createElement("h1");

    historyheadings.textContent = "Review History";

    const historypara =
    document.createElement("p");
    historypara.textContent = "Track previously analyzed content and review outcomes,including compliance scores.detected violations and review details";


    const reviewhistoryheading =
    document.createElement("p");
    reviewhistoryheading.textContent = "Review History";

    historycontainer.appendChild(historyheadings);
    historycontainer.appendChild(historypara);
    historycontainer.appendChild(reviewhistoryheading);

    mainContent.appendChild(historycontainer);

    fetch("http://localhost:3000/reviews" , {
        method : "GET"
    })
    .then(res => res.json())
    .then(data => {
        
        console.log(data);

        data.forEach(review => {
            const cards =
            document.createElement("div");

            cards.className = "history-cards";

            const reviewcontent =
            document.createElement("p");

            reviewcontent.textContent = `content :  ${review.content}`;

            const reviewscore =
             document.createElement("p");
            reviewscore.textContent = `score : ${review.score}%`;

            const reviewdate = 
            document.createElement("p");

            const date = new Date(review.createdAt);

             

            reviewdate.textContent = `Reviewed: ${date.toLocaleString("en-IN", {
                       day: "2-digit",
                       month: "short",
                       year: "numeric",
                       hour: "2-digit",
                       minute: "2-digit",
                       hour12: true,
                       timeZone: "Asia/Kolkata"
})}`;

            cards.appendChild(reviewcontent);
            cards.appendChild(reviewscore);
            cards.appendChild(reviewdate);
            historycontainer.appendChild(cards);
            mainContent.appendChild(historycontainer);

            
        })
    })



})
