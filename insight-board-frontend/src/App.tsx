import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { Toaster } from "react-hot-toast";
import Register from "./pages/Register";



function App() {
  const token = localStorage.getItem('token');

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register/>} />
        <Route path="/dashboard" element={ token ? <Dashboard /> : <Navigate to="/" />} />
      </Routes>
      <Toaster position="top-right" />
    </>

  )
}

export default App
