chrome.runtime.onMessage.addListener((message) => {

    console.log("Message Received:", message);

    sendToBackend(message);

    return true;
});

async function sendToBackend(event) {
    try {
        const response = await fetch("http://localhost:5000/api/attempt", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(event)


        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
    } catch (err) {
        console.log("Saved to queue");
        saveEvent(event);
    }
}

function saveEvent(event) {
    chrome.storage.local.get(["queue"], (data) => {
        const queue = data.queue || [];
        queue.push(event);

        chrome.storage.local.set({
            queue: queue
        });

        chrome.storage.local.get(["queue"], console.log)
    });
}

async function syncQueue() {

    console.log("Syncing Queue called");

    chrome.storage.local.get(["queue"], async (data) => {

        const queue = data.queue || [];

        if (queue.length === 0) return;

        const remaining = [];

        for (const event of queue) {

            try {
                await fetch("http://localhost:5000/api/attempt", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(event)
                });

            } catch (err) {
                remaining.push(event);
            }
        }

        chrome.storage.local.set({
            queue: remaining
        });

    });
}


setInterval(syncQueue, 60000);