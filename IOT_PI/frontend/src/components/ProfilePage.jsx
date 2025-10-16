import React from "react";
// Import icons để giao diện trông đẹp hơn
import { Github, FileText } from 'lucide-react';

const ProfilePage = () => (
    // Thêm nền xám và padding cho toàn bộ trang để thẻ profile nổi bật hơn
    <div className="min-h-screen bg-green-100 p-4 sm:p-8 flex flex-col items-center">
        {/* Tiêu đề: Cỡ chữ nhỏ hơn trên mobile */}
        <h1 className="text-2xl sm:text-3xl text-black font-bold mb-6 sm:mb-8 text-center">Thông Tin Chủ Sở Hữu</h1>

        <div className="w-full max-w-3xl">
            {/* === DIV 1: KHỐI THÔNG TIN CHÍNH === */}
            <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                
                {/* Phần ảnh đại diện: Kích thước nhỏ hơn một chút trên mobile */}
                <div className="flex-shrink-0">
                    <img
                        src="/IMG_0940.JPG"
                        alt="Avatar"
                        className="w-60 h-60 rounded-full object-cover border-4 border-blue-200"
                    />
                    <h2 className="text-xl text-black font-semibold mt-4 text-center sm:hidden">Nguyễn Thế Giáp</h2>
                </div>
                {/* Phần thông tin chi tiết */}
                <div className="ml-4 w-full">
                    <h2 className="hidden sm:block text-2xl text-black font-bold mb-4">Nguyễn Thế Giáp</h2>
                    <div>
                        <label className="text-sm text-gray-500">Mã sinh viên:</label>
                        <p className="text-gray-900 font-medium">B22DCCN251</p>
                    </div>
                    <div className="border-t pt-2">
                        <label className="text-sm text-gray-500">Email:</label>
                        <p className="text-gray-900 font-medium">giap200496@gmail.com</p>
                    </div>
                    <div className="border-t pt-2">
                        <label className="text-sm text-gray-500">Số điện thoại:</label>
                        <p className="text-gray-900 font-medium">0389 388 694</p>
                    </div>
                </div>
            </div>

            {/* === CONTAINER CHO 2 DIV LINK BÊN DƯỚI === */}
            {/* Sử dụng Grid để tự động chia thành 2 cột trên màn hình lớn và 1 cột trên di động */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* === DIV 2: LINK GITHUB === */}
                <div className="bg-white rounded-lg shadow-lg p-6 flex items-center gap-4">
                    <Github className="w-8 h-8 text-gray-700 flex-shrink-0" />
                    <div className="flex-grow overflow-hidden"> {/* Thêm overflow-hidden để truncate hoạt động */}
                        <label className="text-sm text-gray-500">Link Github:</label>
                        <a href="https://github.com/giapmanne69/iot/tree/main/IOT_PI" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block truncate">
                           https://github.com/giapmanne69
                        </a>
                    </div>
                </div>

                {/* === DIV 3: FILE PDF === */}
                <div className="bg-white rounded-lg shadow-lg p-6 flex items-center gap-4">
                    <FileText className="w-8 h-8 text-gray-700 flex-shrink-0" />
                    <div className="flex-grow overflow-hidden">
                        <label className="text-sm text-gray-500">File PDF Báo cáo:</label>
                        <a href="https://drive.google.com/file/d/1mDxx58nQ6JLsr0x39e-EqBkgaKO__L0_/view?usp=sharing" className="text-blue-600 hover:underline block truncate">
                            Xem chi tiết tại đây
                        </a>
                    </div>
                </div>

            </div>
        </div>
    </div>
);

export default ProfilePage;
