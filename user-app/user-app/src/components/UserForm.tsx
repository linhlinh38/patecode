import React, { useEffect, useState } from 'react';
import { Alert, Button, TextField } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { AxiosInstance } from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

interface User {
  username: string;
  email: string;
  birthdate: string;
  password: string;
}

const UserForm: React.FC<{ axiosInstance: AxiosInstance, mode?: 'create' | 'edit' ; isLoggedIn: boolean}> = ({ axiosInstance, mode, isLoggedIn }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const storedToken = localStorage.getItem('accessToken')
  const validationSchema = yup.object().shape({
    username: yup.string().required('Username is required'),
    email: yup.string().email('Invalid email format').required('Email is required'),
    birthdate: yup.date().required('Birthdate is required'),
    password: yup.string().required('Password is required'),
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
      username: '',
      email: '',
      birthdate: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await axiosInstance.post('/user/create/', values);
        setErrorMessage(null);
        handleSuccess('Create User Successful');
        formik.resetForm(); // Clear form after successful submission
        navigate('/')
      } catch (error) {
        setErrorMessage('Error creating user. Please try again.');
        const errorMess = error as ErrorResponse
        console.error('Error fetching users:', error);
        handleError(errorMess.response.data.message || 'An error occurred')
      }
    },
  });

  useEffect(() => {
    const checkTokenExpiration = () => {
      if (storedToken) {
        const tokenParts = storedToken.split(".");
        const decodedPayload = JSON.parse(atob(tokenParts[1]));
        const expirationTime = decodedPayload.exp * 1000;
        // const currentTime = 1715870087001;
        const currentTime = Date.now();
        // console.log("Current Day     :" + formatDate(currentTime));
        // console.log("Token expiration:" + formatDate(expirationTime));
        // console.log("Token expiration:" + expirationTime);

        if (currentTime >= expirationTime) {
          // Nếu token hết hạn, refresh token
          // console.log("Refresh Token Successfully");
          // refreshAuthToken();
          localStorage.removeItem("accessToken");
          navigate('/login')
        } else {
          // console.log("Not Refresh Token");
        }
      }
    };

    // Kiểm tra mỗi lần component được mount hoặc token thay đổi
    checkTokenExpiration();
  }, [storedToken]);
  


  return (
    <div>
        {errorMessage && (
  <Alert severity="error">{errorMessage}</Alert>
)}
{successMessage && (
  <Alert severity="success">{successMessage}</Alert>
)}
       
      <form onSubmit={formik.handleSubmit}>

          <div style={{display: "flex", width:"100%", height:"80vh", flexDirection: "column", justifyContent:"center", alignItems:"center"}}>
      <h2>Create User</h2>

          <div style={{display: "flex", gap:"20px", padding:"10px", width:"50%", flexDirection: "column", justifyContent:"center",}}>


 <TextField
          label="Username"
          {...formik.getFieldProps('username')}
          error={formik.touched.username && !!formik.errors.username} // Use !! to convert truthy value to boolean
          helperText={formik.touched.username && formik.errors.username}
        />
        <TextField
          label="Email"
          type="email"
          {...formik.getFieldProps('email')}
          error={formik.touched.email && !!formik.errors.email} // Use !! to convert truthy value to boolean
          helperText={formik.touched.email && formik.errors.email}
        />
        <TextField
          label="Birthdate"
          type="date"
          {...formik.getFieldProps('birthdate')}
          InputLabelProps={{ shrink: true }}
          error={formik.touched.birthdate && !!formik.errors.birthdate} // Use !! to convert truthy value to boolean
          helperText={formik.touched.birthdate && formik.errors.birthdate}
        />
        <TextField
          label="Password"
          type="password"
          {...formik.getFieldProps('password')}
          error={formik.touched.password && !!formik.errors.password} // Use !! to convert truthy value to boolean
          helperText={formik.touched.password && formik.errors.password}
        />
        <Button type="submit" variant="contained">
          Create User
        </Button>
          </div>




          </div>

       
      </form>
      {errorMessage && <p className="error">{errorMessage}</p>}
    </div>
  );
};

export default UserForm;