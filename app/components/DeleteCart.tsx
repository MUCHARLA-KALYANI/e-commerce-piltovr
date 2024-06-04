'use client'
import React from 'react'
import axios from 'axios'
import {GoTrash} from "react-icons/go"
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2';

type Props = {
    productId?:number
    userId?:number
}

const DeleteCart = (props: Props) => {
    const router = useRouter()
    const handleDelete = async () => {
        try {
          const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          });
      
          if (result.isConfirmed) {
            await axios.delete('/api/cart', {
              data: {
                productId: props.productId,
                userId: props.userId
              }
            });
            router.refresh();
            Swal.fire(
              'Deleted!',
              'Your item has been deleted.',
              'success'
            );
          }
        } catch (error) {
          console.log(error);
          Swal.fire(
            'Error',
            'Something went wrong while deleting the item.',
            'error'
          );
        }
      };
  return (
    <div className='cursor-pointer' onClick={handleDelete}>
        <GoTrash className='text-red-500' size={20}/>
    </div>
  )
}

export default DeleteCart