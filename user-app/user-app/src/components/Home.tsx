import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios, { AxiosInstance } from "axios";

import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import moment from "moment";
import { Button } from "@mui/material";
import { relative } from "path";

interface IComments {
  _id?: string;
  rating: number;
  content: string;
  author: string;
  watch: string;
}

interface Watch {
  _id?: string;
  watchName: string;
  image: string;
  price: number;
  automatic: boolean;
  watchDescription: string;
  comments?: IComments[];
  brand: string;
}
interface CodeSnippet {
  _id: string;
  title: string;
  description: string;
  language: string;
  code: string;
  isUsepassword: true;
  password: string;
  member: string;
  createdAt: string;
  updatedAt: string;
  __v: 0;
}
interface Brand {
  _id?: string;
  brandName: string;
}

const Home: React.FC<{ axiosInstance: AxiosInstance }> = ({
  axiosInstance,
}) => {
  const [snippets, setSnippet] = useState<CodeSnippet[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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
    const fetchWatch = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get("/code/me");

        setSnippet(response.data.code);
      } catch (error) {
        const errorMess = error as ErrorResponse;
        console.error("Error fetching watch:", error);
        handleError(errorMess.response.data.message || "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };
    fetchWatch();
  }, [axiosInstance]);

  const snippetColumns = useMemo<MRT_ColumnDef<CodeSnippet>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Title",
      },
      {
        accessorKey: "description",
        header: "Description",
      },

      {
        accessorKey: "language",
        header: "Language",
      },
      {
        accessorKey: "code",
        header: "Code",
      },
      {
        accessorKey: "createdAt",
        header: "Created at",
        accessorFn(originalRow) {
          return moment(originalRow.createdAt).format("DD-MM-YYYY");
        },
      },

      {
        header: "Action",
        enableColumnActions: false,
        Cell(props) {
          const roww = props.row;

          return (
            <div>
              <Button href={`/snippet/${roww.original._id}`}>
                View Snippet
              </Button>
            </div>
          );
        },
      },
    ],
    []
  );

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
                  "url('/coding.png')",
              }}
            >
              <div className="container mx-auto">
                <div className="flex flex-col w-full lg:w-1/2 md:ml-16 items-center md:items-start px-6 tracking-wide">
                  <p className="text-black text-2xl my-4">
                    Stripy Zig Zag Jigsaw Pillow
                  </p>
                  <a
                    className="text-xl inline-block no-underline border-b border-gray-600 leading-relaxed hover:text-black hover:border-black"
                    href="#"
                  >
                    view code
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
                  "url('coding.png')",
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
                    view code
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

      <section className="bg-white py-8">
        <div className="container mx-auto flex items-center flex-wrap pt-4 pb-12">
          <nav id="store" className="w-full z-30 top-0 px-6 py-1">
            <div className="w-full container mx-auto flex flex-wrap items-center justify-between mt-0 px-2 py-3">
              <h1>Snippets</h1>
              <Button href="/members/CreateSnippet" variant="contained">
                Create Snippet
              </Button>
            </div>
          </nav>
          <div
            style={{
              width: "100%",
              padding: 40,
            }}
          >
            <MaterialReactTable data={snippets} columns={snippetColumns} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
