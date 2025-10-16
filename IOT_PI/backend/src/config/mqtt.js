import mqtt from 'mqtt';
import 'dotenv/config';

const mqttOptions = {
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
  reconnectPeriod: 2000,
  connectTimeout: 15000,
};

export const mqttClient = mqtt.connect(process.env.MQTT_URL, mqttOptions);

mqttClient.on('connect', () => {
  console.log('[MQTT] Connected');
  mqttClient.subscribe([
    process.env.MQTT_TELEMETRY_TOPIC,
    process.env.MQTT_LIGHT_ACK_TOPIC,
    process.env.MQTT_SENSOR_STATE
  ]);
});

mqttClient.on('error', (err) => {
  console.error('[MQTT] Error:', err.message);
});
