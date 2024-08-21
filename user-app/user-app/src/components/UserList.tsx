import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AxiosInstance } from "axios";
import Navbar from "./Navbar";

interface User {
  _id: string;
  username: string;
  email: string;
  birthdate: string;
}

const UserList: React.FC<{ axiosInstance: AxiosInstance }> = ({
  axiosInstance,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const storedToken = localStorage.getItem("accessToken");
  const handleError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 5000);
  };
  interface ErrorResponse {
    response: {
      data: {
        message: string;
      };
    };
  }
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        console.log("here");

        const response = await axiosInstance.get("/user/");
        setUsers(response.data.userList);
        setAllUsers(response.data.userList);
      } catch (error) {
        const errorMess = error as ErrorResponse;
        console.error("Error fetching users:", error);
        handleError(errorMess.response.data.message || "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [axiosInstance]);

  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    try {
      const response = await axiosInstance.get(
        `/user/search/${event.target.value}`
      );
      setUsers(response.data.userList);
    } catch (error) {
      const errorMess = error as ErrorResponse;
      console.error("Error fetching users:", errorMess.response.data.message);
      handleError(errorMess.response.data.message || "An error occurred");
    }
  };
  useEffect(() => {
    const checkTokenExpiration = () => {
      if (storedToken) {
        const tokenParts = storedToken.split(".");
        const decodedPayload = JSON.parse(atob(tokenParts[1]));
        const expirationTime = decodedPayload.exp * 1000;
        // const currentTime = 1715870087001;
        const currentTime = Date.now();
        // console.log("Current Day     :" + formatDate(currentTime));
        // console.log("Token expiration:" + formatDate(expirationTime));
        // console.log("Token expiration:" + expirationTime);

        if (currentTime >= expirationTime) {
          // Nếu token hết hạn, refresh token
          // console.log("Refresh Token Successfully");
          // refreshAuthToken();
          localStorage.removeItem("accessToken");
          navigate("/login");
        } else {
          // console.log("Not Refresh Token");
        }
      }
    };

    // Kiểm tra mỗi lần component được mount hoặc token thay đổi
    checkTokenExpiration();
  }, [storedToken]);
  return (
    <div>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {isLoading ? (
        <p>Loading users...</p>
      ) : (
        <>
          <h2>User List</h2>
          <div className="user-actions">
            <TextField
              className="search-bar"
              label="Search by name"
              value={searchTerm}
              onChange={handleSearch}
            />

            <div>
              <Button
                className="reset-button"
                variant="contained"
                onClick={() => {
                  setSearchTerm("");
                  setUsers(allUsers);
                  navigate("/");
                }}
              >
                Reset Search
              </Button>
              <Button
                className="create-button"
                variant="contained"
                onClick={() => {
                  navigate("/create");
                }}
              >
                Create User
              </Button>
            </div>
          </div>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Birthdate</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user._id}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {new Date(user.birthdate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        onClick={() => navigate(`/update/${user._id}`)}
                      >
                        Update User
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </div>
  );
};

export default UserList;
