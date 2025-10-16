// src/components/HomePage.jsx
import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  Droplets,
  Thermometer,
  Lightbulb,
  Fan,
  Snowflake,
} from "lucide-react";

const HomePage = ({
  sensors,
  selectedDate,
  setSelectedDate,
  homeSensorData,
  toggleSensor,
}) => {
  // cấu hình chart
  const chartConfig = {
    humidity: { name: "Độ ẩm", unit: "%", color: "#3b82f6" },
    temperature: { name: "Nhiệt độ", unit: "°C", color: "#ef4444" },
    light: { name: "Ánh sáng", unit: " lux", color: "#f59e0b" },
  };

  // Lọc dữ liệu theo ngày và tham số
  const getChartData = () => {
    if (!homeSensorData || homeSensorData.length === 0) return [];

    const filtered = homeSensorData
      .filter((item) => item.time.startsWith(selectedDate))
      .map((item) => ({
        time: item.time.slice(11, 19), // chỉ lấy phần giờ phút giây
        humidity: item.humidity,
        light: item.light, 
        temperature: item.temperature
      }));
    return filtered.slice(-20); // chỉ lấy 20 mẫu cuối cùng
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <header className="h-[10%] flex items-center justify-center">
        <h1 className="text-3xl text-black font-bold mb-6 text-center">
          Bảng Điều Khiển Cảm Biến
        </h1>
      </header>
      
      <main className="h-[90%] flex flex-row">
          {/* Chart */}
        <div className="w-[58%] p-2">
          <div className="bg-white rounded-lg shadow-md p-4 mb-6 overflow-x-auto">
            <div className="flex flex-row">
              <h2 className="text-xl font-semibold text-black mb-4">
                Biểu Đồ (
                {new Date(selectedDate).toLocaleDateString("vi-VN")})
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis yAxisId="left"/>
                <YAxis yAxisId="right" orientation="right"/>
                <Tooltip
                  formatter={(value, name) => {
                    const cfg = chartConfig[name];
                    return [`${value}${cfg ? cfg.unit : ""}`, cfg ? cfg.name : name];
                  }}
                />
                <Legend />
                <Line
                yAxisId="left"
                  type="monotone"
                  dataKey="temperature"
                  stroke={chartConfig.temperature.color}
                  strokeWidth={2}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="humidity"
                  stroke={chartConfig.humidity.color}
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="light"
                  stroke={chartConfig.light.color}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Control + trạng thái */}
        <div className="w-[42%] flex flex-col p-2 gap-2">
          {/* chọn tham số và ngày */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg text-black font-semibold mb-3">
              Chọn thông số và ngày hiển thị trên biểu đồ:
            </h3>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border rounded w-full md:w-auto"
            />
          </div>

          {/* điều khiển thiết bị */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl text-black font-semibold mb-4">
              Điều Khiển Thiết Bị
            </h2>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => toggleSensor("fan")}
                className={`px-6 py-4 rounded-lg flex items-center gap-2 ${
                  sensors["fan"]=="ON" ? "bg-red-500 text-white" : "bg-gray-300"
                }`}
              >
                <Fan size={20} /> {sensors["fan"]=="OFF" ? "TẮT QUẠT" : "BẬT QUẠT"}
              </button>
              <button
                onClick={() => toggleSensor("light")}
                className={`px-6 py-4 rounded-lg flex items-center gap-2 ${
                  sensors["light"]=="ON" ? "bg-yellow-500 text-white" : "bg-gray-300"
                }`}
              >
                <Lightbulb size={20} />{" "}
                {sensors["light"]=="OFF" ? "TẮT ĐÈN" : "BẬT ĐÈN"}
              </button>
              <button
                onClick={() => toggleSensor("aircon")}
                className={`px-6 py-4 rounded-lg flex items-center gap-2 ${
                  sensors["aircon"]=="ON" ? "bg-green-500 text-white" : "bg-gray-300"
                }`}
              >
                <Snowflake size={20} />{" "}
                {sensors["aircon"]=="OFF" ? "TẮT ĐIỀU HÒA" : "BẬT ĐIỀU HÒA"}
              </button>
            </div>
          </div>

          {/* trạng thái cảm biến */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white text-blue-600 p-6 rounded-lg shadow flex items-center gap-2">
              <Droplets />
              Độ Ẩm:{" "}
              {homeSensorData?.length
                ? `${homeSensorData[homeSensorData.length - 1].humidity}%`
                : "--"}
            </div>
            <div className="bg-white text-red-600 p-6 rounded-lg shadow flex items-center gap-2">
              <Thermometer />
              Nhiệt Độ:{" "}
              {homeSensorData?.length
                ? `${homeSensorData[homeSensorData.length - 1].temperature}°C`
                : "--"}
            </div>
            <div className="bg-white text-yellow-600 p-6 rounded-lg shadow flex items-center gap-2">
              <Lightbulb />
              Ánh Sáng:{" "}
              {homeSensorData?.length
                ? `${homeSensorData[homeSensorData.length - 1].light} lux`
                : "--"}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
