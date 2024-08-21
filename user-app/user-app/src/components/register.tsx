import React, { useEffect, useState } from "react";
import { Alert, Button, MenuItem, Select, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { AxiosInstance } from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

interface Brand {
  _id?: string;
  brandName: string;
}
const Register: React.FC<{ axiosInstance: AxiosInstance }> = ({
  axiosInstance,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const validationSchema = yup.object().shape({
    memberName: yup.string().required("Member Name is required"),
    name: yup.string().required("Name is required"),
    yob: yup.number().required("Years Of Birth is required"),
    password: yup.string().required("Password is required"),
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
      memberName: "",
      name: "",
      yob: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await axiosInstance.post("/member/create", values);
        setErrorMessage(null);
        handleSuccess("Create Account Successful");
        formik.resetForm();
        navigate("/login");
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
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Register your account
            </h2>
          </div>
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
            <div>
              <label
                htmlFor="memberName"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Member Name
              </label>
              <div className="mt-2">
                <input
                  {...formik.getFieldProps("memberName")}
                  id="memberName"
                  name="memberName"
                  type="text"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {formik.touched.memberName && (
                  <p className="text-red-500">{formik.errors.memberName} </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Name
              </label>
              <div className="mt-2">
                <input
                  {...formik.getFieldProps("name")}
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {formik.touched.name && (
                  <p className="text-red-500">{formik.errors.name} </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="yob"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Years of Birth
              </label>
              <div className="mt-2">
                <input
                  id="yob"
                  {...formik.getFieldProps("yob")}
                  name="yob"
                  type="number"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {formik.touched.yob && (
                  <p className="text-red-500">{formik.errors.yob} </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  {...formik.getFieldProps("password")}
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {formik.touched.password && (
                  <p className="text-red-500">{formik.errors.password} </p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;

// <TextField
//   label="Member Name"
//   {...formik.getFieldProps("memberName")}
//   error={formik.touched.memberName && !!formik.errors.memberName}
//   helperText={formik.touched.memberName && formik.errors.memberName}
// />
// <TextField
//   label="Name"
//   {...formik.getFieldProps("name")}
//   error={formik.touched.name && !!formik.errors.name}
//   helperText={formik.touched.name && formik.errors.name}
// />
// <TextField
//   label="Years Of Birth"
//   type="number"
//   {...formik.getFieldProps("yob")}
//   error={formik.touched.yob && !!formik.errors.yob}
//   helperText={formik.touched.yob && formik.errors.yob}
// />
// <TextField
//   label="Password"
//   type="password"
//   {...formik.getFieldProps("password")}
//   error={formik.touched.password && !!formik.errors.password}
//   helperText={formik.touched.password && formik.errors.password}
// />

// <Button type="submit" variant="contained">
//   Register
// </Button>
