const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));

app.post("/webhook", (req, res) => {
   console.log(req.body);
  const message = req.body.Body;

  let reply = "Welcome to Climate Health Alerts. Reply YES to subscribe.";

  if (message && message.toLowerCase() === "yes") {
    reply = "You are now subscribed. You will receive health alerts.";
  }

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
