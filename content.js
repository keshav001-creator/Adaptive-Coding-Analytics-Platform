console.log("DSA Tracker Running");

const currentURL = window.location.href;

console.log("Current URL: ", currentURL);

const parts = currentURL.split("/");

const questionName = parts[4];

console.log(questionName);


const startTime = Date.now();

console.log("Start Time:", startTime);

window.addEventListener("beforeunload", () => {

    const endTime = Date.now();

    const timeSpent = (endTime - startTime) / 1000;

    console.log("End Time:", endTime);
    console.log("Time Spent (seconds):", timeSpent);
})

//Document- Represents the entire webpage HTML.
//document.body- visible page body
//innerText all visible text on webpage.
let failedAttempts = 0;
let alreadyDetected = false;

const observer = new MutationObserver(() => {
    const pageText = document.body.innerText;
    if (pageText.includes("Wrong Answer")) {

        if (!alreadyDetected) {
            failedAttempts++;
            alreadyDetected = true;
            console.log("Failed Attempts:", failedAttempts);
        }
    } else {
        alreadyDetected = false;
    }
});

 observer.observe(document.body, {
        childList: true,
        subtree: true
 });