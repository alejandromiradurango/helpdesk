import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2'
import { apiUrl, routeServer } from '../App'
import { Input } from "@material-tailwind/react";
import { logoWhite } from '../assets'

const Login = () => {
  const { register, handleSubmit, formState: {errors} } = useForm()

  const [loading, setLoading] = useState(false)

  const doLogin = (fields) => {
    setLoading(true)
    setTimeout(() => {
        axios.post(`${apiUrl}/token`, fields)
            .then((res) => {
                const {data} = res;
                if (data.code === 1) {
                    localStorage.setItem('token', data.token)
                    localStorage.setItem('name', data.user.Nombre)
                    localStorage.setItem('user', data.user.Usuario)
                    localStorage.setItem('typeUser', data.user.Tipo)
                    window.location.href = routeServer
                } else {
                    Swal.fire(data.message, '', data.type)
                }
                setLoading(false)
            })
    }, 500);
  }

  useEffect(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('name')
    localStorage.removeItem('typeUser')
  }, [])

  return (
    <div className='h-full bg-[#0e2a66] flex flex-col items-center justify-center p-2 md:p-0'>
        <div className="w-[90%] sm:w-[34em] flex items-center flex-col gap-2 p-4 rounded-md bg-gray-300 relative">
            <img src={logoWhite} alt="Logo Ragged en color Blanco" className='absolute top-[-70%] w-[18em]'/>
            <h1 className="text-2xl text-center font-bold uppercase">Iniciar sesión</h1>
            <form className='flex flex-col gap-4 w-full' onSubmit={handleSubmit(doLogin)}>
                <div className='flex flex-col items-start w-[90%] m-auto sm:w-[23em] relative'>
                    <Input 
                        label={errors.email ? errors.email.message : "Correo"} 
                        error={errors.email} 
                        {...register('email', {
                            required: {
                                value: true,
                                message: 'Correo requerido',
                            },
                            pattern: {
                                value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                                message: 'Correo no válido'
                            }
                        })}
                        disabled={loading}
                    />
                </div>
                <input className="w-36 m-auto block font-bold bg-blue-600 text-white py-2 cursor-pointer uppercase rounded-md hover:brightness-75 transition-all duration-300 disabled:brightness-75 disabled:cursor-wait" type="submit" value="Ingresar" disabled={loading}/>
            </form>
        </div>
    </div>
  )
}

export default Login