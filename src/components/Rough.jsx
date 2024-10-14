import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Nav from './Nav';
import Card from './Card';
import { Formik } from 'formik';
import { useFormik } from 'formik';
import * as Yup from 'yup'

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
}



const Home = () => {

    const [data, setdata] = useState(null);
    const [modal, openModal] = useState(false);
    const [user, setUser] = useState(null);

    const getAllUsers = async () => {
        try {
            axios.get('http://localhost:8000/api/user/getusers')
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

    const { values, errors, handleBlur, handleChange, onSubmit, touched, handleSubmit, setFieldValue } = useFormik({
        initialValues: initialValuesRegister,
        validateOnBlur: false,
        validateOnChange: true,
        onSubmit: (values, actions) => {
            const formData = new FormData();

            for (let key in values) {
                formData.append(key, values[key]);
            }

            try {
                axios.post('http://localhost:8000/api/user/adduser', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                    .then((response) => console.log("User added successfully", response))
                    .catch((error) => console.log("Error", error))
            } catch (error) {
                console.log("Something went wrong while registering user");
            }

        }
    })

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files.length > 0) {
            setFieldValue(name, files[0])
        }
    }
    // console.log(data);

    // const registerUser = async (values) => {

    //     const formdata = new FormData();

    //     console.log(values, "Inside fn");

    //     for (let val in values) {
    //         formdata.append(val, values[val]);
    //     }

    //     formdata.append('picture', values.profile.name)

    //     for (let pair of formdata.entries()) {
    //         console.log(pair[0] + ': ' + pair[1]);
    //     }


    // }




    useEffect(() => {
        getAllUsers();
    }, [])

    return (
        <>
            <Nav />
            <div className='flex flex-col gap-2 mt-3 relative'>
                <div className='flex justify-between'>
                    <h1 className='font-bold'>Employee</h1>
                    <button onClick={() => { openModal(true) }} className='rounded-full px-2 py-1 bg-blue-700'>Add Employee</button>
                </div>
                <div className={`min-h-full w-full bg-black bg-opacity-45 z-10 absolute items-center justify-center ${modal ? "flex" : "hidden"}`}>
                    <div className='border rounded-md min-w-96 w-fit  bg-blue-300'>
                        <div className='flex justify-end'>
                            <button onClick={() => { openModal(false) }} className='bg-red-600 px-2 text-white font-bold'>X</button>
                        </div>
                        <Formik>
                            <form encType="multipart/form-data" className='flex flex-col p-5 gap-3' onSubmit={handleSubmit}>

                                <div className="flex gap-3 items-center">
                                    <label htmlFor="firstName">First Name</label>
                                    <input
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.firstName}
                                        className={`px-2 py-1 rounded-md bg-slate-300 ${touched.firstName && errors.firstName ? 'border-red-500' : ''}`}
                                        type="text"
                                        name="firstName"
                                        id="firstName"
                                    />
                                    {touched.firstName && errors.firstName && <div className="text-red-500">{errors.firstName}</div>}
                                </div>

                                <div className="flex gap-3 items-center">
                                    <label htmlFor="lastName">Last Name</label>
                                    <input
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.lastName}
                                        className={`px-2 py-1 rounded-md bg-slate-300 ${touched.lastName && errors.lastName ? 'border-red-500' : ''}`}
                                        type="text"
                                        name="lastName"
                                        id="lastName"
                                    />
                                    {touched.lastName && errors.lastName && <div className="text-red-500">{errors.lastName}</div>}
                                </div>

                                <div className="flex gap-3 items-center">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.email}
                                        className={`px-2 py-1 rounded-md bg-slate-300 ${touched.email && errors.email ? 'border-red-500' : ''}`}
                                        type="email"
                                        name="email"
                                        id="email"
                                    />
                                    {touched.lastName && errors.lastName && <div className="text-red-500">{errors.lastName}</div>}
                                </div>

                                <div className="flex gap-3 items-center">
                                    <label htmlFor="department">Department</label>
                                    <input
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.department}
                                        className={`px-2 py-1 rounded-md bg-slate-300 ${touched.department && errors.department ? 'border-red-500' : ''}`}
                                        type="text"
                                        name="department"
                                        id="department"
                                    />
                                    {touched.department && errors.department && <div className="text-red-500">{errors.department}</div>}
                                </div>
                                <div className="flex gap-3 items-center">
                                    <label htmlFor="designation">Designation</label>
                                    <input
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.designation}
                                        className={`px-2 py-1 rounded-md bg-slate-300 ${touched.designation && errors.designation ? 'border-red-500' : ''}`}
                                        type="text"
                                        name="designation"
                                        id="designation"
                                    />
                                    {touched.designation && errors.designation && <div className="text-red-500">{errors.designation}</div>}
                                </div>

                                <div className="flex gap-3 items-center">
                                    <label htmlFor="salary">Salary</label>
                                    <input
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.salary}
                                        className={`px-2 py-1 rounded-md bg-slate-300 ${touched.salary && errors.salary ? 'border-red-500' : ''}`}
                                        type="number"
                                        name="salary"
                                        id="salary"
                                    />
                                    {touched.salary && errors.salary && <div className="text-red-500">{errors.salary}</div>}
                                </div>

                                <div className="flex gap-3 items-center">
                                    <label htmlFor="doj">Date Of Joining</label>
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

                                <div className="flex gap-3 items-center">
                                    <label htmlFor="profile">Profile photo</label>
                                    <input
                                        value={values.profile}
                                        className={`px-2 py-1 rounded-md bg-slate-300 ${touched.doj && errors.doj ? 'border-red-500' : ''}`}
                                        type="file"
                                        name="picture"
                                        id="picture"
                                        onChange={handleFileChange}
                                        onBlur={handleBlur}
                                    />
                                    {touched.doj && errors.doj && <div className="text-red-500">{errors.doj}</div>}
                                </div>

                                <button type="submit" className='bg-green-600 rounded-md px-2 py-1'>Submit</button>
                            </form>
                        </Formik>
                    </div>
                </div>
                <div className='flex flex-wrap w-full gap-2'>
                    {
                        !data ? null :
                            data.map((e, idx) => {
                                return (
                                    <Card
                                        key={idx}
                                        name={e.firstName + " " + e.lastName}
                                        salary={e.salary}
                                        desig={e.designation}
                                        dept={e.department}
                                        email={e.email}
                                    />)
                            })
                    }
                </div>
            </div>
        </>
    )
}

export default Home
