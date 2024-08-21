import React, { useState, useContext, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, TextField, Alert } from '@mui/material';
import { Form, Link, useNavigate, useParams } from 'react-router-dom';
import axios, { AxiosInstance } from 'axios';
import { watch } from 'fs';

interface LoginCredentials {
  email: string;
  password: string;
}


interface Member {
  _id?: string;
  memberName: string;
  password: string;
  name: string;
  yob: number;
  isAdmin?: boolean;
}


const Profile: React.FC<{ axiosInstance: AxiosInstance }> = ({ axiosInstance })=> {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [member, setMember] = useState<Member>();
   const [isLoading, setIsLoading] = useState(false);
   const [reload, setReload] = useState(false);
   const navigate = useNavigate();

   const storedToken = localStorage.getItem('accessToken');

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
        const response = await axiosInstance.get('/member/info');
        setMember(response.data.member);
      } catch (error) {
        const errorMess = error as ErrorResponse
        console.error('Error fetching member:', error);
        navigate("/404")
      } finally{
        setIsLoading(false);
        setReload(false);
      }
    };
    fetchWatch();
  }, [axiosInstance, reload]);
  
  
  

  return (
    <div>
        <div className="max-w-2xl mx-auto text-center mt-4">
    <div className="px-4 sm:px-0 mb-3">
        <h3 className="text-3xl font-bold leading-7 text-gray-900">Member Details</h3>
        <p className="mt-1 max-w-2xl text-2xl leading-6 text-gray-500">Account Information</p>
    </div>
    <div className="mt-6 border-t border-gray-100 mb-3">
        <dl className="divide-y divide-gray-100 mb-3">
            <div className="relative overflow-hidden h-48 w-48 mx-auto rounded-full bg-gray-300 my-3"> <img
                    className="object-cover w-full h-full rounded-full p-2 mb-3" src={'/panda1200-1.jpg'} alt="Image"
                    />
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-0 mb-3">
                <dt className="text-sm font-medium leading-6 text-gray-900">Member name</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-0">{member?.memberName}</dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-0 mb-3">
                <dt className="text-sm font-medium leading-6 text-gray-900">Full name</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-0">{member?.name}</dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-0 mb-3">
                <dt className="text-sm font-medium leading-6 text-gray-900">Years of Birth</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-0">{member?.yob}</dd>
            </div>
        </dl>
        <p className="mt-10 text-center text-sm text-gray-500">
            Want to change password?
            <a href="/members/changePassword" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"> Click
                Here</a>
        </p>
        <br/>
        
        <a className=" mt-6 w-1/2 justify-center rounded-md px-6 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-400 bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" href="/members/update">Update Profile</a>
    </div>
</div> 
      
    </div>

  );
};

export default Profile;