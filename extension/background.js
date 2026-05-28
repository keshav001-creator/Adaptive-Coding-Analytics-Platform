console.log("Background Service Worker Running");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    console.log("Message Received:", message);

    fetch("http://localhost:5000/api/attempt", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(message)
    })
    .then((res) => res.json())
    .then((data) => {
        console.log("Backend Response:", data);
    })
    .catch((err) => {
        console.log("Fetch Error:", err);
        sendResponse({ error: err.message });
    });

    return true; // Keep the message channel open for sendResponse

});