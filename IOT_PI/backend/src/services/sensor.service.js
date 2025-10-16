//Xử lý lưu data sensor
import { insertSensor } from '../models/sensor.model.js';

export async function handleTelemetry(msg) {
  const temperature = Number(msg.temperature ?? msg.temp);
  const humidity = Number(msg.humidity ?? msg.hum);
  const light = Number(msg.light ?? msg.lux);
  const time = msg.time;

  await insertSensor({ temperature, humidity, light, time});
}
