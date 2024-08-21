import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import UserList from "./components/UserList";
import UserForm from "./components/UserForm";
import axios from "axios";
import { Alert } from "@mui/material";
import UpdateUser from "./components/UpdateForm";
import "./App.css";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import WatchDetail from "./components/WatchDetail";
import NotFound from "./components/404";
import Forbidden from "./components/403";
import Unauthenticate from "./components/401";
import CreateBrand from "./components/createBrand";
import UpdateBrand from "./components/updateBrand";
import CreateWatch from "./components/createWatch";
import UpdateWatch from "./components/updateWatch";
import ResetPassword from "./components/resetPassword";
import Register from "./components/register";
import Profile from "./components/profile";
import Management from "./components/management";

interface User {
  _id: string;
  username: string;
  email: string;
  birthdate: string;
}

interface AuthContextState {
  isLoggedIn: boolean;
  accessToken: string | null;
  handleLogin: (credentials: LoginCredentials) => Promise<void>;
  handleLogout: () => void;
}

interface LoginCredentials {
  memberName: string;
  password: string;
}

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const storedToken = localStorage.getItem("accessToken");
  useEffect(() => {
    if (storedToken) {
      setAccessToken(storedToken);
      setIsLoggedIn(true);
    }
  }, []);

  interface ErrorResponse {
    response: {
      data: {
        message: string;
      };
    };
  }

  const handleError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 5000);
  };
  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/login",
        credentials
      );
      setAccessToken(response.data.accessToken);
      setIsLoggedIn(true);
      localStorage.setItem("accessToken", response.data.accessToken);
      if (response.data.accessToken) {
        const res = await axios.get("http://localhost:8080/member/info", {
          headers: {
            Authorization: `Bearer ${response.data.accessToken}`,
          },
        });

        localStorage.setItem("isAdmin", res.data.member.isAdmin);
      }
    } catch (error) {
      const errorMess = error as ErrorResponse;
      console.error("Error fetching users:", errorMess.response.data.message);
      handleError(errorMess.response.data.message || "An error occurred");
    }
  };

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8080",
    headers: { Authorization: accessToken ? `Bearer ${accessToken}` : "" },
  });

  return (
    <BrowserRouter>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/" element={<Navigate to={"/home"} />} />
        <Route
          path="/accounts"
          element={
            <Navbar>
              <Management axiosInstance={axiosInstance} />
            </Navbar>
          }
        />

        <Route
          path="/members/changePassword"
          element={
            isLoggedIn ? (
              <Navbar>
                <ResetPassword
                  axiosInstance={axiosInstance}
                  isLoggedIn={isLoggedIn}
                />{" "}
              </Navbar>
            ) : (
              <Alert severity="error">Unauthenticate User</Alert>
            )
          }
        />
        <Route
          path="/brands/create"
          element={
            isLoggedIn ? (
              <Navbar>
                <CreateBrand
                  axiosInstance={axiosInstance}
                  isLoggedIn={isLoggedIn}
                />
              </Navbar>
            ) : (
              <Alert severity="error">Unauthenticate User</Alert>
            )
          }
        />
        <Route
          path="/watchs/create"
          element={
            isLoggedIn ? (
              <Navbar>
                <CreateWatch
                  axiosInstance={axiosInstance}
                  isLoggedIn={isLoggedIn}
                />
              </Navbar>
            ) : (
              <Alert severity="error">Unauthenticate User</Alert>
            )
          }
        />
        <Route
          path="/members/create"
          element={<Register axiosInstance={axiosInstance} />}
        />
        <Route
          path="/members/update"
          element={
            isLoggedIn ? (
              <Navbar>
                <UpdateUser axiosInstance={axiosInstance} />
              </Navbar>
            ) : (
              <Alert severity="error">Unauthenticate User</Alert>
            )
          }
        />
        <Route
          path="/members/profile"
          element={
            isLoggedIn ? (
              <Navbar>
                <Profile axiosInstance={axiosInstance} />
              </Navbar>
            ) : (
              <Navbar>
                {" "}
                <Unauthenticate />{" "}
              </Navbar>
            )
          }
        />
        <Route
          path="/brands/update/:id"
          element={
            isLoggedIn ? (
              <Navbar>
                <UpdateBrand axiosInstance={axiosInstance} />
              </Navbar>
            ) : (
              <Alert severity="error">Unauthenticate User</Alert>
            )
          }
        />
        <Route
          path="/watchs/update/:id"
          element={
            isLoggedIn ? (
              <Navbar>
                <UpdateWatch
                  axiosInstance={axiosInstance}
                  isLoggedIn={isLoggedIn}
                />{" "}
              </Navbar>
            ) : (
              <Alert severity="error">Unauthenticate User</Alert>
            )
          }
        />

        <Route
          path="/home"
          element={
            <Navbar>
              <Home axiosInstance={axiosInstance} />{" "}
            </Navbar>
          }
        />

        <Route
          path="/watchDetail/:id"
          element={
            <Navbar>
              <WatchDetail axiosInstance={axiosInstance} />{" "}
            </Navbar>
          }
        />
        <Route
          path="/*"
          element={
            <Navbar>
              <NotFound />
            </Navbar>
          }
        />
        <Route
          path="/403"
          element={
            <Navbar>
              {" "}
              <Forbidden />{" "}
            </Navbar>
          }
        />
        <Route
          path="/401"
          element={
            <Navbar>
              {" "}
              <Unauthenticate />{" "}
            </Navbar>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
