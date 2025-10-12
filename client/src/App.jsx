import React, { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Login from "./Pages/Login";
import Signup from "./Pages/SignUp";
import Dashboard from "./components/Dashboard";
import { restoreUser } from "./features/authSlice";
import ChatWindow from "./components/ChatWindow";

function App() {
  const dispatch = useDispatch();
  const { user, restoring } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(restoreUser());
  }, [dispatch]);

  // Show a loading indicator while restoring user from localStorage
  if (restoring) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
      <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" replace />} />
      <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" replace />} />
      {/* <Route path="/chat/:chatId" element={<ChatWindow/>} />  */}
    </Routes>
  );
}

export default App;
