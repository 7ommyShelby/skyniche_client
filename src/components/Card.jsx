import axios from 'axios';
import React, { useState } from 'react'
import { CiEdit } from "react-icons/ci";
import { AiTwotoneDelete } from "react-icons/ai";



const Card = ({ reload, modal, firstName, lastName, salary, desig, dept, email, profile }) => {

    const delUser = async (email) => {

        try {
            axios.delete('https://skyniche-server.onrender.com/api/user/deleteuser', {
                data: { email: email }
            })
                .then((response) => {
                    console.log(response);
                    reload();
                })
                .catch((err) => {
                    console.log(err);
                })
        } catch (error) {
            console.log("Something Went wrong at removing user", error);
        }
    }

    return (

        <div className='bg-indigo-300 p-2 flex flex-col w-56 flex-shrink-0 rounded-2xl'>
            <div className='flex justify-end'>
                <button onClick={() => { delUser(email) }} className=' bg-blue-700 rounded-md py-2 px-2 font-semibold'><AiTwotoneDelete /></button>
            </div>

            <div className='flex flex-col items-center'>
                <div className='flex text-center justify-center items-center rounded-full h-40 w-40 bg-zinc-700 overflow-hidden '>
                    {
                        profile ? <img className='w-full h-full object-cover' src={profile && profile} /> : <span className='font-bold text-4xl text-center'>{`${firstName.charAt(0).toUpperCase()} ${lastName.charAt(0).toUpperCase()}`}</span>
                    }
                </div>

                <h1 className='font-semibold capitalize'>{`${firstName} ${lastName}`}</h1>
                <h3>{email}</h3>

                <div className='flex justify-around w-full '>
                    <button onClick={modal} className='bg-green-600 px-3 py-2 text-xl rounded-md'><CiEdit /></button>
                    {/* <button  className='bg-green-600 px-3 py-1 rounded-md'>Delete</button> */}
                </div>

                <div className=' w-full text-start px-2'>
                    <p><b>CTC</b> : ${salary}</p>
                    <p><b>Designation</b> : {desig}</p>
                    <p><b>Dept</b> : {dept}</p>
                </div>
            </div>
        </div>

    )
}

export default Card
