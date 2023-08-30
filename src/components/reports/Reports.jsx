import { Button } from '@material-tailwind/react';
import axios from 'axios';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { FaAngleLeft, FaRegCheckCircle, FaRegClock, FaSpinner, FaTicketAlt, FaUser } from 'react-icons/fa'
import { TbReportAnalytics } from 'react-icons/tb'
import { Link, useNavigate } from 'react-router-dom'
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

const Ticket =({ticket}) => (
    <li className="relative bg-gray-100 my-2 pr-4 rounded-md flex flex-col md:flex-row md:items-center justify-between hover:shadow-md transition-all duration-150 py-2 border-2 border-[#999999]">
          <div className="px-4 py-2 flex flex-col items-start">
              <div className="flex flex-col px-1 lg:flex-row lg:items-center lg:gap-2 text-gray-600">
                  <div className='flex items-center gap-2'>
                    <FaTicketAlt />
                    <b>#{ticket.Id} | {ticket.Tipo}</b>
                  </div>
                  <div className="font-bold flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                      <div className="flex items-center gap-2">
                        <FaRegClock title="Fecha de creación"/>
                        <span title="Fecha de creación"><span className='block md:hidden'>Creación: </span>{dayjs(ticket.FechaC).utc().format('DD/MM/YYYY h:mm A')}</span>
                      </div>
                      {ticket.FechaF && (
                      <>
                          <span className='hidden md:block'> - </span>
                          <div className='flex items-center gap-2'>
                            <FaRegCheckCircle title="Fecha de cierre"/>
                            <span title="Fecha de cierre"><span className='block md:hidden'>Cierre: </span>{dayjs(ticket.FechaF).utc().format('DD/MM/YYYY h:mm A')}</span> 
                          </div>     
                      </>
                      )}            
                  </div>
              </div>
              <h2 className="font-bold text-xl border-t-2 border-[#e2e2e2] md:border-t-0 w-full mt-2 pt-2 md:mt-0 md:pt-2 flex items-center gap-2">
                {ticket.Titulo}
              </h2>
              <div className="flex items-center gap-2 opacity-50 font-bold">
                  <FaUser />
                  <span>{ticket.Usuario}</span>
              </div>
          </div>
          <div className="flex flex-col items-start justify-start gap-2 lg:flex-row lg:items-center lg:gap-8 px-4">
            <div className="flex flex-col">
                <span>Estado: <b>{ticket.Estado}</b></span>
                <span>Tecnico: <b>{ticket.Tecnico}</b></span>
                <span>Categoria: <b>{ticket.Categoria}</b></span>
                <span>Subcategoria: <b>{ticket.Subcategoria}</b></span>
            </div>
          </div>
        </li>
) 

const Reports = () => {

  const { register, handleSubmit, watch, reset, formState: {isDirty} } = useForm();

  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [tableSub, setTableSub] = useState([]);
  const [technicians, setTechnicians] = useState([])
  const [loading, setLoading] = useState(false)
  const [downloaded, setDownloaded] = useState(false)
  const [tickets, setTickets] = useState(undefined)

  const navigate = useNavigate()

  useEffect(() => {
    if (localStorage.getItem('typeUser') !== 'TECNICO'){
        navigate(routeServer)
    }

    setLoading(true)
    axios.get(`${apiUrl}/users`, config)
    .then(res => {
         const {data} = res;
         setTechnicians(data.users.filter(user => user.Tipo === 'TECNICO'));
    })

    axios.get(`${apiUrl}/helpers`, config)
     .then(res => {
        const {data} = res;
        setCategories(data.categories)
        setSubcategories(data.subcategories)
        setTableSub(data.subcategories)
      })
    setLoading(false)
    // eslint-disable-next-line
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
            options: technicians && technicians.map(tech => tech.Usuario)
        }
  ]

  const {Categoria} = watch()

  useEffect(() => {
    const results = tableSub?.filter((sub) => sub.Categoria.includes(Categoria));
    setSubcategories(results);
  }, [Categoria, tableSub]);

  const generateReport = (data) => {
    setLoading(true)
    setTickets(undefined)
    data.FechaC = [];
    if (data.Desde !== '') data.FechaC.push(dayjs(data.Desde).format("YYYYMMDD")); 
    if (data.Hasta !== '') data.FechaC.push(dayjs(data.Hasta).format("YYYYMMDD")) ;
    
    setTimeout(() => {
        axios.post(`${apiUrl}/generate-report`, data, config)
            .then(res => {
                    const {data} = res;
                    setTickets(data.tickets)
                    setLoading(false)
                    setDownloaded(false)
                    setTimeout(() => {
                        window.scrollBy({
                            top: 1000,
                            behavior: "smooth"
                        })
                    }, 250)
                })
    }, 500);
  }

  const inputStyle = 'transition-all duration-200 rounded-md border p-2 m-auto w-full md:w-[10em] focus:outline-2 text-sm bg-white border-blue-gray-200 focus:border-blue-500 text-blue-gray-700 disabled:bg-blue-gray-50 disabled:border-0 disabled:appearance-none'

  const downloadReport = json => {
    var ws = XLSX.utils.json_to_sheet(json);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
    XLSX.writeFile(wb, `reporte-${uniqid()}.xlsx`);
    setDownloaded(true);
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
                {isDirty && (
                    <Button color='red' onClick={() => reset()} className="animate-fade-in">
                        Limpiar
                    </Button>
                )}
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
        {loading && <div className='text-center font-bold mt-40 text-[3em] grid'><FaSpinner className='animate-spin m-auto block'/></div>}
        {tickets && (
            <div className='rounded-md bg-white shadow-md p-4 my-2'>
                <div className='flex justify-between items-center mb-3'>
                    <h1 className='font-bold text-2xl uppercase'>Tickets <small className='opacity-50 text-sm'>({tickets.length} tickets)</small></h1>
                    <Button color='gray' onClick={() => downloadReport(tickets)} disabled={tickets.length === 0 || downloaded}>
                        {!downloaded ? 'Exportar' : 'Descargado'}
                    </Button>
                </div>
                <ul className={`${tickets.length > 0 && 'h-[80vh] overflow-auto'}`}>
                    {tickets.map(ticket => (
                        <Ticket key={ticket.Id} ticket={ticket}/>
                    ))}
                </ul>  
                {tickets.length === 0 && <div className="font-bold text-center text-2xl uppercase">Sin resultados</div>}     
            </div>
        )}
      </div>
    </div>
  )
}

export default Reports