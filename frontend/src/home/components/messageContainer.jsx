import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/authContext";
import { SiTheconversation } from "react-icons/si";
import userConversation from "../../Zustand/userConversation";
import { IoArrowBackSharp, IoSend } from "react-icons/io5";
import axios from "axios";
import { useSocketContext } from "../../context/socketContext";
import notify from "../../assets/sound/notification.mp3";

const MessageContainer = ({ onBackUser }) => {
  const { messages, selectedConversation, setMessage } = userConversation();
  const { authUser } = useAuth();
  const { socket } = useSocketContext();
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendData, setSendData] = useState("");
  const lastMessageRef = useRef();

  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      const sound = new Audio(notify);
      sound.play();
      setMessage((prevMessages) => [...prevMessages, newMessage]);
    };

    socket?.on("newMessage", handleNewMessage);
    return () => socket?.off("newMessage", handleNewMessage);
  }, [socket, setMessage]);

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef?.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const get = await axios.get(
          `/api/message/${selectedConversation?._id}`,
        );
        setMessage(get.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (selectedConversation?._id) getMessages();
  }, [selectedConversation?._id, setMessage]);

  const handleMessages = (e) => {
    setSendData(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sendData.trim()) return;
    setSending(true);
    try {
      const res = await axios.post(
        `/api/message/send/${selectedConversation?._id}`,
        { message: sendData },
      );
      setSendData("");
      setMessage((prevMessages) => [...prevMessages, res.data]);
    } catch (error) {
      console.log(error);
    } finally {
      setSending(false);
    }
  };

  if (selectedConversation === null) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-center">
        <SiTheconversation className="text-6xl text-slate-700" />
        <p className="text-xl font-semibold text-slate-200">
          Welcome, {authUser.username}!
        </p>
        <p className="text-sm text-slate-500">
          Select a chat to start a conversation
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center gap-3 border-b border-white/10 bg-slate-900/80 px-4 py-3">
        <button
          onClick={() => onBackUser(true)}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-800 text-slate-200 md:hidden"
        >
          <IoArrowBackSharp size={18} />
        </button>
        <img
          src={selectedConversation?.profilepic}
          alt={selectedConversation?.username}
          className="h-9 w-9 rounded-full object-cover"
        />
        <span className="font-semibold text-slate-100">
          {selectedConversation?.username}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        {loading && (
          <div className="flex h-full items-center justify-center">
            <div className="loading loading-spinner text-cyan-400" />
          </div>
        )}

        {!loading && messages?.length === 0 && (
          <p className="mt-10 text-center text-sm text-slate-500">
            Send a message to start the conversation
          </p>
        )}

        {!loading &&
          messages?.length > 0 &&
          messages.map((message) => (
            <div
              key={message._id}
              ref={lastMessageRef}
              className={`chat ${
                message.senderId === authUser._id ? "chat-end" : "chat-start"
              }`}
            >
              <div
                className={`chat-bubble text-sm text-white ${
                  message.senderId === authUser._id
                    ? "bg-cyan-600"
                    : "bg-slate-800"
                }`}
              >
                {message.message}
              </div>
              <div className="chat-footer mt-1 text-[10px] text-slate-500">
                {new Date(message.createdAt).toLocaleDateString("en-PK")}{" "}
                {new Date(message.createdAt).toLocaleTimeString("en-PK", {
                  hour: "numeric",
                  minute: "numeric",
                })}
              </div>
            </div>
          ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 border-t border-white/10 bg-slate-900/80 px-4 py-3"
      >
        <input
          value={sendData}
          onChange={handleMessages}
          required
          type="text"
          placeholder="Type a message"
          className="min-w-0 flex-1 rounded-full border border-slate-700 bg-slate-950/90 px-4 py-2 text-sm text-slate-100 outline-none focus:border-cyan-500"
        />
        <button
          type="submit"
          disabled={sending}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-cyan-500 text-slate-950 hover:bg-cyan-400 disabled:opacity-50"
        >
          {sending ? (
            <div className="loading loading-spinner loading-sm" />
          ) : (
            <IoSend size={18} />
          )}
        </button>
      </form>
    </div>
  );
};

export default MessageContainer;
