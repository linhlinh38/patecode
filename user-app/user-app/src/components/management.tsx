import React, { useEffect, useState } from "react";
import { Button, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { AxiosInstance } from "axios";

interface LoginCredentials {
  memberName: string;
  password: string;
}
interface ErrorResponse {
  response: {
    data: {
      message: string;
    };
  };
}

interface Watch {
  _id?: string;
  watchName: string;
  image: string;
  price: number;
  automatic: boolean;
  watchDescription: string;

  brand: string;
}

interface Brand {
  _id?: string;
  brandName: string;
}
interface Member {
  _id?: string;
  memberName: string;
  name: string;
  yob: number;
  isAdmin: boolean;
}

const Management: React.FC<{ axiosInstance: AxiosInstance }> = ({
  axiosInstance,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [members, setMembers] = useState<Member[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [allWatchs, setAllWatchs] = useState<Watch[]>([]);
  const handleError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 5000);
  };

  useEffect(() => {
    const fetchWatch = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get("/watch");
        setAllWatchs(response.data.watchList);
      } catch (error) {
        const errorMess = error as ErrorResponse;
        console.error("Error fetching watch:", error);
        handleError(errorMess.response.data.message || "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };
    const fetchBrand = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get("/brand");
        setBrands(response.data.brandList);
      } catch (error) {
        const errorMess = error as ErrorResponse;
        console.error("Error fetching brand:", error);
        handleError(errorMess.response.data.message || "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };
    const fetchMember = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get("/member");

        setMembers(response.data.memberList);
      } catch (error) {
        const errorMess = error as ErrorResponse;
        console.error("Error fetching brand:", error);
        handleError(errorMess.response.data.message || "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMember();
    fetchBrand();
    fetchWatch();
  }, [axiosInstance]);

  return (
    <div>
      <div
        x-data="{ sidebarOpen: false }"
        className="flex h-screen bg-gray-200 font-roboto"
      >
        {/* <div x-cloak :class="sidebarOpen ? 'block' : 'hidden'" @click="sidebarOpen = false"
            className="fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden"></div> */}

        {/* <div x-cloak :class="sidebarOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'"
            class="fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 transform bg-gray-900 lg:translate-x-0 lg:static lg:inset-0">
            <div className="flex items-center justify-center mt-8">
                <div className="flex items-center">
                    <svg className="w-12 h-12" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M364.61 390.213C304.625 450.196 207.37 450.196 147.386 390.213C117.394 360.22 102.398 320.911 102.398 281.6C102.398 242.291 117.394 202.981 147.386 172.989C147.386 230.4 153.6 281.6 230.4 307.2C230.4 256 256 102.4 294.4 76.7999C320 128 334.618 142.997 364.608 172.989C394.601 202.981 409.597 242.291 409.597 281.6C409.597 320.911 394.601 360.22 364.61 390.213Z"
                            fill="#4C51BF" stroke="#4C51BF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path
                            d="M201.694 387.105C231.686 417.098 280.312 417.098 310.305 387.105C325.301 372.109 332.8 352.456 332.8 332.8C332.8 313.144 325.301 293.491 310.305 278.495C295.309 263.498 288 256 275.2 230.4C256 243.2 243.201 320 243.201 345.6C201.694 345.6 179.2 332.8 179.2 332.8C179.2 352.456 186.698 372.109 201.694 387.105Z"
                            fill="white" />
                    </svg>
        
                    <span className="mx-2 text-2xl font-semibold text-white">Dashboard</span>
                </div>
            </div>
        
            <nav className="mt-10">
                <a className="flex items-center px-6 py-2 mt-4 text-gray-100 bg-gray-700 bg-opacity-25" href="/admin/brands/dashboard">
                    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
            
                    <span className="mx-3">Brand Management</span>
                </a>
            
                <a className="flex items-center px-6 py-2 mt-4 text-gray-500 hover:bg-gray-700 hover:bg-opacity-25 hover:text-gray-100"
                    href="/admin/watchs/dashboard">
                    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
                    </svg>
            
                    <span className="mx-3">Watch Management</span>
                </a>
            
                <a className="flex items-center px-6 py-2 mt-4 text-gray-500 hover:bg-gray-700 hover:bg-opacity-25 hover:text-gray-100"
                    href="/admin/members/dashboard">
                    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
            
                    <span className="mx-3">Member Management</span>
                </a>
            
            </nav>
        </div> */}
        <div className="flex-1 flex flex-col ">
          <main className="flex-1  overflow-y-auto bg-gray-200">
            <div className="container mx-auto px-6 py-8">
              <div className="w-full h-screen  border-t flex flex-col">
                <main className="w-full flex-grow p-6">
                  <div className="w-full ">
                    <h1 className="text-3xl text-black pb-6">
                      Member Management
                    </h1>
                    <div className="bg-white ">
                      <table className="text-left w-full border-collapse">
                        <thead>
                          <tr>
                            <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                              Index
                            </th>
                            <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                              Member Name
                            </th>
                            <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                              Name
                            </th>
                            <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                              YOB
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {members.map((el, id) => {
                            return (
                              <tr className="hover:bg-grey-lighter">
                                <td className="py-4 px-6 border-b border-grey-light">
                                  {id + 1}
                                </td>
                                <td className="py-4 px-6 border-b border-grey-light">
                                  {el.memberName}
                                </td>
                                <td className="py-4 px-6 border-b border-grey-light">
                                  {el.name}
                                </td>
                                <td className="py-4 px-6 border-b border-grey-light">
                                  {el.yob}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <h1 className="text-3xl text-black pb-6">Brand Management</h1>
                  <div>
                    <a
                      className="w-1/2 justify-center rounded-md px-6 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-400 bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      href="/brands/create"
                    >
                      Create
                    </a>
                  </div>

                  <div className="w-full my-12">
                    <div className="bg-white overflow-auto">
                      <table className="text-left w-full border-collapse">
                        <thead>
                          <tr>
                            <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                              Index
                            </th>
                            <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                              Name
                            </th>
                            <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                              Update
                            </th>
                            <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                              Delete
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* {{#if errorMessage}}
                                        <p class="text-sm text-red-400 dark:text-red mt-0">
                                            {{errorMessage}}
                                        </p>
                                        {{/if}}
                                        {{#each brandList}} */}
                          {brands.map((el, id) => {
                            return (
                              <tr className="hover:bg-grey-lighter">
                                <td className="py-4 px-6 border-b border-grey-light">
                                  {id + 1}
                                </td>
                                <td className="py-4 px-6 border-b border-grey-light">
                                  <a href="/brands/get-watchs/{{this._id}}">
                                    {el.brandName}
                                  </a>
                                </td>
                                <td className="py-4 px-6 border-b border-grey-light">
                                  <a href={`/brands/update/${el._id}`}>
                                    Update
                                  </a>
                                </td>
                                <td className="py-4 px-6 border-b border-grey-light">
                                  <form
                                    action={`/brands/delete/${el._id}`}
                                    method="POST"
                                  >
                                    <button type="submit">Delete</button>
                                  </form>
                                </td>
                              </tr>
                            );
                          })}

                          {/* {{/each}} */}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <h1 className="text-3xl text-black pb-6">Watch Management</h1>
                  <div>
                    <a
                      className="w-1/2 justify-center rounded-md px-6 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-400 bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      href="/watchs/create"
                    >
                      Create watch
                    </a>
                  </div>
                  <div className="w-full my-12">
                    <div className="bg-white overflow-auto">
                      <table className="text-left w-full border-collapse">
                        <thead>
                          <tr>
                            <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                              Index
                            </th>
                            <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                              Image
                            </th>
                            <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                              Name
                            </th>
                            <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                              Price
                            </th>
                            <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                              Description
                            </th>
                            <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                              Brand
                            </th>
                            <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                              Update
                            </th>
                            <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                              Delete
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* map watch here */}
                          {allWatchs.map((el, id) => {
                            return (
                              <tr className="hover:bg-grey-lighter">
                                <td className="py-4 px-6 border-b border-grey-light">
                                  {id + 1}
                                </td>
                                <td className="py-4 px-6 border-b border-grey-light">
                                  <img
                                    className="w-full h-full object-cover"
                                    src={el.image}
                                    alt="ffdsa"
                                  />
                                </td>
                                <td className="py-4 px-6 border-b border-grey-light">
                                  {el.watchName}
                                </td>
                                <td className="py-4 px-6 border-b border-grey-light">
                                  {el.price}
                                </td>
                                <td className="py-4 px-6 border-b border-grey-light">
                                  {el.watchDescription}
                                </td>
                                <td className="py-4 px-6 border-b border-grey-light">
                                  {el.brand}
                                </td>
                                <td className="py-4 px-6 border-b border-grey-light">
                                  <a href={`/watchs/update/${el._id}`}>
                                    Update
                                  </a>
                                </td>
                                <td className="py-4 px-6 border-b border-grey-light">
                                  <form
                                    action={`/watchs/delete/${el._id}`}
                                    method="POST"
                                  >
                                    <button type="submit">Delete</button>
                                  </form>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </main>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Management;
