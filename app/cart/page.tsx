import React from 'react'
import { getServerSession } from 'next-auth'
import {options} from "@/app/api/auth/[...nextauth]/options"
import Navbar from '../components/Navbar'
import AllCartProduct from '../components/AllCartProduct'
import Allpurchased from '../components/Allpurchased'

type Props = {}

const Cart = async (props: Props) => {
    const session = await getServerSession(options)
  return (
    <>
    <div className='max-w-[1280px] mx-auto px-5'>
        <Navbar/>
        <AllCartProduct userId={Number(session?.user?.id ?? 0)} />
        <hr className='mt-10 mb-10' />
        <Allpurchased userId={Number(session?.user?.id ?? 0)} />
    </div>
    </>
  )
}

export default Cart