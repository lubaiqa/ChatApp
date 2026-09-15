import React, { useState } from "react";
import Sidebar from "./components/sidebar";
import MessageContainer from "./components/messageContainer";

const Home = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setIsSidebarVisible(false);
  };
  const handleShowSidebar = () => {
    setIsSidebarVisible(true);
    setSelectedUser(null);
  };

  return (
    <div className="flex h-[95vh] md:h-[90vh] w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/90 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
      <div
        className={`w-full md:w-[320px] md:shrink-0 border-r border-white/10 ${
          isSidebarVisible ? "flex" : "hidden md:flex"
        }`}
      >
        <Sidebar onSelectUser={handleUserSelect} />
      </div>
      <div
        className={`flex-1 min-w-0 ${
          isSidebarVisible ? "hidden md:flex" : "flex"
        }`}
      >
        <MessageContainer onBackUser={handleShowSidebar} />
      </div>
    </div>
  );
};

export default Home;
