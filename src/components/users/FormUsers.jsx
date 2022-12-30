import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaAngleLeft, FaUserPlus, FaUserEdit, FaSpinner } from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { apiUrl, config, routeServer } from '../../App'
import {FormInput, FormSelect} from '../index'

const FormUsers = () => {

  const {id} = useParams();

  const [loading, setLoading] = useState(false);

  const {handleSubmit, watch, formState: {errors}, reset, register} = useForm();

  const userValidation = {
    required: {
      value: true,
      message: 'El usuario es requerido'
    }
  }
  
console.log(errors);

  const createUser = (fields) => {
    axios.post(`${apiUrl}/users`, fields, config)
      .then(res => {
        const {data} = res
        Swal.fire(data.message, data.text, data.type)
        if (data.code === 1){
          reset();
        }
      }) 
  }

  useEffect(() => {
    if (id) {
      const getUser = () => {
        setLoading(true)
        axios.get(`${apiUrl}/users/${id}`, config)
          .then(res => {
            const {Usuario, Nombre, Correo, Tipo, Estado} = res.data.user;
            reset({Usuario, Nombre, Correo, Tipo, Estado})
            setLoading(false)
          })
      }

      getUser();

    }
  }, [])

  const editUser = (fields) => {
    axios.post(`${apiUrl}/edit-user/${id}`, fields, config)
      .then(res => {
        const {data} = res
        Swal.fire(data.message, data.text, data.type)
      }) 
  }

  return (
    <div className='px-3'>
      <div className="flex flex-wrap justify-between items-center w-full border-b-2 border-gray-500 sticky top-0 bg-gray-200">
        <h1 className="font-bold text-4xl sm:text-3xl py-3 md:py-4 flex gap-3 items-center"><Link to={routeServer+"/usuarios"}><FaAngleLeft className='text-gray-700 hover:scale-125 transition-all duration-200' title="Volver"/></Link> {!id ? 'Crear usuario' : 'Editar usuario'} {!id ? <FaUserPlus /> : <FaUserEdit />}</h1>
      </div>
      <div className="flex justify-center mt-4">
        <div className="bg-white rounded-md w-[50em] m-auto p-4">
          {loading ? (
            <div className='flex items-center justify-center font-bold text-3xl h-[50vh] w-full'><FaSpinner className='animate-spin m-auto block'/></div>
          ) : (
            <>
              <h1 className='text-center font-bold text-[2em]'>Información del usuario</h1>
              <form onSubmit={handleSubmit(!id ? createUser : editUser)} className="flex flex-col items-center">
                <FormInput 
                  type="text" 
                  field="Usuario" 
                  label="Usuario:" 
                  placeholder="Ingrese el usuario..."
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
                  type="text" 
                  field="Nombre" 
                  label="Nombre:" 
                  placeholder="Ingrese el nombre..."
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
                  type="text" 
                  field="Correo" 
                  label="Correo:" 
                  placeholder="Ingrese el nombre..."
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
                      label="Tipo:" 
                      register={register}
                      error={errors.Tipo}
                      placeholder="Seleccione un tipo"
                      validation={{
                        required: {
                          value: true,
                          message: 'El tipo es requerido'
                        }
                      }}
                      options={["USUARIO", "TECNICO"]}
                    />
                    <FormSelect
                      field="Estado" 
                      label="Estado:" 
                      register={register}
                      error={errors.Estado}
                      placeholder="Seleccione un estado"
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
                <input className='px-4 py-2 mt-2 text-white font-bold bg-green-500 w-[10em] rounded-md hover:brightness-90 transition-all duration-200 cursor-pointer' type="submit" value={!id ? 'Crear': 'Editar'} />
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default FormUsers