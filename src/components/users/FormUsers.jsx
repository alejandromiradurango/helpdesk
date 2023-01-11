import { Button } from '@material-tailwind/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaAngleLeft, FaUserPlus, FaUserEdit, FaSpinner } from 'react-icons/fa'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { apiUrl, config, routeServer } from '../../App'
import {FormInput, FormSelect} from '../index'

const FormUsers = () => {

  const {id} = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const {handleSubmit, formState: {errors}, reset, register} = useForm();

  const createUser = (fields) => {
    setLoading(true)
    axios.post(`${apiUrl}/users`, fields, config)
      .then(res => {
        const {data} = res
        Swal.fire(data.message, data.text, data.type)
        if (data.code === 1){
          reset();
        }
        setLoading(false)
      }) 
  }

  useEffect(() => {
    if (id) {
      setLoading(true)
      axios.get(`${apiUrl}/users/${id}`, config)
        .then(res => {
          const {Usuario, Nombre, Correo, Tipo, Estado} = res.data.user;
          reset({Usuario, Nombre, Correo, Tipo, Estado})
          setLoading(false)
        })
    }
  }, [id, reset])

  const editUser = (fields) => {
    axios.post(`${apiUrl}/edit-user/${id}`, fields, config)
      .then(res => {
        const {data} = res
        navigate(routeServer+"/usuarios")
        Swal.fire(data.message, data.text, data.type)
      }) 
  }

  return (
    <div className='px-3'>
      <div className="flex flex-wrap justify-between items-center w-full border-b-2 border-gray-500 bg-gray-200">
        <h1 className="font-bold text-2xl sm:text-3xl py-3 md:py-4 flex gap-3 items-center"><Link to={routeServer+"/usuarios"}><FaAngleLeft className='text-gray-700 hover:scale-125 transition-all duration-200' title="Volver"/></Link> {!id ? 'Crear usuario' : 'Editar usuario'} {!id ? <FaUserPlus /> : <FaUserEdit />}</h1>
      </div>
      <div className="flex justify-center sm:mt-4 md:h-[80vh]">
        <div className="bg-white rounded-md w-full md:w-[50em] h-auto 3xl:h-fit mx-auto mt-4 p-4">
          {loading ? (
            <div className='flex items-center justify-center font-bold text-3xl h-[50vh] w-full'><FaSpinner className='animate-spin m-auto block'/></div>
          ) : (
            <>
              <h1 className='text-center font-bold text-[2em]'>Información del usuario</h1>
              <form onSubmit={handleSubmit(!id ? createUser : editUser)} className="flex flex-col items-center sm:w-[25em] lg:w-[35em] m-auto">
                <FormInput 
                  field="Usuario" 
                  register={register}
                  error={errors.Usuario}
                  validation={{
                    required: {
                      value: true,
                      message: 'El usuario es requerido'
                    }
                  }}
                />
                <FormInput 
                  field="Nombre" 
                  register={register}
                  error={errors.Nombre}
                  validation={{
                    required: {
                      value: true,
                      message: 'El nombre es requerido'
                    }
                  }}
                />
                <FormInput  
                  field="Correo" 
                  register={register}
                  error={errors.Correo}
                  validation={{
                    required: {
                      value: true,
                      message: 'El correo es requerido'
                    },
                    pattern : {
                      value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                      message: 'El correo no es válido'
                    }
                  }}
                />
                {id && (
                  <>
                    <FormSelect
                      field="Tipo" 
                      register={register}
                      error={errors.Tipo}
                      validation={{
                        required: {
                          value: true,
                          message: 'El tipo es requerido'
                        }
                      }}
                      options={["", "USUARIO", "TECNICO"]}
                    />
                    <FormSelect
                      field="Estado"  
                      register={register}
                      error={errors.Estado}
                      validation={{
                        required: {
                          value: true,
                          message: 'El estado es requerido'
                        }
                      }}
                      options={["ACTIVO", "INACTIVO"]}
                    />
                  </>
                )}
                <Button size='lg' variant='gradient' color="green" className='mt-2' type="submit">{!id ? 'Crear': 'Editar'}</Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default FormUsers