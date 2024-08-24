import React, { useState } from "react";
import { Button, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";

interface ForgotPwdCredentials {
  email: string;
}

const ForgotPwd: React.FC<{
  onRequestResetPwd: (credentials: ForgotPwdCredentials) => Promise<string>;
}> = ({ onRequestResetPwd }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSendEmail, setIsSendEmail] = useState(false);

  const navigate = useNavigate();

  const validationSchema = yup.object().shape({
    email: yup.string().email("Email Invalid!").required("Email is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const res = await onRequestResetPwd(values);
        console.log("res", res);
        if (res) {
          setIsSendEmail(true);
        }
      } catch (error) {
        setErrorMessage("Something went wrong");
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
        {isSendEmail && (
          <div className="border p-10 rounded-lg shadow text-center flex items-center justify-center flex-col">
            <div className="w-20 h-20">
              <svg viewBox="0 0 77 50" className="m8_FYq">
                <path
                  stroke="none"
                  d="M59.4 0H6.6C2.96 0 0 2.983 0 6.667v36.667C0 47.017 2.953 50 6.6 50h42.826c.7-.008 1.653-.354 1.653-1.497 0-1.156-.814-1.482-1.504-1.482h-.15v-.023H6.6c-1.823 0-3.568-1.822-3.568-3.664V6.667c0-1.842 1.745-3.623 3.568-3.623h52.8c1.824 0 3.6 1.78 3.6 3.623V18c0 .828.538 1.468 1.505 1.468S66 18.828 66 18v-.604-10.73C66 2.983 63.047 0 59.4 0zm-.64 5.76c.374.713.35 1.337-.324 1.733L33.84 21.53c-.423.248-1.575.923-3.124-.004L7.465 7.493c-.672-.396-.52-.896-.146-1.6s.753-1.094 1.426-.698L32.065 19.4 57.202 5.186c.672-.396 1.183-.14 1.556.574zm14.335 26.156l.277.078c.34.092.5.148.45.168 1.862.8 3.178 2.735 3.178 5v7.47c0 2.967-2.28 5.38-5.08 5.38H57.08c-2.8 0-5.08-2.413-5.08-5.38V37.15c0-2.538 1.67-4.665 3.905-5.23v-1.807C55.905 25.087 59.76 21 64.5 21c3.52 0 6.63 2.234 7.944 5.635l.02.05.006.016a9.55 9.55 0 0 1 .625 3.415v1.8zM70.48 28.17a1.28 1.28 0 0 1-.028-.081c-.83-2.754-3.223-4.604-5.954-4.604-3.447 0-6.25 2.974-6.25 6.63v1.655h12.505v-1.655c0-.677-.096-1.33-.275-1.946h.001zm4.18 16.45h-.002c0 1.596-1.227 2.892-2.737 2.892H57.08c-1.507 0-2.737-1.3-2.737-2.893v-7.47c0-1.597 1.227-2.893 2.738-2.893h14.84c1.508 0 2.737 1.3 2.737 2.893v7.47z"
                  fill-opacity=".87"
                  fill-rule="evenodd"
                ></path>
                <rect
                  stroke="none"
                  x="63"
                  y="38"
                  width="3"
                  height="6"
                  rx="1.5"
                  fill-opacity=".87"
                ></rect>
              </svg>
            </div>
            We've sent a special code to your email,{" "}
            <span className="text-indigo-600">
              {formik.values.email}.<br />
            </span>
            Please check your email.{" "}
            <div className="mt-5">
              <button
                type="button"
                onClick={() => navigate("/home")}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Go To Home
              </button>
            </div>
          </div>
        )}
        {!isSendEmail && (
          <form className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email
              </label>
              <div className="mt-2">
                <input
                  {...formik.getFieldProps("email")}
                  id="email"
                  name="email"
                  type="text"
                  required
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  className="block w-full p-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {formik.errors.email && formik.touched.email && (
                  <div className="text-red-500">{formik.errors.email}</div>
                )}
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={() => formik.handleSubmit()}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Next
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPwd;
