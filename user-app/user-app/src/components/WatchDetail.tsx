import React, { useState, useContext, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  TextField,
  Alert,
} from "@mui/material";
import { Form, Link, useNavigate, useParams } from "react-router-dom";
import axios, { AxiosInstance } from "axios";
import { watch } from "fs";
import { useFormik } from "formik";
import * as yup from "yup";

interface LoginCredentials {
  email: string;
  password: string;
}
interface IComments {
  _id?: string;
  rating: number;
  content: string;
  author: Member;
  watch: string;
}

interface Member {
  _id?: string;
  memberName: string;
  password: string;
  name: string;
  yob: number;
  isAdmin?: boolean;
}

interface Watch {
  id?: string;
  watchName: string;
  image: string;
  price: number;
  automatic: boolean;
  watchDescription: string;
  comments?: IComments[];
  brand: string;
}

const WatchDetail: React.FC<{ axiosInstance: AxiosInstance }> = ({
  axiosInstance,
}) => {
  const [watchs, setWatchs] = useState<Watch>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const { id } = useParams();
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
  const validationSchema = yup.object().shape({
    rating: yup.string().required("rating is required"),
    content: yup.string().required("content Name is required"),
  });
  useEffect(() => {
    const fetchWatch = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(`/watch/${id}`);
        setWatchs(response.data.watch);
      } catch (error) {
        const errorMess = error as ErrorResponse;
        console.error("Error fetching watch:", error);
        navigate("/404");
      } finally {
        setIsLoading(false);
        setReload(false);
      }
    };
    fetchWatch();
  }, [axiosInstance, reload]);

  const formik = useFormik({
    initialValues: {
      watchId: "",
      rating: "",
      content: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await axiosInstance.post(`/comment/${watchs?.id}`, values);
        setErrorMessage(null);

        formik.resetForm();
        setReload(false);
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
  //   const handleComment = async (event: React.FormEvent<HTMLFormElement>) => {
  //     event.preventDefault();

  //     const formData = new FormData(event.currentTarget);
  //     const rating = formData.get("rating") as string;
  //     const content = formData.get("content") as string;

  //     if (!rating || !content) {
  //       console.error("Rating and content are required");
  //       return;
  //     }

  //     try {
  //       const response = await axiosInstance.post(`/comment/${watchs?.id}`, {
  //         watchId: watchs?.id,
  //         rating: rating,
  //         content: content,
  //       });

  //       setReload(true);
  //     } catch (error) {
  //       const errorMess = error as ErrorResponse;
  //       console.log(errorMess);

  //       if (errorMess.response.data.message === "Unauthentication") {
  //         navigate("/401");
  //       } else if (errorMess.response.data.message === "Unauthorization") {
  //         navigate("/403");
  //       } else {
  //         handleError(errorMess.response.data.message || "An error occurred");
  //       }
  //     }
  //   };

  return (
    <div>
      <div
        className="carousel relative container mx-auto"
        style={{ maxWidth: "1600px" }}
      >
        <div className="carousel-inner relative overflow-hidden w-full">
          <input
            className="carousel-open"
            type="radio"
            id="carousel-1"
            name="carousel"
            aria-hidden="true"
            hidden
            checked
          />
          <div
            className="carousel-item absolute opacity-0"
            style={{ height: "50vh" }}
          >
            <div
              className="block h-full w-full mx-auto flex pt-6 md:pt-0 md:items-center bg-cover bg-right"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1422190441165-ec2956dc9ecc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=htmlFormat&fit=crop&w=1600&q=80')",
              }}
            >
              <div className="container mx-auto">
                <div className="flex flex-col w-full lg:w-1/2 md:ml-16 items-center md:items-start px-6 tracking-wide">
                  <p className="text-black text-2xl my-4">
                    Stripy Zig Zag Jigsaw Pillow and Duvet Set
                  </p>
                  <a
                    className="text-xl inline-block no-underline border-b border-gray-600 leading-relaxed hover:text-black hover:border-black"
                    href="#"
                  >
                    view product
                  </a>
                </div>
              </div>
            </div>
          </div>
          <label
            htmlFor="carousel-3"
            className="prev control-1 w-10 h-10 ml-2 md:ml-10 absolute cursor-pointer hidden text-3xl font-bold text-black hover:text-white rounded-full bg-white hover:bg-gray-900 leading-tight text-center z-10 inset-y-0 left-0 my-auto"
          >
            ‹
          </label>
          <label
            htmlFor="carousel-2"
            className="next control-1 w-10 h-10 mr-2 md:mr-10 absolute cursor-pointer hidden text-3xl font-bold text-black hover:text-white rounded-full bg-white hover:bg-gray-900 leading-tight text-center z-10 inset-y-0 right-0 my-auto"
          >
            ›
          </label>

          <input
            className="carousel-open"
            type="radio"
            id="carousel-2"
            name="carousel"
            aria-hidden="true"
            hidden
          />
          <div
            className="carousel-item absolute opacity-0 bg-cover bg-right"
            style={{ height: "50vh" }}
          >
            <div
              className="block h-full w-full mx-auto flex pt-6 md:pt-0 md:items-center bg-cover bg-right"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1533090161767-e6ffed986c88?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjM0MTM2fQ&auto=htmlFormat&fit=crop&w=1600&q=80')",
              }}
            >
              <div className="container mx-auto">
                <div className="flex flex-col w-full lg:w-1/2 md:ml-16 items-center md:items-start px-6 tracking-wide">
                  <p className="text-black text-2xl my-4">
                    Real Bamboo Wall Clock
                  </p>
                  <a
                    className="text-xl inline-block no-underline border-b border-gray-600 leading-relaxed hover:text-black hover:border-black"
                    href="#"
                  >
                    view product
                  </a>
                </div>
              </div>
            </div>
          </div>
          <label
            htmlFor="carousel-1"
            className="prev control-2 w-10 h-10 ml-2 md:ml-10 absolute cursor-pointer hidden text-3xl font-bold text-black hover:text-white rounded-full bg-white hover:bg-gray-900  leading-tight text-center z-10 inset-y-0 left-0 my-auto"
          >
            ‹
          </label>
          <label
            htmlFor="carousel-3"
            className="next control-2 w-10 h-10 mr-2 md:mr-10 absolute cursor-pointer hidden text-3xl font-bold text-black hover:text-white rounded-full bg-white hover:bg-gray-900  leading-tight text-center z-10 inset-y-0 right-0 my-auto"
          >
            ›
          </label>

          <input
            className="carousel-open"
            type="radio"
            id="carousel-3"
            name="carousel"
            aria-hidden="true"
            hidden
          />
          <div
            className="carousel-item absolute opacity-0"
            style={{ height: "50vh" }}
          >
            <div
              className="block h-full w-full mx-auto flex pt-6 md:pt-0 md:items-center bg-cover bg-bottom"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1519327232521-1ea2c736d34d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=htmlFormat&fit=crop&w=1600&q=80')",
              }}
            >
              <div className="container mx-auto">
                <div className="flex flex-col w-full lg:w-1/2 md:ml-16 items-center md:items-start px-6 tracking-wide">
                  <p className="text-black text-2xl my-4">
                    Brown and blue hardbound book
                  </p>
                  <a
                    className="text-xl inline-block no-underline border-b border-gray-600 leading-relaxed hover:text-black hover:border-black"
                    href="#"
                  >
                    view product
                  </a>
                </div>
              </div>
            </div>
          </div>
          <label
            htmlFor="carousel-2"
            className="prev control-3 w-10 h-10 ml-2 md:ml-10 absolute cursor-pointer hidden text-3xl font-bold text-black hover:text-white rounded-full bg-white hover:bg-gray-900  leading-tight text-center z-10 inset-y-0 left-0 my-auto"
          >
            ‹
          </label>
          <label
            htmlFor="carousel-1"
            className="next control-3 w-10 h-10 mr-2 md:mr-10 absolute cursor-pointer hidden text-3xl font-bold text-black hover:text-white rounded-full bg-white hover:bg-gray-900  leading-tight text-center z-10 inset-y-0 right-0 my-auto"
          >
            ›
          </label>

          <ol className="carousel-indicators">
            <li className="inline-block mr-3">
              <label
                htmlFor="carousel-1"
                className="carousel-bullet cursor-pointer block text-4xl text-gray-400 hover:text-gray-900"
              >
                •
              </label>
            </li>
            <li className="inline-block mr-3">
              <label
                htmlFor="carousel-2"
                className="carousel-bullet cursor-pointer block text-4xl text-gray-400 hover:text-gray-900"
              >
                •
              </label>
            </li>
            <li className="inline-block mr-3">
              <label
                htmlFor="carousel-3"
                className="carousel-bullet cursor-pointer block text-4xl text-gray-400 hover:text-gray-900"
              >
                •
              </label>
            </li>
          </ol>
        </div>
      </div>

      <section className="bg-white pt-30 lg:pt-[120px]">
        <div className="max-w-6xl mx-auto pt-10 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row -mx-4">
            <div className="md:flex-1 px-20">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {watchs?.watchName}
              </h2>
              <br />
              <div className="mr-4">
                <span className="font-bold text-gray-700">Brand Name: </span>
                <span className="text-gray-600">{watchs?.brand}</span>
              </div>
              <br />
              <div className="mr-4">
                <span className="font-bold text-gray-700">Price: </span>
                <span className="text-gray-600">${watchs?.price}</span>
              </div>
              <br />
              <div className="mr-4">
                <span className="font-bold text-gray-700">Description: </span>
                <span className="text-gray-600">
                  {watchs?.watchDescription}
                </span>
              </div>
              <br />
            </div>
            <div className="md:flex-1 px-4">
              <div className="h-[460px] rounded-lg bg-gray-300 mb-4">
                <img
                  className="w-full h-full object-cover"
                  src={"/panda1200-1.jpg"}
                  alt="Image"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white pt-30 lg:pt-[120px]">
        <div className="comments-section max-w-6xl mx-auto pt-10 px-4 py-10 sm:px-6 lg:px-8">
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          {/* {successMessage && (
                <Alert severity="success">{successMessage}</Alert>
                )} */}
          <h2 className="font-bold">Comments For Watch</h2>
          <div className="mt-6">
            <form className="comment-form" onSubmit={formik.handleSubmit}>
              <div className="flex flex-col gap-4">
                <div>
                  <select
                    {...formik.getFieldProps("rating")}
                    name="rating"
                    required
                    className="border text-body-color focus:border-slate-900 w-full rounded border py-3 px-[14px] text-base outline-none"
                  >
                    <option value="" selected>
                      Rating Point
                    </option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                </div>
                <textarea
                  {...formik.getFieldProps("content")}
                  name="content"
                  rows={3}
                  placeholder="Write your comment here..."
                  className="bg-gray-100"
                ></textarea>{" "}
                <br />
              </div>

              <button
                type="submit"
                className="bg-black text-white px-4 py-2 rounded-md"
              >
                Post Comment
              </button>
            </form>
          </div>
          <div className="mt-6">
            <h1 className="font-bold">View comment</h1>
            {watchs?.comments && watchs?.comments?.length > 0 ? (
              <>
                {watchs?.comments?.map((comment) => {
                  return (
                    <div>
                      <br />
                      <div className="mr-4">
                        <span className="font-bold text-gray-700">
                          Customer:{" "}
                        </span>
                        <span className="text-gray-600">
                          {comment.author.memberName}
                        </span>
                      </div>
                      <div className="mr-4">
                        <span className="font-bold text-gray-700">
                          Rating Point:{" "}
                        </span>
                        <span className="text-gray-600">{comment.rating}</span>
                      </div>
                      <div className="mr-4">
                        <span className="font-bold text-gray-700">
                          Content:{" "}
                        </span>
                        <span className="text-gray-600">{comment.content}</span>
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <>
                <p>No comments available yet.</p>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default WatchDetail;
