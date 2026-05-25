chrome.runtime.onMessage.addListener((message) => {

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
        console.log(err);
    });

});