// src/components/SensorDashboard.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navigation from "./Navigation";
import HomePage from "./HomePage";
import ProfilePage from "./ProfilePage";
import DataSensorPage from "./DataSensorPage";
import ActionHistoryPage from "./ActionHistoryPage";

const SensorDashboard = ({
  sensorData,
  actionHistory,
  sensors,
  selectedDate,
  setSelectedDate,
  homeSensorData,
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
  actionHistorySearch,
  toggleSensor,
  totalCounts,
  setTotalCounts
}) => {
  return (
    <Router>
      <div className="h-screen w-screen flex flex-col overflow-hidden bg-green-100">
        {/* Thanh điều hướng */}
        <Navigation />

        {/* Nội dung trang */}
        <Routes>
          <Route
            path="/"
            element={
              <Navigate to="/home" replace />
            }
          />

          <Route
            path="/home"
            element={
              <HomePage
                sensors={sensors}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                homeSensorData={homeSensorData}
                toggleSensor={toggleSensor}
              />
            }
          />

          <Route path="/profile" element={<ProfilePage />} />

          <Route
            path="/data"
            element={
              <DataSensorPage
                sensorData={sensorData}
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
                totalCounts={totalCounts}
                setTotalCounts ={setTotalCounts}
              />
            }
          />

          <Route
            path="/history"
            element={
              <ActionHistoryPage
                actionHistory={actionHistory}
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
                actionHistorySearch={actionHistorySearch}
                totalCounts={totalCounts}
                setTotalCounts ={setTotalCounts}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default SensorDashboard;
