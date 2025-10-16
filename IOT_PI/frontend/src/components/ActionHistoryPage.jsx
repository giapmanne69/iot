import React, {useEffect, useState} from "react";
import { useSearchParams } from "react-router-dom";

const ActionHistoryPage = ({
                actionHistory,
                fieldToSearch,
                setFieldToSearch,
                term,
                setTerm,
                pageOrder,
                setPageOrder,
                pageSize,
                setPageSize,
                actionHistorySearch,
                totalCounts,
                setTotalCounts
}) => {
  const [paginated, setPaginated] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const fetchData = async () => {
    const response = await fetch('http://localhost:3000/api/actions/');
    const data = await response.json();
    setPaginated(data["data"]);
    setTotalCounts(data["records"]);
    setFieldToSearch("all");
    setTerm("");
    setPageOrder(1);
    setPageSize(10);
  }

  useEffect(() => {
    fetchData();
    setPaginated(actionHistory["data"]);
    setTotalCounts(actionHistory["records"]);
    setLoading(false);
  }, []);

  useEffect(()=> {
    setLoading(true);
    actionHistorySearch({term,fieldToSearch,pageOrder,pageSize}).finally(()=> setLoading(false));
  },[term,fieldToSearch,pageOrder,pageSize])

  useEffect(() => {
    setPaginated(actionHistory["data"]);
    setTotalCounts(actionHistory["records"]);
    setSearchParams({page: pageOrder, 
      size: pageSize, 
      search: term ? term : "empty", 
      searchField: fieldToSearch ? fieldToSearch : "empty",
   });
  }, [actionHistory]);

  return (
    <div className="p-6 h-[80%] w-[80%] mx-auto flex flex-col">
      <div className="flex flex-row justify-center">
              <h1 className="text-2xl text-black font-bold mb-4">LỊCH SỬ BẬT/TẮT THIẾT BỊ</h1>
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
          <option value="device">Thiết bị</option>
          <option value="time">Thời gian</option>
          <option value="action">Hành động</option>
        </select>
      </div>
      
      {loading ? (
        <div className="flex-1 flex items-center justify-center text-xl text-gray-600">
          <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500 mr-3"></div>
          Đang tải dữ liệu...
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto">
            <table className="w-full bg-white shadow rounded">
              <thead>
                <tr className="bg-gray-200 text-black">
                  <th className="p-2">ID</th>
                  <th className="p-2">Thiết bị</th>           
                  <th className="p-2">Hành động</th>
                  <th className="p-2">Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((row, i) => (
                  <tr key={i} className="border-b text-black">
                    <td className="p-2">{row.id}</td>
                    <td className="p-2"> {row.device}</td>
                    <td className="p-2">{row.action}</td>
                    <td className="p-2">{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Nút phân trang */}
          <div className="mt-4 flex gap-2 justify-between">
            <div className="flex flex-row gap-2">
              {Array.from({ length: Math.ceil(totalCounts / pageSize) > 10 ? 10 : Math.ceil(totalCounts / pageSize) }, (_, i) => (
              <button
                key={i}
                onClick={() => {
                  const newPage = i + 1;
                  setPageOrder(newPage);
                  actionHistorySearch({  term, fieldToSearch, pageOrder: newPage, pageSize });
                }}
                className={`px-3 py-1 rounded ${pageOrder === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
              >
                {i + 1}
              </button>
            ))}
            </div>
            <div className="flex flex-row">
              <input 
                type="text" 
                value={pageSize}
                placeholder="Nhập vào đây"
                className="px-3 py-1 rounded"
                onChange={(e) => {
                  const v = e.target.value;
                  if (!isNaN(v) && v.trim() !== "") {
                    setPageSize(Number(v));
                    setPageOrder(1);
                  } else setPageSize(10);
                }}>  
              </input>
            </div>
          </div>
        </>
      )}
      {/* Bảng lịch sử hành động */}
    </div>
  );
};

export default ActionHistoryPage;
