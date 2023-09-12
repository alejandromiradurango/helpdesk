import axios from 'axios';
import utc from 'dayjs/plugin/utc'
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react'
import { FaTicketAlt } from 'react-icons/fa'
import { BsFilterRight} from 'react-icons/bs'
import { Link } from 'react-router-dom'
import { Button, Input } from "@material-tailwind/react";
import { apiUrl, config } from '../../App';
import {IoMdClose} from 'react-icons/io'
import FormSelect from '../form/FormSelect';
import { useForm } from 'react-hook-form';
import { useStateContext } from '../../contexts/ContextApp';
import TicketWindow from './TicketWindow';
import PrismaZoom from 'react-prismazoom';
import TableTicket from './TableTicket';
import LoadingTable from '../LoadingTable';
dayjs.extend(utc);

const ZoomModal = ({status, changeStatus, img}) => {

  const bodyClass = document.body.classList;

  const closeModal = () => {
    bodyClass.remove('overflow-y-hidden');
    changeStatus(!status);
  }
  // eslint-disable-next-line
  useEffect(() => bodyClass.add('overflow-y-hidden'),[])

  return (
    <div className='fixed top-0 left-0 w-screen h-screen z-[99] flex justify-center items-center'>
      <div className='bg-white/60 backdrop-blur-lg h-screen w-screen absolute top-0 left-0 z-[1]' onClick={() => closeModal()}/>
      <IoMdClose className='fixed top-0 right-0 z-[2] text-[48px] cursor-pointer' onClick={() => closeModal()}/>
      <div className='relative z-[2] bg-white shadow-2xl rounded-lg md:max-w-[95vw] md:h-[95vh] overflow-hidden animate-fadeIn'>
        <PrismaZoom allowTouchEvents={true}>
          <img src={img} alt="" className='md:max-w-[95vw] md:h-[95vh] pointer-events-none object-contain' />
        </PrismaZoom>
      </div>
    </div>
  )
}

// const Ticket = ({ticket, typeUser, getTickets, technicians = [], status, changeStatus, changeImg, changeTicket, ticketSelected}) => {

//     // Parsa las fechas utilizando el formato adecuado
//     const formato = 'YYYY-MM-DD HH:mm:ss';
//     const date1 = dayjs(ticket.FechaInicio).utc().format(formato);
//     const date2 = dayjs(new Date()).format(formato);


//     // Función para calcular las horas hábiles entre dos fechas
//     function calcularHorasHabiles(fechaInicio, fechaFin) {
//         let horasHabiles = 0;
//         let current = dayjs(fechaInicio);

//         while (current.isBefore(fechaFin)) {
//             if (current.day() >= 1 && current.day() <= 5) { // De lunes a viernes
//                 const horaActual = current.hour();
//                 if (horaActual >= 6 && horaActual < 17) {
//                     horasHabiles++;
//                 }
//             }

//             current = current.add(1, 'hour');
//         }

//         return horasHabiles;
//     }

//     const horasHabiles = calcularHorasHabiles(date1, date2);

//     let Duracion = `${horasHabiles - 1} horas`

//     if (horasHabiles === 2) Duracion = `${horasHabiles - 1} hora`

    
//     const openModal = (url) => {
//       changeImg(url)
//       changeStatus(!status)
//     }

//     return (
//         <li className={`relative bg-white my-2 pr-4 rounded-md flex flex-col md:flex-row md:items-center justify-between hover:bg-[#fdfdfd] hover:shadow-md transition-all duration-150 border-2 ${ticket?.Id === ticketSelected ? 'border-black' : 'border-gray-500'}`} onClick={() => changeTicket(ticket?.Id)}>
//           <div className="px-4 py-2 flex flex-col items-start">
//               <div className="flex flex-col px-1 lg:flex-row lg:items-center lg:gap-2 text-gray-600">
//                   <div className='flex items-center gap-2'>
//                     <FaTicketAlt />
//                     <b>#{ticket?.Id} | <span>Ticket <b>{ticket?.Estado}</b>{ticket?.Estado.includes('PENDIENTE') && ticket?.FechaInicio && Duracion && (<><b>:</b> {Duracion}</>)}</span></b>
//                   </div>
//               </div>
//               <h2 className="font-bold text-xl border-t-2 border-[#e2e2e2] md:border-t-0 w-full mt-2 pt-2 md:mt-0 md:pt-2 flex items-center gap-2">
//                 {ticket?.Titulo}
//                 {ticket?.Observacion && ticket?.Estado !== 'CERRADO' && (
//                     <Button className='p-0 text-xl bg-transparent shadow-none rounded-full text-blue-500' onClick={() => Swal.fire(`Observación - Ticket #${ticket?.Id}`, ticket?.Observacion, 'info')}>
//                       <BsQuestionCircleFill />
//                     </Button>
//                 )}      
//                 {ticket?.Url && ticket?.Estado !== 'CERRADO' && (
//                   <Menu>
//                     <MenuHandler>
//                       <Button className='p-0 text-xl bg-transparent shadow-none rounded-full text-blue-500'>
//                         <BsPaperclip />
//                       </Button>
//                     </MenuHandler>
//                     <MenuList>
//                       {ticket?.Url.split(",").map((url, index) => {
                        
