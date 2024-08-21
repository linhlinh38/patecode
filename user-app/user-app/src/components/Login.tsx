import React, { useState } from "react";
import { Button, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";

interface LoginCredentials {
  memberName: string;
  password: string;
}

const Login: React.FC<{
  onLogin: (credentials: LoginCredentials) => Promise<void>;
}> = ({ onLogin }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const validationSchema = yup.object().shape({
    memberName: yup.string().required("Member Name is required"),
    password: yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      memberName: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await onLogin(values);
        navigate("/home");
        setErrorMessage(null);
      } catch (error) {
        setErrorMessage("Login failed. Please check your credentials.");
      }
    },
  });

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {errorMessage && <p className="error">{errorMessage}</p>}

        <form
          className="space-y-6"
          action="/login"
          method="POST"
          onSubmit={formik.handleSubmit}
        >
          <div>
            <label
              htmlFor="email"
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
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                {...formik.getFieldProps("password")}
                id="password"
                name="password"
                type="password"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-gray-500">
          Not a member?
          <Link to={"/members/create"}>
            <span className="font-semibold text-indigo-600 hover:text-indigo-500">
              {" "}
              Register Here
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
