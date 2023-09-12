import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2'
import { apiUrl, routeServer } from '../App'
import { Input, Switch } from "@material-tailwind/react";
import { logoWhite } from '../assets'
import { useStateContext } from '../contexts/ContextApp'

const Login = () => {
  const { register, handleSubmit, formState: {errors} } = useForm()

  const [loading, setLoading] = useState(false);
  const [isTech, setIsTech] = useState(false);

  const {getToken, getName, getUser, getRol} = useStateContext();

  const doLogin = (fields) => {
    setLoading(true)
    setTimeout(() => {
        axios.post(`${apiUrl}/token?isTech=${isTech}`, fields)
            .then((res) => {
                const {data} = res;
                if (data.code === 1) {
                    getToken(data.token)
                    getName(data.user.Nombre)
                    getUser(data.user.Usuario)
                    getRol(data.user.Tipo)
                    if(data.user.Tipo === 'USUARIO'){
                        window.location.href = routeServer + '/tickets'
                    } else {
                        window.location.href = routeServer
                    }
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
    <div className='h-full bg-[#000] flex flex-col items-center justify-center p-2 md:p-0 gap-4'>
        <img src={logoWhite} alt="Logo Ragged en color Blanco" className='w-[18em]'/>
        <div className="w-[90%] sm:w-[34em] flex items-center flex-col gap-2 p-4 rounded-md bg-gray-300 relative">
            <h1 className="text-2xl text-center font-bold uppercase">Iniciar sesión</h1>
            <form className='flex flex-col gap-4 w-full' onSubmit={handleSubmit(doLogin)}>
                <div className='flex flex-col items-start w-[90%] m-auto sm:w-[23em] relative gap-4'>
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
                    {isTech && (
                        <Input 
                            label={errors.password ? errors.password.message : "Contraseña"} 
                            error={errors.password} 
                            {...register('password', {
                                required: {
                                    value: true,
                                    message: 'Contraseña requerida',
                                },
                            })}
                            disabled={loading}
                            type='password'
                        />
                    )}
                    <Switch defaultChecked={isTech} label="Ingresar como tecnico" className='' onChange={() => setIsTech(prev => !prev)}/>
                </div>
                <input className="w-36 m-auto block font-bold bg-blue-600 text-white py-2 cursor-pointer uppercase rounded-md hover:brightness-75 transition-all duration-300 disabled:brightness-75 disabled:cursor-wait" type="submit" value="Ingresar" disabled={loading}/>
            </form>
        </div>
    </div>
  )
}

export default Login