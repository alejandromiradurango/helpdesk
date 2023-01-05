import { Button } from '@material-tailwind/react';
import axios from 'axios';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { FaAngleLeft } from 'react-icons/fa'
import { TbReportAnalytics } from 'react-icons/tb'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2';
import { apiUrl, config, routeServer } from '../../App';
import FormSelect from '../form/FormSelect';
import * as XLSX from 'xlsx';
import uniqid from 'uniqid';

const InputDate = ({register, field, styles}) => (
    <div className='flex justify-between items-center gap-[3em] my-[1em] mx-auto w-auto'>
        <div className='relative w-full md:w-auto'>
            <span className='absolute -top-2 bg-white px-1 text-xs left-[.7rem] pointer-events-none text-[#757e83]'>{field}</span>
            <input 
                type="date"
                className={styles}
                {...register(field)}
            />
        </div>
    </div>
)

const Reports = () => {

  const { register, handleSubmit, watch } = useForm();

  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [tableSub, setTableSub] = useState([])
  const [loading, setLoading] = useState(true)
  const [tickets, setTickets] = useState(undefined)

  useEffect(() => {
    setLoading(true)
    axios.get(`${apiUrl}/helpers`, config)
     .then(res => {
        const {data} = res;
        setCategories(data.categories)
        setSubcategories(data.subcategories)
        setTableSub(data.subcategories)
      })
    setLoading(false)
  }, [])

  const selectInput = [
        {
            field: 'Tipo',
            options: ["INCIDENCIA", "SOLICITUD"]
        },
        {
            field:"Categoria",
            options:categories && categories.map(cat => cat.Categoria)
        },
        {
            field:"Subcategoria",
            options:subcategories && subcategories.map(sub => sub.SubCategoria)
        },
        {
            field: 'Prioridad',
            options: ["BAJA", "MEDIA", "ALTA"]
        },
        {
            field: 'Estado',
            options: ["ABIERTO", "PENDIENTE", "CERRADO"]
        },
        {
            field: 'Tecnico',
            options: ["AlexanderAlvarez", "DanielZora", "HernanRendon"]
        }
  ]

  const {Categoria} = watch()

  useEffect(() => {
    const results = tableSub?.filter((sub) => sub.Categoria.includes(Categoria));
    setSubcategories(results);
  }, [Categoria, tableSub]);

  const generateReport = (data) => {
    data.FechaC = [];
    if (data.Desde !== '') data.FechaC.push(dayjs(data.Desde).format("YYYYMMDD")); 
    if (data.Hasta !== '') data.FechaC.push(dayjs(data.Hasta).format("YYYYMMDD")) ;
    axios.post(`${apiUrl}/generate-report`, data, config)
     .then(res => {
            const {data} = res;
            Swal.fire(data.message, '', data.type)
            setTickets(data.tickets)
        })
  }

  const inputStyle = 'transition-all duration-200 rounded-md border p-2 m-auto w-full md:w-[10em] focus:outline-2 text-sm bg-white border-blue-gray-200 focus:border-blue-500 text-blue-gray-700 disabled:bg-blue-gray-50 disabled:border-0 disabled:appearance-none'

  const downloadReport = json => {
    var ws = XLSX.utils.json_to_sheet(json);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
    XLSX.writeFile(wb, `reporte-${uniqid()}.xlsx`);
  }
  

  return (
    <div className='px-3'>
      <div className="flex flex-wrap justify-between items-center w-full border-b-2 border-gray-500 bg-gray-200">
        <h1 className="font-bold text-2xl sm:text-3xl py-3 md:py-4 flex gap-3 items-center"><Link to={routeServer}><FaAngleLeft className='text-gray-700 hover:scale-125 transition-all duration-200' title="Volver"/></Link> Reportes <TbReportAnalytics /></h1>
      </div>
      <div>
        <form onSubmit={handleSubmit(generateReport)} className='rounded-md bg-white shadow-md p-4 my-2'>
            <div className='flex justify-between items-center'>
                <h1 className='font-bold text-2xl uppercase'>Filtros</h1>
                <Button type='submit' color='green'>
                    Generar
                </Button>
            </div>
            {!loading && (
                 <div className='flex items-center flex-wrap'>
                    {selectInput.map((select) => (
                        <FormSelect
                        key={select.field}
                        field={select.field}
                        options={select.options}
                        register={register}
                        label={false}
                        className={inputStyle}
                        />
                    ))}
                    <InputDate 
                        register={register}
                        styles={inputStyle}
                        field="Desde"
                    />
                    <InputDate 
                        register={register}
                        styles={inputStyle}
                        field="Hasta"
                    />
                </div>
            )}
        </form>
        {tickets && (
            <div className='rounded-md bg-white shadow-md p-4 my-2'>
                <div className='flex justify-between items-center'>
                    <h1 className='font-bold text-2xl uppercase'>Tickets <small className='opacity-50 text-sm'>({tickets.length} tickets)</small></h1>
                    <Button color='gray' onClick={() => downloadReport(tickets)}>
                        Exportar
                    </Button>
                </div>
                <ul className=''>
                    {tickets.map(ticket => (
                        <li>{ticket.Titulo}</li>
                    ))}
                </ul>           
            </div>
        )}
      </div>
    </div>
  )
}

export default Reports