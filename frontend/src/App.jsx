import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Onboarding from "./pages/Onboarding";
import Login from "./pages/login";
import SignUp from "./pages/signup";
import Chat from "./pages/chat";
import CallPage from "./pages/callpage";
import Notifications from "./pages/notifications";
import { Toaster } from "react-hot-toast";
import { axiosInstance } from "./utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
const App = () => {
  const {data:authData, isLoading,error} = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/me");
      return res.data;
    },
    retry: false,
  });

  const authUser = authData?.user;
  return (
    <Routes>
      <Route
        path="/"
        element={authUser ? <Home /> : <Navigate to={"/login"} />}
      ></Route>
      <Route
        path="/signup"
        element={!authUser ? <SignUp /> : <Navigate to={"/"} />}
      ></Route>
      <Route
        path="/login"
        element={!authUser ? <Login /> : <Navigate to={"/"} />}
      ></Route>
      <Route path="/notifications" element={authUser? <Notifications />: <Navigate to={"/login"}/>}></Route>
      <Route path="/call" element={authUser? <CallPage />: <Navigate to={"/login"}/>}></Route>
      <Route path="/chat" element={authUser? <Chat />: <Navigate to={"/login"}/>}></Route>
      <Route path="/onboarding" element={<Onboarding />}></Route>
      <Toaster />
    </Routes>
  );
};

export default App;
