import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { TextField, Button, Alert } from '@mui/material';
import axios, { AxiosInstance } from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { log } from 'console';
import Navbar from './Navbar';
import User from '../models/User';

const UpdateBrand: React.FC<{ axiosInstance: AxiosInstance }> = ({ axiosInstance }) => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [brand, setBrand] = useState({brandName: ''});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
const storedToken= localStorage.getItem('accessToken');
  const validationSchema = yup.object().shape({
    brandName: yup.string().required('Brand Name is required'),
  });
  

  const formik = useFormik({
    initialValues: brand, 
    validationSchema,
    onSubmit: async (values) => { 
      try {
        if(storedToken){
           setIsLoading(true);
        const response = await axiosInstance.put(`/brand/update/${id}`, {brand: {brandName: values.brandName}});
        handleSuccess('Update Brand Successful');
        navigate('/');
        }else{
           navigate('/login');
        }
       
      } catch (error: any) {
        console.error('Error updating Brand:', error);
        if (error.response && error.response.data) {
          setErrorMessage(error.response.data.message || 'An error occurred while updating Brand.');
        } else {
          setErrorMessage('An error occurred while updating Brand.');
        }
      } finally {
        setIsLoading(false);
      }
    },
  });


  const handleChange = (event: any) => {
    
    formik.handleChange(event); 
  };

  const handleSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 5000);
  };
    useEffect(() => {
    const fetchBrand = async () => {
      setIsLoading(true);
      try {
        if(storedToken){
        const response = await axiosInstance.get(`/brand/${id}`);
        setBrand(response.data.brand);
        formik.setFieldValue("brandName", response.data.brand.brandName)
       }else{
           navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching brand:', error);
        setErrorMessage('An error occurred while fetching brand data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrand();
  }, [id]);


  return (
    <div>
      
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <><form onSubmit={formik.handleSubmit}>
          <div style={{display: "flex", width:"100%", height:"80vh", flexDirection: "column", justifyContent:"center", alignItems:"center"}}>
          <h2>Update Brand</h2>
          <div style={{display: "flex", gap:"20px", padding:"10px", width:"50%", flexDirection: "column", justifyContent:"center",}}>


            <TextField
              label="Brand Name"
              // value={user.username}
              {...formik.getFieldProps('brandName')} 
              error={formik.touched.brandName && !!formik.errors.brandName}
              helperText={formik.touched.brandName && formik.errors.brandName} />
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

export default UpdateBrand;