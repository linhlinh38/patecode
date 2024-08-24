import React, { useEffect, useState } from "react";
import { Alert, Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { AxiosInstance } from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useSearchParams } from "react-router-dom";
const ResetPwd: React.FC<{
  axiosInstance: AxiosInstance;
  isLoggedIn: boolean;
}> = ({ axiosInstance }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [URLSearchParams, SetURLSearchParams] = useSearchParams();
  console.log("URLSearchParams", URLSearchParams.get("token"));

  const navigate = useNavigate();
  const storedToken = localStorage.getItem("accessToken");
  const validationSchema = yup.object().shape({
    newPassword: yup.string().required("New Password is required"),
    confirmNewPassword: yup
      .string()
      .required("Confirm New Password is required"),
  });

  const handleError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 5000);
  };
  const handleSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 5000);
  };
  interface ErrorResponse {
    response: {
      data: {
        message: string;
      };
    };
  }

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formatData = {
          memberId: URLSearchParams.get("id"),
          newPassword: values.newPassword,
          confirmNewPassword: values.confirmNewPassword,
          token: URLSearchParams.get("token"),
        };
        await axiosInstance.post("/member/resetPassword", formatData);
        setErrorMessage(null);
        handleSuccess("Reset Password Successful");
        formik.resetForm();
        navigate("/");
      } catch (error) {
        setErrorMessage("Error Reset Password. Please try again.");
        const errorMess = error as ErrorResponse;
        if (errorMess.response.data.message === "Unauthentication") {
          navigate("/401");
        } else if (errorMess.response.data.message === "Unauthorization") {
          navigate("/403");
        } else {
          handleError(errorMess.response.data.message || "An error occurred");
        }
      }
    },
  });

  return (
    <div>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}

      <form onSubmit={formik.handleSubmit}>
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "80vh",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h2>Reset Password</h2>

          <div
            style={{
              display: "flex",
              gap: "20px",
              padding: "10px",
              width: "50%",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <TextField
              label="New Password"
              {...formik.getFieldProps("newPassword")}
              error={formik.touched.newPassword && !!formik.errors.newPassword}
              helperText={
                formik.touched.newPassword && formik.errors.newPassword
              }
            />
            <TextField
              label="Confirm New Password"
              {...formik.getFieldProps("confirmNewPassword")}
              error={
                formik.touched.confirmNewPassword &&
                !!formik.errors.confirmNewPassword
              }
              helperText={
                formik.touched.confirmNewPassword &&
                formik.errors.confirmNewPassword
              }
            />

            <Button type="submit" variant="contained">
              Reset Password
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ResetPwd;
