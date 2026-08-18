import Login from "./Login/Login.jsx";
import { ToastContainer } from "react-toastify";
import { Route, Routes } from "react-router-dom";
import Register from "./register/Register.jsx";
import Home from "./home/Home.jsx";
import { verifyUser as VerifyUser } from "./utils/verifyUser.jsx";

function App() {
  return (
    <div className="min-h-screen w-screen bg-slate-950 text-slate-100">
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-6">
        <div className="w-full max-w-6xl">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<VerifyUser />}>
              <Route path="/" element={<Home />} />
            </Route>
          </Routes>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
