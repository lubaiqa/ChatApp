import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const Login = () => {
  const navigate = useNavigate();
  const { setAuthUser } = useAuth();

  const [userInput, setUserInput] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInput = (e) => {
    setUserInput({
      ...userInput,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const login = await axios.post(`/api/auth/login`, userInput);
      const data = login.data;
      if (data.success === false) {
        setLoading(false);
        return;
      }
      toast.success(data.message);
      localStorage.setItem("chatapp", JSON.stringify(data));
      setAuthUser(data);
      setLoading(false);
      navigate("/");
    } catch (error) {
      setLoading(false);
      toast.error(error?.response?.data?.message || "Unable to login");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950/90 px-4 py-10 text-slate-100">
      <div className="mx-auto w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[.28em] text-cyan-300/80">
            Welcome to ChatApp
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-white">
            Login to continue
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Secure messaging with a clean modern interface.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              required
              onChange={handleInput}
              className="w-full rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              required
              onChange={handleInput}
              className="w-full rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-3xl bg-cyan-500 px-5 py-3 text-lg font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-cyan-300 hover:text-cyan-200"
          >
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
