"use client";
import React,{useState,useEffect} from 'react';
import axios from 'axios';
import { signIn,signOut,useSession } from 'next-auth/react';
import Navbar from "../components/Navbar";
import { useRouter } from 'next/navigation';


type Props = {}

const Productform = (props:Props) => {
    const {data:session} = useSession()
    const id = session?.user.id
    const router = useRouter()
    const [formDta,setFormData] = useState({
        title:'',
        description:'',
        category:'',
        style:'',
        size:'',
        inventory:0,
        color:'#fe345e',
        price:0,
        images:'',
        userId:id,
        store:''
    })
  return (
    <div>page</div>
  );
};

export default Productform;