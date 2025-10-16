// src/components/Navigation.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { Home, User, Radar, Clock } from "lucide-react";

const navItems = [
  { path: "/home", label: "Home", icon: Home },
  { path: "/profile", label: "Profile", icon: User },
  { path: "/data", label: "Data Sensor", icon: Radar },
  { path: "/history", label: "Action History", icon: Clock },
];

const Navigation = () => {
  return (
    <nav className="flex justify-around bg-cyan shadow-md py-3">
      {navItems.map(({ path, label, icon: Icon }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"
            }`
          }
        >
          <Icon size={20} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default Navigation;
