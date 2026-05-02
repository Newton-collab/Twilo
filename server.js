const express = require("express");
const app = express();
const fetch = require("node-fetch");
const cron = require("node-cron");
const twilio = require("twilio");
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;

const client = twilio(accountSid, authToken);
const API_KEY = "c0a14149323b3cf128454332720c730c";
let subscribers = [];
async function checkWeatherAndSendAlert() {
  try {
    const city = "Lagos"; // you can change this

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    const response = await fetch(url);
    const data = await response.json();

    const temperature = data.main.temp;
    console.log("Subscribers:", subscribers);
    console.log("Current temperature:", temperature);

    if (temperature > 20) {
      console.log("Heat alert triggered!");

      subscribers.forEach((user) => {
  client.messages
    .create({
      body: `⚠️ Heat Alert: It’s ${temperature}°C today. Please make sure children drink plenty of water, stay indoors during hot hours, and avoid too much sun.`,
      from: "whatsapp:+14155238886",
      to: user
    })
    .then((message) => {
      console.log("Alert sent:", message.sid);
    })
    .catch((error) => {
      console.error("Error sending message:", error);
    });
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
cron.schedule("*/1 * * * *", () => {
  console.log("Running scheduled weather check...");
  checkWeatherAndSendAlert();
});
