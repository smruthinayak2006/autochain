import express from "express";
import mqtt from "mqtt";
import db from "./database.js";
import telemetryRoutes from "./routes/telemetry.js";

const app = express();
app.use(express.json());

const mqttClient = mqtt.connect("mqtt://localhost:1883");

mqttClient.on("connect", () => {
  console.log("✅ Connected to EMQX");

  mqttClient.subscribe("autochain/ev/EV001", (err) => {
    if (err) {
      console.error("❌ Subscription failed:", err);
    } else {
      console.log("📡 Subscribed to autochain/ev/EV001");
    }
  });
});

mqttClient.on("message", (topic, message) => {
  const data = JSON.parse(message.toString());

  db.prepare(`
    INSERT INTO telemetry (
      deviceId,
      battery,
      wallet,
      latitude,
      longitude,
      status,
      timestamp
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    data.deviceId,
    data.battery,
    data.wallet,
    data.latitude,
    data.longitude,
    data.status,
    data.timestamp
  );

  console.log(`📥 Stored telemetry from ${data.deviceId}`);
});

mqttClient.on("error", (err) => {
  console.error("MQTT Error:", err.message);
});

app.get("/", (_, res) => {
  res.json({
    project: "AutoChain",
    status: "Backend Running"
  });
});

const PORT = 3000;
app.use("/api/telemetry", telemetryRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});