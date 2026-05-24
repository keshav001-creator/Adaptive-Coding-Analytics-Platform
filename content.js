console.log("DSA Tracker Running");


// ---------------- CURRENT QUESTION ----------------

function getQuestionSlug() {

    const parts = window.location.href.split("/");

    if (parts[3] === "problems") {
        return parts[4];
    }

    return null;
}

console.log("Current Question:", currentQuestion);


// ---------------- TIMER VARIABLES ----------------

let startTime = Date.now();

let totalTime = 0;

let isTabActive = true;


// ---------------- FAILED ATTEMPT VARIABLES ----------------

let failedAttempts = 0;

let alreadyDetected = false;


// ---------------- FUNCTION TO SEND / PRINT DATA ----------------

function finalizeQuestionSession() {

    // Add current active session time
    if (isTabActive) {

        const currentSessionTime = Date.now() - startTime;

        totalTime += currentSessionTime;
    }

    const finalTimeInSeconds = totalTime / 1000;

    console.log("------------- QUESTION COMPLETED -------------");

    console.log("Question:", currentQuestion);

    console.log("Final Time:", finalTimeInSeconds);

    console.log("Failed Attempts:", failedAttempts);

    console.log("----------------------------------------------");


    // SEND DATA TO BACKEND
    chrome.runtime.sendMessage({
    question: currentQuestion,
    timeSpent: finalTimeInSeconds,
    failedAttempts: failedAttempts
});

}


// ---------------- RESET TRACKING FOR NEW QUESTION ----------------

function resetTracking(newQuestion) {

    currentQuestion = newQuestion;

    startTime = Date.now();

    totalTime = 0;

    isTabActive = true;

    failedAttempts = 0;

    alreadyDetected = false;

    console.log("Tracking Started For:", currentQuestion);
}


// ---------------- TAB VISIBILITY TRACKING ----------------

document.addEventListener("visibilitychange", () => {

    // USER LEFT TAB
    if (document.hidden) {

        if (isTabActive) {

            const currentSessionTime = Date.now() - startTime;

            totalTime += currentSessionTime;

            isTabActive = false;

            console.log("Timer Paused");

            console.log(
                "Total Active Time Till Now:",
                totalTime / 1000,
                "seconds"
            );
        }

    }

    // USER RETURNED TO TAB
    else {

        if (!isTabActive) {

            startTime = Date.now();

            isTabActive = true;

            console.log("Timer Resumed");
        }
    }
});


// ---------------- DETECT QUESTION CHANGE ----------------

setInterval(() => {

    const newQuestion =
        window.location.href.split("/")[4];

    // SAME QUESTION
    if (newQuestion === currentQuestion) {
        return;
    }

    // NEW QUESTION DETECTED

    console.log("Question Changed");

    finalizeQuestionSession();

    resetTracking(newQuestion);

}, 1000);



// ---------------- PAGE CLOSE / REFRESH ----------------

window.addEventListener("beforeunload", () => {

    finalizeQuestionSession();

});


// ---------------- WRONG ANSWER DETECTION ----------------

const observer = new MutationObserver(() => {

    const pageText = document.body.innerText;

    if (pageText.includes("Wrong Answer")) {

        if (!alreadyDetected) {

            failedAttempts++;

            alreadyDetected = true;

            console.log(
                "Failed Attempts:",
                failedAttempts
            );
        }

    } else {

        alreadyDetected = false;
    }

});


// ---------------- START OBSERVER ----------------

observer.observe(document.body, {
    childList: true,
    subtree: true
});