//                         const type = url.split("/")[4]

//                         return (
//                         <MenuItem key={index}>
//                           {type === 'raw' ? (
//                             <a href={url} target="_blank" rel='noreferrer' className='flex items-center gap-2'>
//                             <BiFile className='text-blue-500 text-xl'/>
//                             Descargar archivo
//                             </a>
//                           ) : (
//                             <button type="button" data-url={url} className='flex items-center gap-2' onClick={() => {
//                               openModal(url);
//                             }}>
//                               <BiImage className='text-blue-500 text-xl'/> Ver imagen
//                             </button>
//                           )}
//                         </MenuItem>
//                       )})}
//                     </MenuList>
//                   </Menu>
//                 )}      
//               </h2>
//               {typeUser === 'TECNICO' && (
//                   <div className="flex items-center gap-2 opacity-50 font-bold">
//                       <FaUser />
//                       <span>{ticket?.Usuario}</span>
//                   </div>
//               )}           
//           </div>
//         </li>
//     )
// }

const Tickets = () => {

  const [tickets, setTickets] = useState([]);
  const [tableTickets, setTableTickets] = useState([]);
  const [technicians, setTechnicians] = useState([])
  const [validation, setValidation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState(undefined);
  const [modal, setModal] = useState(false);
  const [filters, setFilters] = useState(false);
  const [doingFilter, setDoingFilter] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  // const [tableSub, setTableSub] = useState([]);

  const [idSelected, setIdSelected] = useState(undefined)

  const {roleCode, user} = useStateContext();

  const {register, handleSubmit, formState: {isDirty}, reset} = useForm()

  const getTickets = () => {
    setLoading(true)
    axios.get(apiUrl+ '/tickets', config).then(res => {
      const {data} = res
      let tickets = data.tickets;
      if (roleCode === 'USUARIO'){
        setTickets(tickets.filter(ticket => ticket.Usuario === user));
        setTableTickets(tickets.filter(ticket => ticket.Usuario === user));
      } else {
        setTickets(tickets.filter(ticket => ticket.Estado !== 'CERRADO'));
        setTableTickets(tickets.filter(ticket => ticket.Estado !== 'CERRADO'));
      }
      setLoading(false);
    })
  }

  useEffect(() => {
    getTickets();

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
        // setTableSub(data.subcategories)
      })
    // eslint-disable-next-line
  }, [])

  const searchTickets = (term) => {
    // eslint-disable-next-line
    const results = tableTickets.filter((ticket) => {
      if (
        ticket.Id.toString().toLowerCase().includes(term.toLowerCase()) ||
        ticket.Usuario.toString().toLowerCase().includes(term.toLowerCase()) ||
        ticket.Tecnico.toString().toLowerCase().includes(term.toLowerCase()) ||
        ticket.Titulo.toString().toLowerCase().includes(term.toLowerCase()) ||
        ticket.Estado.toString().toLowerCase().includes(term.toLowerCase())
      ) {
        return ticket;
      }
    });
  
    setTickets(results);
    if (results.length === 0) {
      setValidation(true);
    } else {
      setValidation(false);
    }
  }

  let techs = {};
  technicians.filter(tech => tech.Usuario !== 'SoporteGeneral').map(tech => {
    techs[tech.Usuario] = tech.Usuario;
    return null;
  })

  const selectInput = [
      {
          field: 'Tecnico',
          options: technicians && technicians.map(tech => tech.Usuario)
      },
      {
          field: 'Estado',
          options: ["ABIERTO", "PENDIENTE", "PENDIENTE POR USUARIO", "PENDIENTE POR PROOVEDOR", "CERRADO"]
      },
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
      }
  ]

  const inputStyle = 'transition-all duration-200 rounded-md border p-2 m-auto w-full md:w-[20em] focus:outline-2 text-sm bg-white border-blue-gray-200 focus:border-blue-500 text-blue-gray-700 disabled:bg-blue-gray-50 disabled:border-0 disabled:appearance-none'

  const doFilter = data => {
    setDoingFilter(true);
    data.FechaC = [];
    setTickets([]);

    const camposVacios = Object.values(data).every(valor => (
      (Array.isArray(valor) && valor.length === 0) || (typeof valor === 'string' && valor === "")
    ));

    if (camposVacios) {
      // Ejecutar función cuando todos los campos están vacíos
      getTickets();
    } else {
      // Ejecutar función cuando al menos un campo no está vacío
      axios.post(`${apiUrl}/generate-report`, data, config)
        .then(res => {
                const {data} = res;
                setTickets(data.tickets);
                setFilters(false);
                setDoingFilter(false);
        })
    }
    
  }

  const handleIdSelected = id => {
    setIdSelected(id);
  }

  return (
    <div className='py-4 px-8 relative overflow-hidden'>
      <div className="flex flex-wrap justify-between items-center w-full border-b-2 border-gray-500 sticky top-0 z-2 pb-3 md:pb-4">
        <h1 className="font-bold text-2xl sm:text-3xl flex gap-3 items-center"> {roleCode === 'TECNICO' ? 'Tickets' : 'Mis tickets'} <FaTicketAlt /></h1>
        <div className="flex items-center gap-4">
          {roleCode === "TECNICO" && (
            <Button variant='gradient' color="blue-gray" size='lg' className='p-0 flex items-center px-3' onClick={() => setFilters(prev => !prev)}>
              <span className="p-2 text-white flex items-center gap-2 font-bold text">Filtrar</span> 
              <BsFilterRight className='scale-150' />
            </Button>
          )}
          <div className='hidden sm:block'>
            <Input
              label='Buscar ticket'
              onChange={(e) => searchTickets(e.target.value)}
              className="w-64"
            />
          </div>
          <Button variant='gradient' color="green" size='lg' className='p-0 flex items-center'>
            <Link to="crear" className="p-2 text-white flex items-center gap-2 font-bold text">Crear</Link> 
          </Button>
        </div>
        <div className='block sm:hidden w-full mb-2'>
          <Input
            label='Buscar ticket'
            onChange={(e) => searchTickets(e.target.value)}
            className=""
          />
        </div>
      </div>
      {loading && <LoadingTable/>}
      {validation && <h1 className='text-center font-bold text-3xl mt-4'>Sin resultados</h1>}
      {!loading && !validation && tickets && tickets.length === 0 && <h1 className='mt-8 font-bold text-center text-3xl'>No se han encontrado tickets</h1>}
      {!loading && (
        <div className="flex">
          <TableTicket tickets={tickets} changeId={handleIdSelected} id={idSelected}/>
          <div className={`${idSelected ? 'w-full lg:w-3/5' : 'w-0'} transition-all duration-300 overflow-y-auto h-[83.5vh] 3xl:h-[88vh] relative`}>
            <TicketWindow id={idSelected} changeTicket={handleIdSelected} technicians={technicians} getTickets={getTickets} status={modal} changeStatus={setModal} changeImg={setImg}/>
          </div>
        </div>
      )}
      {modal && <ZoomModal status={modal} changeStatus={setModal} img={img}/>}
      {roleCode === "TECNICO" && (
        <>
        <div className={`absolute w-full h-full top-0 ${filters ? 'left-0 rounded-l-none scale-100' : 'left-[100%] rounded-l-full scale-50'} bg-black/25 transition-all duration-200 backdrop-blur-sm`} onClick={() => setFilters(prev => !prev)}/>
        <aside className={`min-w-[100%] md:min-w-[25em] border-l-2 border-gray-400 absolute top-0 ${filters ? 'right-0' : '-right-[100%]'} transition-all duration-200  h-screen md:h-full bg-white shadow-2xl z-2 flex flex-col justify-center items-center`}>
          <IoMdClose className='absolute top-10 right-10 scale-150 cursor-pointer' onClick={() => setFilters(prev => !prev)} />
          <h2 className='font-bold text-xl '>Filtrar tickets</h2>
          <form className='flex flex-col gap-2 items-center justify-center min-w-[80%]' onSubmit={handleSubmit(doFilter)}>
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
            <div className="flex justify-center gap-2 items-center">
              {isDirty && (
                <Button color='red' variant='gradient' size='lg' onClick={() => reset()} className="animate-fade-in">
                    Limpiar
                </Button>
              )}
              <Button type='submit' variant='gradient' size='lg' color='blue' className='disabled:cursor-wait' disabled={doingFilter}>
                {doingFilter ? 'Filtrando...' : 'Filtrar'}
              </Button>
            </div>
          </form>
        </aside>
        </>
      )}
    </div>
  )
}

export default Tickets