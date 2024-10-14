import axios from 'axios';
import React, { useState } from 'react'

const Nav = ({ handleData }) => {

    const [searchQuery, setsearchQuery] = useState("");

    const searchUsers = async () => {
        try {
            console.log(searchQuery);
            axios.post('https://skyniche-server.onrender.com/api/user/search', {
                searchquery: searchQuery
            })
                .then((response) => {
                    console.log(response);
                    handleData(response.data.data);
                    setsearchQuery("");
                })
                .catch((error) => {
                    console.log("Error", error);
                })
        } catch (error) {
            console.log("Something went wrong at gettingallusers", error);
        }
    }

    console.log(searchQuery);


    return (
        <>
            <nav className='flex justify-between'>
                <div className='flex gap-3 items-center bg-slate-600 rounded-full'>
                    <span className='bg-red-500 rounded-full w-8 h-8 flex items-center justify-center font-bold'>S</span>
                    <p className='mr-4 text-orange-400' >DashBoard</p>
                </div>
                <div>
                    <div className='flex justify-between border rounded-full px-2 items-center'>
                        <input value={searchQuery} onChange={(e) => { setsearchQuery(e.target.value) }} className='w-full px-2 py-1 border-none outline-none bg-transparent' placeholder='Search...' type="text" />
                        <span onClick={searchUsers} className='cursor-pointer z-10 bg-zinc-600 rounded-full px-2 text-amber-500'>Search</span>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Nav
