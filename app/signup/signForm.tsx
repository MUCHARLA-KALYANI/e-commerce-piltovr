"use client"
import React,{useState} from "react";
import {useRouter} from "next/router";
import Link from "next/link";
type Props={}

const SignForm = (props:Props) =>{
    const[user,setUser]=useState({
        name:"",
        email:"",
        password:""
    })
    return(
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <div className="p-10 rounded-lg shadow-lg flex flex-col">
                <h1 className="text-xl font-medium mb-4">Sign Up</h1>
                <label htmlFor="" className="mb-2">Email</label>
                 <input 
                 type="text" 
                 className="p-2 border-gray-300 border-[1px] rounded-lg w-[300px mb-4 focus:outline-none focus:border-gray-600 text-black"
                 id="name"
                 value={user.email}
                 placeholder="name"
                 onChange={(e) => setUser({...user,email:e.target.value})}
                 />
                 <label htmlFor="" className="mb-2">Password</label>
                 <input 
                 type="text" 
                 className="p-2 border-gray-300 border-[1px] rounded-lg w-[300px mb-4 focus:outline-none focus:border-gray-600 text-black"
                 id="name"
                 value={user.password}
                 placeholder="name"
                 onChange={(e) => setUser({...user,password:e.target.value})}
                 />
                 <button className="p-2 bg-purple-600 text-white border-gray-300 mt-2 mb-4 focus:outline-none focus:border-gray-600">Register Now</button>
                 <Link href="/signin" className="text-sm shadow-md text-centermt-5 text-neutral-600 ">Already have an account?</Link>
            </div>
        </div>
    )
}

export default SignForm