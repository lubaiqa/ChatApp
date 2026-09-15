import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoArrowBackSharp, IoSearch } from "react-icons/io5";
import { toast } from "react-toastify";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import { TbLogout2 } from "react-icons/tb";
import userConversation from "../../Zustand/userConversation";
import { useSocketContext } from "../../context/socketContext";

const Sidebar = ({ onSelectUser }) => {
  const navigate = useNavigate();
  const { authUser, setAuthUser } = useAuth();
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchUser, setSearchUser] = useState([]);
  const [chatUser, setChatUser] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const { setSelectedConversation } = userConversation();
  const { onlineUser, socket } = useSocketContext();

  const nowOnline = chatUser.map((user) => user._id);
  const isOnline = nowOnline.map((userId) => onlineUser.includes(userId));

  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      setUnreadCounts((prev) => {
        if (newMessage.senderId === selectedUserId) return prev;
        return {
          ...prev,
          [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1,
        };
      });
    };

    socket?.on("newMessage", handleNewMessage);
    return () => socket?.off("newMessage", handleNewMessage);
  }, [socket, selectedUserId]);

  useEffect(() => {
    const chatUserHandler = async () => {
      setLoading(true);
      try {
        const chatters = await axios.get(`/api/user/currentchatters`);
        const data = chatters.data;
        if (data.success === false) {
          console.log(data.message);
        }
        setChatUser(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    chatUserHandler();
  }, []);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const search = await axios.get(`/api/user/search?search=${searchInput}`);
      const data = search.data;
      if (data.length === 0) {
        toast.info("User not Found");
      } else {
        setSearchUser(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (user) => {
    onSelectUser(user);
    setSelectedConversation(user);
    setSelectedUserId(user._id);
    setUnreadCounts((prev) => ({ ...prev, [user._id]: 0 }));
  };

  const handleSearchBack = () => {
    setSearchUser([]);
    setSearchInput("");
  };

  const handleLogOut = async () => {
    try {
      const logout = await axios.post("/api/auth/logout");
      toast.info(logout.data?.message);
      localStorage.removeItem("chatapp");
      setAuthUser(null);
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const listToShow = searchUser.length > 0 ? searchUser : chatUser;
  const isSearchMode = searchUser.length > 0;

  return (
    <div className="flex h-full w-full flex-col bg-slate-950/60 p-4 text-slate-100">
      <div className="flex items-center gap-2">
        <form
          onSubmit={handleSearchSubmit}
          className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-slate-800 bg-slate-900/90 px-3 py-2"
        >
          <input
            type="text"
            placeholder="Search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="min-w-0 flex-1 bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
          />
          <button
            type="submit"
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-cyan-500 text-slate-950 hover:bg-cyan-400"
          >
            <IoSearch size={16} />
          </button>
        </form>
        <img
          onClick={() => navigate(`/profile/${authUser?._id}`)}
          src={authUser?.profilepic}
          alt="profile"
          className="h-10 w-10 shrink-0 cursor-pointer rounded-full border border-slate-700 object-cover hover:scale-105"
        />
      </div>

      {isSearchMode && (
        <button
          onClick={handleSearchBack}
          className="mt-3 flex w-fit items-center gap-1 text-xs text-slate-400 hover:text-cyan-300"
        >
          <IoArrowBackSharp size={14} /> Back
        </button>
      )}

      <div className="mt-4 flex-1 space-y-1 overflow-y-auto">
        {loading && (
          <div className="flex justify-center py-6">
            <div className="loading loading-spinner text-cyan-400" />
          </div>
        )}

        {!loading && listToShow.length === 0 && (
          <div className="flex flex-col items-center gap-1 py-10 text-center text-sm text-slate-500">
            <p>Start a Conversation</p>
            <p>Search a user to chat</p>
          </div>
        )}

        {!loading &&
          listToShow.map((user, index) => (
            <div
              key={user._id}
              onClick={() => handleUserClick(user)}
              className={`flex cursor-pointer items-center gap-3 rounded-xl p-2 transition ${
                selectedUserId === user._id
                  ? "bg-cyan-500/20"
                  : "hover:bg-slate-800/60"
              }`}
            >
              <div className="relative shrink-0">
                <img
                  src={user.profilepic}
                  alt={user.username}
                  className="h-11 w-11 rounded-full object-cover"
                />
                {isOnline[index] && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-slate-950 bg-green-400" />
                )}
              </div>

              <p className="truncate text-sm font-medium">{user.username}</p>

              {unreadCounts[user._id] > 0 && (
                <span className="ml-auto flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-green-600 px-1.5 text-[11px] font-bold text-white">
                  {unreadCounts[user._id]}
                </span>
              )}
            </div>
          ))}
      </div>

      <button
        onClick={handleLogOut}
        className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-slate-800 py-2 text-sm text-slate-300 hover:border-red-500/50 hover:text-red-400"
      >
        <TbLogout2 size={18} />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
