import React, { useEffect, useState } from "react";
import { Alert, Button, MenuItem, Select, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { AxiosInstance } from "axios";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";

interface Brand {
  _id?: string;
  brandName: string;
}
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
  brandId: string;
}

const UpdateWatch: React.FC<{
  axiosInstance: AxiosInstance;
  isLoggedIn: boolean;
}> = ({ axiosInstance }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [watchs, setWatchs] = useState<Watch>();
  const navigate = useNavigate();
  const { id } = useParams();
  const storedToken = localStorage.getItem("accessToken");
  const validationSchema = yup.object().shape({
    brand: yup.string().required("Brand is required"),
    watchName: yup.string().required("Watch Name is required"),
    image: yup.string().required("Image is required"),
    price: yup.string().required("Price is required"),
    automatic: yup.string().required("Automatic is required"),
    watchDescription: yup.string().required("Watch Description is required"),
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

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const response = await axiosInstance.get("/brand");
        setBrands(response.data.brandList);
      } catch (error) {
        const errorMess = error as ErrorResponse;
        console.error("Error fetching brand:", error);
        handleError(errorMess.response.data.message || "An error occurred");
      }
    };
    fetchBrand();
  }, [axiosInstance]);

  useEffect(() => {
    const fetchWatch = async () => {
      try {
        const response = await axiosInstance.get(`/watch/${id}`);
        setWatchs(response.data.watch);
        formik.setFieldValue("watchName", response.data.watch.watchName);
        formik.setFieldValue("image", response.data.watch.image);
        formik.setFieldValue("price", response.data.watch.price);
        formik.setFieldValue("automatic", response.data.watch.automatic);
        formik.setFieldValue(
          "watchDescription",
          response.data.watch.watchDescription
        );
        formik.setFieldValue("brand", response.data.watch.brandId);
      } catch (error) {
        const errorMess = error as ErrorResponse;
        console.error("Error fetching watch:", error);
        navigate("/404");
      }
    };
    fetchWatch();
  }, [id]);

  const formik = useFormik({
    initialValues: watchs ?? {
      brand: "",
      watchName: "",
      image: "",
      price: "",
      automatic: "",
      watchDescription: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await axiosInstance.put(`/watch/update/${id}`, values);
        setErrorMessage(null);
        handleSuccess("Update Watch Successful");
        formik.resetForm();
        navigate("/");
      } catch (error) {
        setErrorMessage("Error update watch. Please try again.");
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
          <h2>Update Watch</h2>

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
            <Select
              name="brand"
              required
              value={formik.values.brand}
              onChange={formik.handleChange}
              error={formik.touched.brand && !!formik.errors.brand}
            >
              {/* <MenuItem value='' >{watchs?.brand ? watchs.brand : 'Choose a branch'}</MenuItem> */}
              {brands.map((brand) => (
                <MenuItem key={brand._id} value={brand._id}>
                  {brand.brandName}
                </MenuItem>
              ))}
            </Select>
            <TextField
              label="Watch Name"
              {...formik.getFieldProps("watchName")}
              error={formik.touched.watchName && !!formik.errors.watchName}
              helperText={formik.touched.watchName && formik.errors.watchName}
            />
            <TextField
              label="Image"
              {...formik.getFieldProps("image")}
              error={formik.touched.image && !!formik.errors.image}
              helperText={formik.touched.image && formik.errors.image}
            />
            <TextField
              label="Price"
              {...formik.getFieldProps("price")}
              error={formik.touched.price && !!formik.errors.price}
              helperText={formik.touched.price && formik.errors.price}
            />
            <TextField
              label="Automatic"
              {...formik.getFieldProps("automatic")}
              error={formik.touched.automatic && !!formik.errors.automatic}
              helperText={formik.touched.automatic && formik.errors.automatic}
            />
            <TextField
              label="Watch Description"
              {...formik.getFieldProps("watchDescription")}
              error={
                formik.touched.watchDescription &&
                !!formik.errors.watchDescription
              }
              helperText={
                formik.touched.watchDescription &&
                formik.errors.watchDescription
              }
            />

            <Button type="submit" variant="contained">
              Update Watch
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateWatch;
