import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoArrowBackSharp, IoSearch } from "react-icons/io5";
import { toast } from "react-toastify";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import { TbLogout2 } from "react-icons/tb";
import userConversation from "../../Zustand/userConversation";
import { useSocketContext } from "../../context/socketContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const { authUser, setAuthUser } = useAuth();
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchUser, setSearchUser] = useState([]);
  const [chatUser, setChatUser] = useState([]);
  const [newMessageUsers, setNewMessageUsers] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const {
    messages,
    setMessage,
    selectedConversation,
    setSelectedConversation,
  } = userConversation();
  const { onlineUser, socket } = useSocketContext();

  const nowOnline = chatUser.map((user) => user._id);

  //chats function
  const isOnline = nowOnline.map((userId) => onlineUser.includes(userId));

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      setNewMessageUsers(newMessage);
    });
    return () => socket?.off("newMessage");
  }, [socket, messages]);

  const talkedwith = chatUser.map((user) => user._id);

  // shows users with whom we chat
  useEffect(() => {
    const chatUserHandler = async () => {
      setLoading(true);

      try {
        const chatters = await axios.get(`/api/user/currentchatters`);

        const data = chatters.data;
        if (data.success === false) {
          setLoading(false);
          console.log(data.message);
        }
        setLoading(false);
        setChatUser(data);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    chatUserHandler();
  }, []);

  // shows users from search result
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const search = await axios.get(`/api/user/search?search=${searchInput}`);
      const data = search.data;
      if (data.success === false) {
        setLoading(false);
        console.log(data.message);
      }
      setLoading(false);
      if (data.loading === 0) {
        toast.info("User not Found");
      } else {
        setSearchUser(data);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  // shows which user is selected
  const handleUserClick = (user) => {
    onSelectUser(user);
    setSelectedConversation(user);
    setSelectedUserId(user._id);
    setNewMessageUsers("");
  };

  // back from search result
  const handleSearchBack = () => {
    setSearchUser([]);
    setSearchInput("");
  };

  // handles logout
  const handleLogOut = async () => {
    const confirmLogOut = window.prompt("Enter your username to confirm");

    if (confirmLogOut === authUser.username) {
      setLoading(true);

      try {
        const logout = await axios.post("/api/auth/logout");
        const data = logout.data;

        if (data.success === false) {
          setLoading(false);
          console.log(data?.message);
        }
        toast.info(data?.message);
        localStorage.removeItem("chatapp");
        setAuthUser(null);
        setLoading(false);
        navigate("/login");
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    } else {
      toast.info("Username not found. Please check and try again.");
    }
  };

  return (
    <div className="w-full md:w-1/4 rounded-[1.75rem] border border-slate-800 bg-slate-900/95 p-5 shadow-lg shadow-slate-950/20">
      <div className="flex items-center justify-between gap-2 min-w-0">
        <form
          onSubmit={handleSearchSubmit}
          className="flex w-full min-w-0 items-center gap-2 rounded-full border border-slate-800 bg-slate-950/90 px-3 py-2"
        >
          <input
            type="text"
            placeholder="Search User"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1 min-w-0 bg-transparent text-slate-100 outline-none placeholder:text-slate-500"
          />

          <button
            className="btn btn-circle bg-cyan-500 text-slate-950 hover:bg-cyan-400"
            type="submit"
          >
            <IoSearch />
          </button>
        </form>
        <div className="shrink-0">
          <img
            onClick={() => navigate(`/profile/${authUser?._id}`)}
            src={authUser?.profilepic}
            alt="profile"
            className="h-12 w-12 rounded-full object-cover hover:scale-110 cursor-pointer border border-slate-700"
          />
        </div>
      </div>

      <div className="divider px-3" />

      {searchUser?.length > 0 ? (
        <>
          <div className="min-h-[70%] max-h-[80%] m overflow-y-auto scrollbar">
            <div className="w-auto">
              {searchUser.map((user, index) => (
                <div key={user._id}>
                  <div
                    onClick={() => handleUserClick(user)}
                    className={`flex gap-3 items-center rounded p-2 py-1 cursor-pointer ${selectedUserId === user?.id ? "bg-sky-500" : ""}`}
                  >
                    {/*Socket is Online */}
                    <div
                      className={`avatar ${isOnline[index] ? "online" : ""}`}
                    >
                      <div className="w-12 rounded-full">
                        <img src={user.profilepic} alt="user.img" />
                      </div>
                    </div>

                    <div className="flex flex-col flex-1">
                      <p className="font-bold text-gray-950">
                        {user.username}{" "}
                      </p>
                    </div>
                  </div>

                  <div className="divider divide-solid px-3 h-px"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto px-1 py-1 flex">
            <button
              onClick={handleSearchBack}
              className="rounded-full bg-white px-2 py-1 self-center"
            >
              <IoArrowBackSharp size={25} />
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="min-h-[70%] max-h-[80%] overflow-y-auto scrollbar">
            <div className="w-auto text-slate-300">
              {chatUser.length === 0 ? (
                <>
                  <div className="font-bold items-center flex flex-col text-xl text-yellow-500">
                    <h1>Start a Conversation</h1>
                    <h1>Seach User for Chat</h1>
                  </div>
                </>
              ) : (
                <>
                  {chatUser.map((user, index) => (
                    <div key={user._id}>
                      <div
                        onClick={() => handleUserClick(user)}
                        className={`flex gap-3 items-center rounded p-2 py-1 cursor-pointer ${selectedUserId === user?._id ? "bg-sky-500" : ""}`}
                      >
                        {/* Socket is Online */}
                        <div
                          className={`avatar ${isOnline[index] ? "online" : ""}`}
                        >
                          <div className="w-12 rounded-full">
                            <img src={user.profilepic} alt="user.img" />
                          </div>
                        </div>
                        <div className="flex flex-col flex-1">
                          <p className="font-bold text-gray-950">
                            {user.username}{" "}
                          </p>
                        </div>

                        <div>
                          {newMessageUsers.receiverId === authUser._id &&
                          newMessageUsers.senderId === user._id ? (
                            <div className="rounded-full bg-green-700 text-sm text-white px-[4px] ">
                              +1{" "}
                            </div>
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>

                      <div className="divider divide-solid px-3 h-px"></div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          <div className="mt-auto px-1 py-1 flex">
            <button
              className="  hover:bg-red-600 w-10 cursor-pointer hover:text-white rounded-lg  "
              onClick={handleLogOut}
            >
              <TbLogout2 size={25} />
            </button>
            <p className="text-sm py-1">Logout</p>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
