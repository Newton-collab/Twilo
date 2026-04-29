const express = require("express");
const app = express();
const fetch = require("node-fetch");
const API_KEY = "c0a14149323b3cf128454332720c730c";
let subscribers = [];
async function checkWeatherAndSendAlert() {
  try {
    const city = "Lagos"; // you can change this

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    const response = await fetch(url);
    const data = await response.json();

    const temperature = data.main.temp;

    console.log("Current temperature:", temperature);

    if (temperature > 35) {
      console.log("Heat alert triggered!");

      subscribers.forEach((user) => {
        console.log(`Send alert to ${user}`);
        // we will send real messages next
      });
    }

  } catch (error) {
    console.error("Weather error:", error);
  }
}
app.use(express.urlencoded({ extended: false }));

app.post("/webhook", (req, res) => {
   console.log(req.body);
  const message = req.body.Body;

  let reply = "Welcome to Climate Health Alerts. Reply YES to subscribe.";

  if (message && message.toLowerCase() === "yes") {
    reply = "You are now subscribed. You will receive health alerts.";
 if (message && message.toLowerCase() === "yes") {
  const userNumber = req.body.From;

  if (!subscribers.includes(userNumber)) {
    subscribers.push(userNumber);
     console.log(subscribers);
    reply = "You are now subscribed to Climate Health Alerts.";
  } else {
    reply = "You are already subscribed.";
  }
}
}
checkWeatherAndSendAlert();
  const twiml = `
    <Response>
      <Message>${reply}</Message>
    </Response>
  `;

  res.set("Content-Type", "text/xml");
  res.send(twiml);
});

app.get("/", (req, res) => {
  res.send("Bot is running");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});
