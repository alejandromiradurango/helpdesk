import axios from 'axios'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { apiUrl, routeServer } from '../App'

const Login = () => {
  const { register, handleSubmit, formState: {errors} } = useForm()

  const navigate = useNavigate();

  const doLogin = (fields) => {
    console.log(fields)
    axios.post(`${apiUrl}/token`, fields)
     .then((res) => {
        const {data} = res;
        console.log(data)
        if (data.code === 1) {
            localStorage.setItem('token', data.token)
            localStorage.setItem('user', data.user.Nombre)
            localStorage.setItem('typeUser', data.user.Tipo)
            navigate(routeServer)
        } else {
            Swal.fire(data.message, '', data.type)
        }
      })
  }

  return (
    <div className='h-full bg-[#0e2a66] flex flex-col items-center justify-center p-2 md:p-0'>
        <div className="w-[90%] sm:w-[34em] flex items-center flex-col gap-2 p-4 rounded-md bg-gray-300">
            <h1 className="text-2xl text-center font-bold uppercase">Iniciar sesión</h1>
            <form className='flex flex-col gap-4 w-full' onSubmit={handleSubmit(doLogin)}>
                <div className='flex flex-col items-start w-[90%] m-auto sm:w-[23em] relative'>
                    <input 
                    className={`rounded-md shadow-md py-2 px-4 w-full border-2 outline-none ${errors.email && 'border-red-500 pt-5'} transition-all `}
                    placeholder="Ingresa tu correo..."
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
                    />
                    {errors.email && <small className='text-red-500 font-bold absolute top-1 left-2'>* {errors.email.message}</small>}
                </div>
                <input className="w-36 m-auto block font-bold bg-sky-600 text-white py-2 cursor-pointer uppercase rounded-md hover:brightness-75 transition-all duration-300" type="submit" value="Ingresar" />
            </form>
        </div>
    </div>
  )
}

export default Login