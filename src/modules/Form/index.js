import React, { useState } from 'react';
import Input from '../../components/Input';
import Button from "../../components/Button";
import { useNavigate } from 'react-router-dom';


const Form = ({ isSignInPage = false }) => {
  const [data, setData] = useState({
    ...(!isSignInPage && {
      fullName: '',
    }),
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/${isSignInPage ? 'login' : 'register'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }
  
      const resData = await res.json();
      console.log('data ;>> ', resData);
    } catch (error) {
      console.error('Error during fetch:', error.message);
      alert('Failed to fetch. Please check the server or network settings.');
    }
  };
  
  return (
    <div className='bg-light h-screen flex items-center justify-center'>
      <div className='bg-light w-[600px] h-[800px] shadow-lg rounded-lg flex flex-col justify-center items-center'>
        <div className='text-4xl font-extrabold text-black mb-1'>
          Welcome {isSignInPage && 'Back'}
        </div>
        <div className='text-xl font-light text-black mb-10'>
          {isSignInPage ? 'Sign in to Explore' : 'Sign up now to get started'}
        </div>
        <form className='flex flex-col items-center w-full' onSubmit={handleSubmit}>
          {!isSignInPage && (
            <Input
              label='Full Name'
              name='fullName' // Corrected the name attribute
              placeholder='Enter your full name'
              className='mb-4 w-[50%]'
              value={data.fullName}
              onChange={(e) => setData({ ...data, fullName: e.target.value })}
            />
          )}
          <Input
            label='Email address'
            name='email'
            type='email'
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            placeholder='Enter your email'
            className='mb-4 w-[50%]'
          />
          <Input
            label='Password'
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
            name='password'
            type='password'
            placeholder='Enter your Password'
            className='mb-4 w-[50%]'
          />
          {/* Button for Sign In/Sign Up */}
          <Button label={isSignInPage ? 'Sign In' : 'Sign Up'} type='submit' className={`mb-5 w-[50%] ${isSignInPage ? 'w-[100px]' : 'w-1/2'}`} />
        </form>
        <div>
          {isSignInPage ? "Don't have an account?" : "Already have an account?"}
          <span className='text-primary cursor-pointer' onClick={() => navigate(`/users/${isSignInPage ? 'sign_up' : 'sign_in'}`)}>
            {isSignInPage ? ' Sign up' : ' Sign in'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Form;
