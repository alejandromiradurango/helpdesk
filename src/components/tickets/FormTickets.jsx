import { Button } from '@material-tailwind/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaAngleLeft, FaSpinner, FaTicketAlt } from 'react-icons/fa'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { apiUrl, config, routeServer } from '../../App'
import {FormInput, FormSelect} from '../index'

const FormTickets = () => {

  const {id} = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showSub, setShowSub] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [tableSub, setTableSub] = useState([]);
  const [technicians, setTechnicians] = useState([]);

  const {handleSubmit, formState: {errors}, reset, register, watch} = useForm();

  const createTicket = (fields) => {
    fields.Usuario = localStorage.getItem('user') 
    axios.post(`${apiUrl}/tickets`, fields, config)
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
        setLoading(true)
        axios.get(`${apiUrl}/tickets/${id}`, config)
          .then(res => {
            const {Tipo, Titulo, Descripcion, Solucion, Categoria, Subcategoria, Prioridad, Estado, Tecnico, Usuario} = res.data.ticket;
            reset({Tipo, Titulo, Descripcion, Solucion, Categoria, Subcategoria, Prioridad, Estado, Tecnico, Usuario})
            setTimeout(() => setLoading(false), 1000)
          })
      }
     
    
  }, [id, reset])

  useEffect(() => {
    axios.get(`${apiUrl}/helpers`, config)
     .then(res => {
        const {data} = res;
        setCategories(data.categories);
        setSubcategories(data.subcategories)
        setTableSub(data.subcategories)
      })
      
    axios.get(`${apiUrl}/users`, config)
       .then(res => {
            const {data} = res;
            setTechnicians(data.users.filter(user => user.Tipo === 'TECNICO'));
       })
  }, [])
  

  const editTicket = (fields) => {
    axios.post(`${apiUrl}/edit-ticket/${id}`, fields, config)
      .then(res => {
        const {data} = res
        Swal.fire(data.message, data.text, data.type)
        navigate(routeServer+"/tickets")
      }) 
  }

  const {Categoria, Estado} = watch()

  useEffect(() => {
    const results = tableSub.filter(sub => sub.Categoria.includes(Categoria));
      setSubcategories(results);
      setShowSub(true)
  }, [Categoria, tableSub]);

  return (
    <div className='px-3'>
      <div className="flex flex-wrap justify-between items-center w-full border-b-2 border-gray-500 bg-gray-200">
        <h1 className="font-bold text-2xl sm:text-3xl py-3 md:py-4 flex gap-3 items-center"><Link to={routeServer+"/tickets"}><FaAngleLeft className='text-gray-700 hover:scale-125 transition-all duration-200' title="Volver"/></Link> {!id ? 'Crear ticket' : 'Editar ticket'} <FaTicketAlt /></h1>
      </div>
      <div className="flex justify-center sm:mt-4">
        <div className="bg-white rounded-md w-full md:w-[60em] h-auto mx-auto mt-4 p-4">
          {loading ? (
            <div className='flex items-center justify-center font-bold text-3xl h-[50vh] w-full'><FaSpinner className='animate-spin m-auto block'/></div>
          ) : (
            <>
              <h1 className='text-center font-bold text-[2em]'>Información del ticket</h1>
              <form onSubmit={handleSubmit(!id ? createTicket : editTicket)} className="flex flex-col items-center sm:w-[30em] lg:w-[45em] m-auto">
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
                  options={["SOLICITUD", "INCIDENCIA"]}
                  disabled={Estado === 'CERRADO' && true}
                />
                <FormInput 
                  field="Titulo" 
                  register={register}
                  error={errors.Titulo}
                  validation={{
                    required: {
                      value: true,
                      message: 'El titulo es requerido'
                    }
                  }}
                  disabled={Estado === 'CERRADO' && true}
                />
                <FormInput 
                  type='textarea'
                  field="Descripcion" 
                  register={register}
                  error={errors.Descripcion}
                  validation={{
                    required: {
                      value: true,
                      message: 'La descripcion es requerida'
                    }
                  }}
                  disabled={Estado === 'CERRADO' && true}
                />
                {id && <FormInput 
                  type='textarea'
                  field="Solucion" 
                  register={register}
                  error={errors.Solucion}
                  validation={{
                    required: {
                      value: true,
                      message: 'La solucionTecnico es requerida'
                    }
                  }}
                  disabled={Estado === 'CERRADO' && true}
                />}
                <FormSelect
                  field="Categoria" 
                  register={register}
                  error={errors.Categoria}
                  validation={{
                    required: {
                      value: true,
                      message: 'La categoría es requerida'
                    }
                  }}
                  options={categories.map(cat => cat.Categoria)}
                  disabled={Estado === 'CERRADO' && true}
                />
                {showSub && (
                    <FormSelect
                        field="Subcategoria" 
                        register={register}
                        error={errors.Subcategoria}
                        validation={{
                        required: {
                            value: true,
                            message: 'La subcategoria es requerida'
                        }
                        }}
                        options={subcategories.map(sub => sub.SubCategoria)}
                        disabled={Estado === 'CERRADO' && true}
                    />
                )}
                <FormSelect
                  field="Prioridad" 
                  register={register}
                  error={errors.Prioridad}
                  validation={{
                    required: {
                      value: true,
                      message: 'La prioridad es requerida'
                    }
                  }}
                  options={["BAJA", "MEDIA", "ALTA"]}
                  disabled={Estado === 'CERRADO' && true}
                />
                {id && (
                  <>
                    <FormSelect
                      field="Tecnico" 
                      register={register}
                      error={errors.Tecnico}
                      validation={{
                          required: {
                          value: true,
                          message: 'El tecnico es requerido'
                          }
                      }}
                      options={technicians.map(tech => tech.Usuario)}
                      disabled={Estado === 'CERRADO' && true}
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
                      options={["ABIERTO", "PENDIENTE", "CERRADO"]}
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

export default FormTickets