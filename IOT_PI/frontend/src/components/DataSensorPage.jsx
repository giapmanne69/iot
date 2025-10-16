import React, { useEffect, useState} from "react";
import { useSearchParams } from "react-router-dom";

const DataSensorPage = ({
                sensorData,
                fieldToSearch,
                setFieldToSearch,
                term,
                setTerm,
                fieldToSort,
                setFieldToSort,
                sort,
                setSort,
                pageOrder,
                setPageOrder,
                pageSize,
                setPageSize,
                sensorDataSearch,
                totalCounts,
                setTotalCounts
}) => {
  const [paginated, setPaginated] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const fetchData = async () => {
    const response = await fetch('http://localhost:3000/api/sensors/');
    const data = await response.json();
    const pageFromUrl = Number(searchParams.get('page')) || 1;
    const sizeFromUrl = Number(searchParams.get('size')) || 10;
    setPaginated(data["data"]);
    setTotalCounts(data["records"]);
    setFieldToSearch("all");
    setFieldToSort("id");;
    setSort("DESC");
    setTerm("");
    setPageOrder(pageFromUrl);
    setPageSize(sizeFromUrl);
  }

  useEffect(() => {
    fetchData();
    setPaginated(sensorData["data"]);
    setTotalCounts(sensorData["records"]);
    setLoading(false);
  }, []);

  useEffect(()=> {
    setLoading(true);
    sensorDataSearch({fieldToSort,sort,term,fieldToSearch,pageOrder,pageSize}).finally(()=> setLoading(false));
  },[fieldToSort,sort,term,fieldToSearch,pageOrder,pageSize])

  useEffect(() => {
    setPaginated(sensorData["data"]);
    setTotalCounts(sensorData["records"]);
    setSearchParams({ 
      page: pageOrder, 
      size: pageSize, 
      search: term ? term : "empty", 
      searchField: fieldToSearch ? fieldToSearch : "empty",
      sortField: fieldToSort ? fieldToSort : "empty",
      sortOrder: sort
    });
  }, [sensorData]);

  return (
    <div className="p-6 h-[80%] w-[80%] mx-auto flex flex-col">
      <div className="flex flex-row justify-center">
              <h1 className="text-2xl text-black font-bold mb-4">DỮ LIỆU CẢM BIẾN</h1>
              <div className="p-2"><button 
                onClick={() => {
                  setLoading(true);
                  fetchData().finally(() => setLoading(false));
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg mb-4"
              >
                🔄
              </button></div>
      </div>

      {/* Ô tìm kiếm + chọn trường */}
      <div className="flex gap-4 mb-4">
        <select
          value={fieldToSort}
          onChange={(e) => setFieldToSort(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="id">ID</option>
          <option value="time">Thời gian</option>
          <option value="humidity">Độ ẩm</option>
          <option value="temperature">Nhiệt độ</option>
          <option value="light">Ánh sáng</option>
        </select>
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value)
            setPageOrder(1);
          }}
          className="border p-2 rounded"
        >
          <option value="DESC">Giảm</option>
          <option value="ASC">Tăng</option>
        </select>
        <input
          type="text"
          value={term}
          onChange={(e) => {
            setTerm(e.target.value);
            setPageOrder(1);
          }}
          placeholder="Tìm kiếm..."
          className="border p-2 rounded flex-1"
        />

        <select
          value={fieldToSearch}
          onChange={(e) => setFieldToSearch(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">Tất cả</option>
          <option value="id">ID</option>
          <option value="time">Thời gian</option>
          <option value="humidity">Độ ẩm</option>
          <option value="temperature">Nhiệt độ</option>
          <option value="light">Ánh sáng</option>
        </select>
      </div>
      
      {loading ? (
        <div className="flex-1 flex items-center justify-center text-xl text-gray-600">
          <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500 mr-3"></div>
          Đang tải dữ liệu...
        </div>
      ) : (
      <>
        <div className="flex-1 overflow-auto">
        {/* Bảng dữ liệu */}
        <table className="w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-200 text-black">
              <th className="p-2">ID</th>
              <th className="p-2">Độ ẩm (%)</th>
              <th className="p-2">Nhiệt độ (°C)</th>
              <th className="p-2">Ánh sáng (lux)</th>
              <th className="p-2">Thời gian</th>
            </tr>
          </thead>
          <tbody>
            {
            paginated.map((row, i) => {
              return (
              <tr key={i} className="border-b text-black">
                <td className="p-2">{row.id}</td>
                <td className="p-2">{row.humidity}</td>
                <td className="p-2">{row.temperature}</td>
                <td className="p-2">{row.light}</td>
                <td className="p-2">{row.time}</td>
              </tr>
            )
            })}
          </tbody>
        </table>
      </div>

        {/* Nút phân trang */}
        <div className="mt-4 flex gap-2 justify-between">
  <div className="flex gap-2">
    {Array.from(
      { length: Math.ceil(totalCounts / pageSize) > 10 ? 10 : Math.ceil(totalCounts / pageSize) },
      (_, i) => (
        <button
          key={i}
          onClick={() => {
            const newPage = i + 1;
            setPageOrder(newPage);
            sensorDataSearch({ fieldToSort, sort, term, fieldToSearch, pageOrder: newPage, pageSize });
          }}
          className={`px-3 py-1 rounded ${
            pageOrder === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
          }`}
        >
          {i + 1}
        </button>
      )
    )}
  </div>

  <div className="flex flex-row">
    <input
      type="text"
      value={pageSize}
      onChange={(e) => {
        const v = e.target.value;
        if (!isNaN(v) && v.trim() !== "") {
          setPageSize(Number(v));
          setPageOrder(1);
        } else setPageSize(10);
      }}
      className="px-3 py-1 rounded border"
    />
  </div>
</div>

      </>
      )}
    </div>
  );
};

export default DataSensorPage;
