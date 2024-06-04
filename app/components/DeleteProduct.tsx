'use client'
import React from 'react'
import axios from 'axios'
import { GoTrash } from 'react-icons/go'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

type Props = {
    productId?: number
    userId?: number
}

const DeleteProduct = ({ productId, userId }: Props) => {
    const router = useRouter()
    const MySwal = withReactContent(Swal)

    const handleDelete = async () => {
        MySwal.fire({
            title: 'Are you sure?',
            text: 'Do you want to delete this product?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete('/api/addproduct', {
                        data: {
                            productId: productId,
                            userId: userId
                        }
                    })
                    MySwal.fire(
                        'Deleted!',
                        'Your product has been deleted.',
                        'success'
                    )
                    router.refresh()
                } catch (error) {
                    MySwal.fire(
                        'Error!',
                        'There was an error deleting the product.',
                        'error'
                    )
                }
            }
        })
    }

    return (
        <div onClick={handleDelete} className='cursor-pointer'>
            <GoTrash className='text-red-600' size={20} />
        </div>
    )
}

export default DeleteProduct
