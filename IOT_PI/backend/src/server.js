import app from './app.js';
import { WebSocketServer } from 'ws';
import { mqttClient } from './config/mqtt.js';
import { ensureSchema } from './config/db.js';
import { handleTelemetry } from './services/sensor.service.js';
import { handleAck } from './services/action.service.js';

const PORT = process.env.PORT || 3000;
const wss = new WebSocketServer({port: 8080});

// Nhận message từ MQTT
mqttClient.on('message', (topic, payload) => {
  try {
    let msg;
    let text = payload.toString();
    if (topic === 'sensors/state'){
      wss.clients.forEach(client => {
        if (client.readyState==1) client.send(text);
      })
    }
    if (topic === process.env.MQTT_LIGHT_CMD_TOPIC) {
      msg = text;
    } else {
      msg = JSON.parse(text);
    }
    if (topic === process.env.MQTT_TELEMETRY_TOPIC) {
      handleTelemetry(msg);
    }
    if (topic === process.env.MQTT_LIGHT_ACK_TOPIC){
      handleAck(msg);
    }
  } catch (e) {
    console.error('[MQTT] Parse error:', e.message);
  }
});

// Khởi động server
(async () => {
  await ensureSchema();
  app.listen(PORT, () => console.log(`[HTTP] Listening on http://localhost:${PORT}`));
})();
