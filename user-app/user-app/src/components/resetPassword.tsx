import React, { useEffect, useState } from 'react';
import { Alert, Button, TextField } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { AxiosInstance } from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const ResetPassword: React.FC<{ axiosInstance: AxiosInstance; isLoggedIn: boolean}> = ({ axiosInstance }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const storedToken = localStorage.getItem('accessToken')
  const validationSchema = yup.object().shape({
    oldPassword: yup.string().required('Old Password is required'),
    newPassword: yup.string().required('New Password is required'),
    confirmNewPassword: yup.string().required('Confirm New Password is required'),
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
      oldPassword: '',
       newPassword: '',
        confirmNewPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await axiosInstance.post('/members/changePassword', values);
        setErrorMessage(null);
        handleSuccess('Change Password Successful');
        formik.resetForm(); 
        navigate('/')
      } catch (error) {
        setErrorMessage('Error Change Password. Please try again.');
        const errorMess = error as ErrorResponse
        if(errorMess.response.data.message === 'Unauthentication'){
             navigate("/401")
        }
        else if(errorMess.response.data.message === 'Unauthorization'){
             navigate("/403")
        }else{
            handleError(errorMess.response.data.message || 'An error occurred')
        }
        
      }
    },
  });



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
      <h2>Change Password</h2>

          <div style={{display: "flex", gap:"20px", padding:"10px", width:"50%", flexDirection: "column", justifyContent:"center",}}>


        <TextField
          label="Old Password"
          {...formik.getFieldProps('oldPassword')}
          error={formik.touched.oldPassword && !!formik.errors.oldPassword} 
          helperText={formik.touched.oldPassword && formik.errors.oldPassword}
        />
        <TextField
          label="New Password"
          {...formik.getFieldProps('newPassword')}
          error={formik.touched.newPassword && !!formik.errors.newPassword} 
          helperText={formik.touched.newPassword && formik.errors.newPassword}
        />
        <TextField
          label="Confirm New Password"
          {...formik.getFieldProps('confirmNewPassword')}
          error={formik.touched.confirmNewPassword && !!formik.errors.confirmNewPassword} 
          helperText={formik.touched.confirmNewPassword && formik.errors.confirmNewPassword}
        />

        <Button type="submit" variant="contained">
          Change Password
        </Button>
          </div>
        </div>

       
      </form>
    </div>
  );
};

export default ResetPassword;