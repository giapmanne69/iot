//Xử lý gửi lệnh/nhận ACk
import { mqttClient } from '../config/mqtt.js';
import { insertAction } from '../models/action.model.js';

export function handleAck(msg) {
  const { device, action, time } = msg;

  if (device && action && time) {
    insertAction({ device, action, time });
  }
}

export async function sendCommand({device}) {
  mqttClient.publish(process.env.MQTT_LIGHT_CMD_TOPIC, device);
}
