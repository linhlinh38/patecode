// src/api.ts
import axios from "axios";

const baseUrl = "http://localhost:8080/user"; // Replace with your backend API URL

export const getAllUsers = async () => {
  const response = await axios.get(`${baseUrl}/`);
  return response.data.users;
};

export const searchUsers = async (name: string) => {
  const response = await axios.get(
    `<span class="math-inline">\{baseUrl\}/search/</span>{name}`
  );
  return response.data.users;
};

export const createUser = async (userData: {
  username: string;
  email: string;
  birthadte: string;
}) => {
  const response = await axios.post(`${baseUrl}/create`, userData);
  return response.data; // Handle success or error response based on your backend implementation
};

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${baseUrl}/login`, { email, password });
  if (response.data.accessToken) {
    localStorage.setItem("accessToken", response.data.accessToken);
    return true; // Login successful
  } else {
    return false; // Login failed (handle errors appropriately)
  }
};

export const update = async (userData: {
  username: string;
  email: string;
  birthadte: string;
}) => {
  const response = await axios.post(`${baseUrl}/update/:id`, userData);
  return response.data;
};
