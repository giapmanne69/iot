// src/App.jsx
import React, {useEffect, useState } from "react";
import SensorDashboard from "./components/SensorDashboard";

const App = () => {
  const [sensorData, setSensorData] = useState([]);
  const [homeSensorData, setHomeSensorData] = useState([]);
  const [actionHistory, setActionHistory] = useState([]);
  const [sensorsState, setSensorsState] = useState({
    fan: "OFF",
    aircon: "OFF",
    light: "OFF",
  });
  const [currentValues, setCurrentValues] = useState({
    humidity: 0,
    temperature: 0,
    light: 0,
  });
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [fieldToSearch, setFieldToSearch] = useState("all");
  const [term, setTerm] = useState("");
  const [fieldToSort, setFieldToSort] = useState("id");
  const [sort, setSort] = useState("");
  const [pageOrder, setPageOrder] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCounts, setTotalCounts] = useState(100);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
      try {
            // Gọi tất cả API ban đầu một cách song song để tăng tốc độ
            const [sensorRes, actionRes, homeSensorRes] = await Promise.all([
                fetch("http://localhost:3000/api/sensors/"),
                fetch("http://localhost:3000/api/actions/"),
                fetch("http://localhost:3000/api/sensors/homes"),
            ]);
            // Xử lý kết quả trả về
            const sensorJson = await sensorRes.json();
            const actionJson = await actionRes.json();
            const homeSensorJson = await homeSensorRes.json();

            // Cập nhật tất cả state
            setSensorData(sensorJson);
            setActionHistory(actionJson);
            setHomeSensorData(homeSensorJson);

            // QUAN TRỌNG: Cập nhật currentValues ngay từ lần fetch đầu tiên
            if (homeSensorJson.length > 0) {
                const latest = homeSensorJson[homeSensorJson.length - 1];
                setCurrentValues({
                    humidity: latest.humidity,
                    temperature: latest.temperature,
                    light: latest.light,
                });
            }
        } catch (err) {
            console.error("❌ Lỗi khi fetch dữ liệu ban đầu:", err);
        } finally {
            setLoading(false); // Chỉ tắt loading sau khi tất cả đã hoàn tất
        }
    };

  const homeFetchData = async () => {
    try {
        const sensorRes = await fetch("http://localhost:3000/api/sensors/homes");
        const sensorJson = await sensorRes.json();
        setHomeSensorData(sensorJson);
        if (sensorJson.length > 0) {
            const latest = sensorJson[sensorJson.length - 1];
            setCurrentValues({
                humidity: latest.humidity,
                temperature: latest.temperature,
                light: latest.light,
            });
        }
      } catch (err) {
          console.error("❌ Lỗi khi fetch dữ liệu homes định kỳ:", err);
      }
  };

  const homeFetchLatestState = async () => {
    try {
      const latest = await fetch("http://localhost:3000/api/actions/latest");
      const data = await latest.json();
      console.log("Data:",data);
      const temp = {};
      for (const device of data) temp[device["device"]] = device["action"];
      console.log("Temp:", temp);
      setSensorsState(temp);
    } catch (e){
      console.error("Lỗi lấy dữ liệu mới nhất của thiết bị: ", e.message);
    }
  }
  // Lấy dữ liệu ban đầu
  useEffect(() => {
    fetchData();  
    const socket = new WebSocket("ws://localhost:8080");
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log(data);
        setSensorsState(data);
      }
    homeFetchLatestState();
  }, []);

  //Lấy dữ liệu mỗi 2 giây trong trang Home
  useEffect(() => {
    const interval = setInterval(() => {
      homeFetchData();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

      useEffect(() => {
    }, [homeSensorData]);
  // Lấy dữ liệu trong bảng DataSensor
  const sensorDataSearch = async ({fieldToSearch, term, fieldToSort, sort, pageSize, pageOrder}) => {
    try {
      let body = {};
      if (fieldToSearch && term) {
        body.fieldToSearch = fieldToSearch;
        body.term = term;
        setFieldToSearch(fieldToSearch);
        setTerm(term);
      }
      if (fieldToSort && sort) {
        body.fieldToSort = fieldToSort;
        body.sort = sort;
        setFieldToSort(fieldToSort);
        setSort(sort);
      }
      if (pageSize) {
        body.pageSize = pageSize;
        setPageSize(pageSize);
      }
      if (pageOrder) {
        body.pageOrder = pageOrder;
        setPageOrder(pageOrder);
      }
      const response = await fetch(`http://localhost:3000/api/sensors/adjust`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      setSensorData(data);
    } catch (err) {
      console.error("❌ Lỗi khi tìm kiếm dữ liệu cảm biến:", err);
      setSensorData([]); 
    }
  }

  // Lấy dữ liệu trong bảng Action History
  const actionHistorySearch = async ({fieldToSearch, term, pageSize, pageOrder}) => {
    try {
      let body = {};
      if (fieldToSearch && term) {
        body.fieldToSearch = fieldToSearch;
        body.term = term;
        setFieldToSearch(fieldToSearch);
        setTerm(term);
      }
      if (pageSize) {
        body.pageSize = pageSize;
        setPageSize(pageSize);
      }
      if (pageOrder) {
        body.pageOrder = pageOrder;
        setPageOrder(pageOrder);
      }
      const response = await fetch(`http://localhost:3000/api/actions/adjust`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      setActionHistory(data);
    } catch (err) {
      console.error("❌ Lỗi khi tìm kiếm lịch sử hành động:", err);
    }
  }
  
  // Bật tắt thiết bị
  const toggleSensor = async (device) => {
    try {
      const response = await fetch(`http://localhost:3000/api/actions/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ device }),
      });
      const data = await response.json();
      if (data.message == "OK"){

      } else {}
    } catch (err) {
      console.error("❌ Lỗi khi thay đổi trạng thái thiết bị:", err);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold">Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <SensorDashboard
      sensorData={sensorData}
      actionHistory={actionHistory}
      sensors={sensorsState}
      currentValues={currentValues}
      selectedDate={selectedDate}
      setSelectedDate={setSelectedDate}
      homeSensorData={homeSensorData}
      fieldToSearch={fieldToSearch}
      setFieldToSearch={setFieldToSearch}
      term={term}
      setTerm={setTerm}
      fieldToSort={fieldToSort}
      setFieldToSort={setFieldToSort}
      sort={sort}
      setSort={setSort}
      pageOrder={pageOrder}
      setPageOrder={setPageOrder}
      pageSize={pageSize}
      setPageSize={setPageSize}
      sensorDataSearch={sensorDataSearch}
      actionHistorySearch={actionHistorySearch}
      toggleSensor={toggleSensor}
      totalCounts={totalCounts}
      setTotalCounts={setTotalCounts}
    />
  );
};

export default App;
