import axios from 'axios';
import React, { lazy, useEffect, useState, Suspense } from 'react'
import Nav from './Nav';
const Card = lazy(() => import('./Card'));
import { Formik } from 'formik';
import * as Yup from 'yup';
import { IoMdPersonAdd } from "react-icons/io";
import { TiDeleteOutline } from "react-icons/ti";
import { InfinitySpin } from 'react-loader-spinner'

const RegisterSchema = Yup.object().shape({
    firstName: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
    lastName: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    department: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
    designation: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
    salary: Yup.number().required('Required').positive('Must be positive').integer('Must be an integer'),
    // doj: Yup.date().required('Required'),
});

const initialValuesRegister = {
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    designation: '',
    salary: '',
    doj: '',
    picture: null
}
const updateValidationSchema = Yup.object().shape({
    firstName: Yup.string(),
    lastName: Yup.string(),
    email: Yup.string().required('Email is required for Identification'),
    salary: Yup.number(),
    department: Yup.string(),
    designation: Yup.string(),
    doj: Yup.date(),
});

const Home = () => {

    const [data, setdata] = useState(null);
    const [modal, openModal] = useState(false);
    const [isRegister, setisRegister] = useState(true);
    const [currUser, setCurrUser] = useState(null);

    const getAllUsers = async () => {
        try {
            axios.get('https://skyniche-server.onrender.com/api/user/getusers')
                .then((response) => {
                    // console.log(response);
                    setdata(response.data.data)
                })
                .catch((error) => {
                    console.log("Error", error);
                })
        } catch (error) {
            console.log("Something went wrong at gettingallusers", error);
        }
    }

    console.log("Data", data);
    console.log("currUser", currUser);
    console.log("isReg", isRegister);
    console.log("Modal", modal);


    const registerUser = async (values) => {

        const formdata = new FormData();

        console.log(values, "Inside fn");

        for (let val in values) {
            formdata.append(val, values[val]);
        }

        // picture && formdata.append('profile', values.picture.name)

        for (let pair of formdata.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        try {
            axios.post('https://skyniche-server.onrender.com/api/user/adduser', formdata
                , {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                .then((response) => {
                    console.log("User added successfully", response);
                    getAllUsers();
                })
                .catch((error) => console.log("Error", error))
        } catch (error) {
            console.log("Something went wrong while registering user");
        }
    }

    const updateUser = async (values) => {

        const formdata = new FormData();

        for (let val in values) {
            formdata.append(val, values[val]);
        }

        for (let pair of formdata.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        try {
            axios.patch('https://skyniche-server.onrender.com/api/user/updateuser', formdata
                , {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                .then((response) => {
                    console.log("User updated successfully", response);
                    getAllUsers();
                })
                .catch((error) => console.log("Error", error))
        } catch (error) {
            console.log("Something went wrong while Updating user");
        }
    }

    const handleModal = (register, user = null) => {
        setisRegister(register);
        setCurrUser(user);
        openModal(true)
    }


    useEffect(() => {
        getAllUsers();
    }, [])

    return (
        <>
            <Nav
                handleData={setdata}
            />
            <div className='flex flex-col min-h-fit h-full gap-2 mt-3 relative'>
                <div className='flex justify-between p-2'>
                    <h1 className='font-bold text-2xl'>Employee</h1>
                    <button onClick={() => {
                        handleModal(true)
                    }} className='rounded-full px-4 py-2 bg-fuchsia-500'><IoMdPersonAdd /></button>
                </div>
                <div className={`min-h-full w-full rounded-lg bg-black bg-opacity-45 z-10 absolute items-center justify-center ${modal ? "flex" : "hidden"}`}>
                    <div className='border w-fit rounded-md min-w-80 bg-blue-300'>
                        <div className='flex justify-end'>
                            <button onClick={() => { openModal(false) }} className='rounded-full text-black px-2 py-2 text-2xl font-bold'><TiDeleteOutline /></button>
                        </div>
                        <Formik
                            initialValues={isRegister ? initialValuesRegister : {
                                firstName: currUser?.firstName || '',
                                lastName: currUser?.lastName || '',
                                email: currUser?.email || '',
                                department: currUser?.department || '',
                                designation: currUser?.designation || '',
                                salary: currUser?.salary || '',
                                doj: currUser?.doj || '',
                                picture: null,
                            }}
                            validationSchema={isRegister ? RegisterSchema : updateValidationSchema}
                            onSubmit={async (values, actions) => {
                                isRegister ? await registerUser(values) : await updateUser(values);

                                actions.resetForm();
                                openModal(false)
                            }}
                        >
                            {({ handleSubmit, handleBlur, handleChange, values, touched, errors, setFieldValue }) => {
                                return (
                                    <form encType="multipart/form-data" className='flex flex-col p-5 gap-3' onSubmit={handleSubmit}>

                                        {['firstName', 'lastName', 'email', 'department', 'designation', 'salary'].map((field) => {

                                            return (
                                                <>
                                                    <div className="flex gap-3 flex-wrap w-full justify-start items-center" key={field}>
                                                        <label className='font-semibold' htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)} : </label>
                                                        <input
                                                            onBlur={handleBlur}
                                                            onChange={handleChange}
                                                            value={values[field]}
                                                            className={`px-2 py-1 rounded-md bg-slate-300 ${touched[field] && errors[field] ? 'border-red-500' : ''}`}
                                                            type={field === 'salary' ? 'number' : field === 'email' ? 'email' : 'text'}
                                                            name={field}
                                                            id={field}
                                                        />
                                                        {touched[field] && errors[field] && <div className="text-red-500">{errors[field]}</div>}
                                                    </div>
                                                </>
                                            )
                                        }
                                        )}

                                        <div className="flex gap-3 flex-wrap items-center">
                                            <label className='font-semibold' htmlFor="doj">Date Of Joining : </label>
                                            <input
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.doj}
                                                className={`px-2 py-1 rounded-md bg-slate-300 ${touched.doj && errors.doj ? 'border-red-500' : ''}`}
                                                type="date"
                                                name="doj"
                                                id="doj"
                                            />
                                            {touched.doj && errors.doj && <div className="text-red-500">{errors.doj}</div>}
                                        </div>

                                        <div className="flex gap-3 flex-wrap items-center">
                                            <label className='font-semibold' htmlFor="profile">Profile photo :</label>
                                            <input
                                                onBlur={handleBlur}
                                                onChange={(e) => setFieldValue('picture', e.currentTarget.files[0])}
                                                className={`min-w-[1.5rem] px-2 py-1 rounded-md bg-slate-300 ${touched.doj && errors.doj ? 'border-red-500' : ''}`}
                                                type="file"
                                                name="picture"
                                                id="picture"
                                            />
                                            {touched.doj && errors.doj && <div className="text-red-500">{errors.doj}</div>}
                                        </div>

                                        <button type="submit" className='bg-green-600 rounded-md px-2 py-1'>{isRegister ? "Submit" : "Update"}</button>
                                    </form>
                                )
                            }}
                        </Formik>
                    </div>
                </div>
                <div className='flex flex-wrap justify-center md:justify-start w-full p-3 gap-2'>

                    {
                        !data ?
                            <div className='flex justify-center items-center w-full h-screen'>
                                <InfinitySpin
                                    visible={true}
                                    width="200"
                                    color="#4fa94d"
                                    ariaLabel="infinity-spin-loading"
                                />
                            </div>
                            :
                            data?.map((e, idx) => {
                                return (
                                    <Suspense fallback={<div className='h-full w-full text-center font-bold text-3xl'>Loading...</div>}>
                                        <Card
                                            key={idx + 1}
                                            firstName={e.firstName}
                                            lastName={e.lastName}
                                            salary={e.salary}
                                            desig={e.designation}
                                            dept={e.department}
                                            email={e.email}
                                            profile={e.profile}
                                            modal={() => { handleModal(false, e) }}
                                            reload={getAllUsers}
                                        />
                                    </Suspense>
                                )
                            })
                    }
                </div>
            </div>
        </>
    )
}

export default Home
