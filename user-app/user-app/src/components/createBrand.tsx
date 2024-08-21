import React, { useEffect, useState } from "react";
import { Alert, Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { AxiosInstance } from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const CreateBrand: React.FC<{
  axiosInstance: AxiosInstance;
  isLoggedIn: boolean;
}> = ({ axiosInstance }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const storedToken = localStorage.getItem("accessToken");
  const validationSchema = yup.object().shape({
    brandName: yup.string().required("Brand Name is required"),
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
      brandName: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await axiosInstance.post("/brand/create", values);
        setErrorMessage(null);
        handleSuccess("Create brand Successful");
        formik.resetForm();
        navigate("/");
      } catch (error) {
        setErrorMessage("Error creating brand. Please try again.");
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
          <h2>Create Brand</h2>

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
              label="Brand Name"
              {...formik.getFieldProps("brandName")}
              error={formik.touched.brandName && !!formik.errors.brandName}
              helperText={formik.touched.brandName && formik.errors.brandName}
            />

            <Button type="submit" variant="contained">
              Create Brand
            </Button>
          </div>
        </div>
      </form>
      {errorMessage && <p className="error">{errorMessage}</p>}
    </div>
  );
};

export default CreateBrand;
