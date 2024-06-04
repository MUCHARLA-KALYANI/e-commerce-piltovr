"use client";
import React,{useState} from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from "axios";
import {signIn} from "next-auth/react";

type Props={}


const SigninForm = (props:Props) => {
    const router=useRouter()
    const[user,setUser]=useState({
        email:'',
        password:''

    })
    const Login = () =>{
        try{
            signIn('credentials',{
                email:user.email,
                password:user.password,
                redirect:true,
                callbackUrl:'/'
            })
        }
        catch{
            console.log("Error while signing in");
        }
    }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
    <div className="p-10 rounded-lg shadow-lg flex flex-col">
      <h1 className="text-xl font-medium mb-4">Sign In</h1>
      <label htmlFor="email" className="mb-2">Email</label>
      <input
        type="email"
        className="p-2 border-gray-300 border-[1px] rounded-lg w-[300px] mb-4 focus:outline-none focus:border-gray-600 text-black"
        id="email"
        value={user.email}
        placeholder="Email"
        onChange={(e) => setUser({ ...user, email: e.target.value })}
      />
      <label htmlFor="password" className="mb-2">Password</label>
      <input
        type="password"
        className="p-2 border-gray-300 border-[1px] rounded-lg w-[300px] mb-4 focus:outline-none focus:border-gray-600 text-black"
        id="password"
        value={user.password}
        placeholder="Password"
        onChange={(e) => setUser({ ...user, password: e.target.value })}
      />
      <button
        className="p-2 bg-purple-600 text-white border-gray-300 mt-2 mb-4 focus:outline-none focus:border-gray-600"
        onClick={Login}
      >
        Login Now
      </button>
      <Link href="/signup" className="text-sm text-center mt-5 text-neutral-600">
        Don't have an account?<span className='text-blue-400'>click here</span>
      </Link>
      <Link href="/" className="text-center mt-2">Home</Link>
    </div>
  </div>
  );
};

export default SigninForm;