import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { TextField, Button, Alert } from '@mui/material';
import axios, { AxiosInstance } from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { log } from 'console';
import Navbar from './Navbar';
import User from '../models/User';

const UpdateUser: React.FC<{ axiosInstance: AxiosInstance, mode?: 'create' | 'edit' }> = ({ axiosInstance }) => {
  const { id } = useParams(); // Get user ID from route parameter
  const navigate = useNavigate();

  const [user, setUser] = useState({memberName: '', name: '', yob: ''});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
const storedToken= localStorage.getItem('accessToken');
  const validationSchema = yup.object().shape({
    memberName: yup.string().required('Member Name is required'),
    name: yup.string().required('Name is required'),
    yob: yup.number().required('Years Of Birth is required'),
  });
  

  const formik = useFormik({
    initialValues: user, 
    validationSchema,
    onSubmit: async (values) => { 
      try {
        if(storedToken){
           setIsLoading(true);
        const response = await axiosInstance.put('/member/update', values);
        handleSuccess('Update User Successful');
        navigate('/members/profile');
        }else{
           navigate('/login');
        }
       
      } catch (error: any) {
        console.error('Error updating user:', error);
        if (error.response && error.response.data) {
          setErrorMessage(error.response.data.message || 'An error occurred while updating user.');
        } else {
          setErrorMessage('An error occurred while updating user.');
        }
      } finally {
        setIsLoading(false);
      }
    },
  });


  const handleChange = (event: any) => {
    
    formik.handleChange(event); // Use formik for value changes
  };

  const handleSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 5000);
  };
    useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        if(storedToken){
        const response = await axiosInstance.get('/member/info');
        setUser(response.data.user);
        formik.setFieldValue("memberName", response.data.member.memberName)
        formik.setFieldValue("name", response.data.member.name)
        formik.setFieldValue("yob", response.data.member.yob)
       }else{
           navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching member:', error);
        setErrorMessage('An error occurred while fetching member data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id]);

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
      
      {isLoading ? (
        <p>Loading...</p>
      ) : (
       
        <>
         {errorMessage && (
        <Alert severity="error">{errorMessage}</Alert>
        )}
        {successMessage && (
        <Alert severity="success">{successMessage}</Alert>
        )}
        <form onSubmit={formik.handleSubmit}>
          <div style={{display: "flex", width:"100%", height:"80vh", flexDirection: "column", justifyContent:"center", alignItems:"center"}}>
          <h2>Update Member Info</h2>
          <div style={{display: "flex", gap:"20px", padding:"10px", width:"50%", flexDirection: "column", justifyContent:"center",}}>


             <TextField
              label="Member Name"
              {...formik.getFieldProps('memberName')}
              error={formik.touched.memberName && !!formik.errors.memberName} 
              helperText={formik.touched.memberName && formik.errors.memberName}
            />
            <TextField
              label="Name"
              {...formik.getFieldProps('name')}
              error={formik.touched.name && !!formik.errors.name} 
              helperText={formik.touched.name && formik.errors.name}
            />
            <TextField
              label="Years Of Birth"
              type="number"
              {...formik.getFieldProps('yob')}
              error={formik.touched.yob && !!formik.errors.yob} 
              helperText={formik.touched.yob && formik.errors.yob}
            />
            <Button type="submit" variant="contained" disabled={isLoading}>
              Update
            </Button>
            </div>
            </div>


            {successMessage && <Alert severity="success">{successMessage}</Alert>}
          </form></>
      )}
    </div>
  );
};

export default UpdateUser;