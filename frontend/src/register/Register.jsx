import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [inputData, setInputData] = useState({});

  const handleInput = (e) => {
    setInputData({
      ...inputData,
      [e.target.id]: e.target.value,
    });
  };

  const selectGender = (selectGender) => {
    setInputData((prev) => ({
      ...prev,
      gender: selectGender === inputData.gender ? "" : selectGender,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (inputData.password !== inputData.confpassword) {
      setLoading(false);
      return toast.error("Password doesn't match");
    }

    try {
      const register = await axios.post(`/api/auth/register`, inputData);
      const data = register.data;
      if (data.success === false) {
        setLoading(false);
        toast.error(data.message);
        return;
      }
      toast.success(data?.message);
      setLoading(false);
      navigate("/login");
    } catch (error) {
      setLoading(false);
      toast.error(error?.response?.data?.message || "Unable to register");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950/90 px-4 py-10 text-slate-100">
      <div className="mx-auto w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[.28em] text-cyan-300/80">
            Create your account
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-white">
            Register for ChatApp
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Start chatting securely with your network.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Full Name
              </label>
              <input
                id="fullname"
                type="text"
                placeholder="John Doe"
                required
                onChange={handleInput}
                className="w-full rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="johndoe"
                required
                onChange={handleInput}
                className="w-full rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="example@mail.com"
              required
              onChange={handleInput}
              className="w-full rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-500"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Create password"
                required
                onChange={handleInput}
                className="w-full rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Confirm password
              </label>
              <input
                id="confpassword"
                type="password"
                placeholder="Confirm password"
                required
                onChange={handleInput}
                className="w-full rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid gap-3 rounded-3xl border border-white/10 bg-slate-950/70 p-4 text-slate-200 md:grid-cols-2">
            <button
              type="button"
              onClick={() => selectGender("male")}
              className={`rounded-full px-4 py-3 text-sm font-semibold transition ${
                inputData.gender === "male"
                  ? "bg-cyan-500 text-slate-950"
                  : "bg-slate-900/90 text-slate-300 hover:bg-slate-800"
              }`}
            >
              Male
            </button>
            <button
              type="button"
              onClick={() => selectGender("female")}
              className={`rounded-full px-4 py-3 text-sm font-semibold transition ${
                inputData.gender === "female"
                  ? "bg-cyan-500 text-slate-950"
                  : "bg-slate-900/90 text-slate-300 hover:bg-slate-800"
              }`}
            >
              Female
            </button>
          </div>

          <button
            type="submit"
            className="w-full rounded-3xl bg-cyan-500 px-5 py-3 text-lg font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-cyan-300 hover:text-cyan-200"
          >
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
