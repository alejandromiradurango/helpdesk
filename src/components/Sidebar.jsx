import React, { Fragment } from 'react'
import { Sidebar as SB, Menu, MenuItem, SubMenu, useProSidebar } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';
import {FaAngleRight, FaCog, FaDatabase, FaDoorClosed, FaHome, FaPen, FaTicketAlt, FaUser} from 'react-icons/fa'
import { routeServer } from '../App';
import { useStateContext } from '../contexts/ContextApp';

const Sidebar = () => {

  const { collapseSidebar, collapsed } = useProSidebar();

  const {roleCode, userName} = useStateContext();

  const colorSidebar = '#000';
  const colorText = '#FFFFFF';

  const menu = [
    {
      title: `${roleCode === 'TECNICO' ? 'Tickets' : 'Mis Tickets' }`,
      auth: ["TECNICO", "USUARIO"],
      icon: <FaTicketAlt color={colorText}/>,
      route: '/tickets',

    },
    {
      title: 'Maestras',
      auth: ["TECNICO"],
      icon: <FaDatabase color={colorText}/>,
      submenu: [
        {
          title: 'Usuarios',
          auth: ["TECNICO", "USUARIO"],
          route: '/usuarios',
        },
        {
          title: 'Categorias',
          auth: ["TECNICO", "USUARIO"],
          route: '/categorias',
        },
        {
          title: 'Subcategorias',
          auth: ["TECNICO", "USUARIO"],
          route: '/subcategorias',
        },
        {
          title: 'Tareas',
          auth: ["TECNICO", "USUARIO"],
          route: '/tareas',
        },
        {
          title: 'Asignaciones',
          auth: ["TECNICO", "USUARIO"],
          route: '/asignaciones',
        }, 
        {
          title: 'Estados',
          auth: ["TECNICO", "USUARIO"],
          route: '/canales',
        },
        {
          title: 'Tipo de solicitud',
          auth: ["TECNICO", "USUARIO"],
          route: '/tipo-de-solicitud',
        },
        {
          title: 'Prioridades',
          auth: ["TECNICO", "USUARIO"],
          route: '/prioridades',
        },
      ]
    },
    {
      title: 'Reportes',
      auth: ["TECNICO"],
      icon: <FaCog color={colorText}/>,
      route: '/reportes'
    },
    {
      title: userName,
      auth: ["TECNICO", "USUARIO"],
      icon: <FaUser color={colorText}/>,
      submenu: [
        {
          title: 'Editar perfil',
          auth: ["TECNICO", "USUARIO"],
          route: '/login',
          icon: <FaPen color={colorText} />
        },
        {
          title: 'Cerrar sesión',
          auth: ["TECNICO", "USUARIO"],
          route: '/login',
          icon: <FaDoorClosed color={colorText} />
        }
      ]
    }
  ]

  return (
    <div className='flex h-full relative'>
      <button onClick={() => collapseSidebar()} className='hidden absolute right-0 z-[4] bg-white ring ring-gray-300 rounded-full p-2 md:flex justify-center items-center translate-x-[50%] translate-y-[50%]'>
          <FaAngleRight className={`${!collapsed && 'rotate-180'} transition-all duration-300`}/>
      </button>
      <SB backgroundColor={colorSidebar} defaultCollapsed>
        <Menu menuItemStyles={{
          button: {
            [`&`]: {
              backgroundColor: colorSidebar,
              color: colorText,
            },
            [`&:hover`]: {
              backgroundColor: colorSidebar,
              filter: 'brightness(.8)'
            }
          }
        }}>
            <MenuItem component={<Link to={routeServer} />} icon={<FaHome color={colorText}/>}>
              HelpDesk
            </MenuItem>
            {menu.map((nav, index) => (
              <>
              {nav.auth.includes(roleCode) && (
                <Fragment key={index}>
                {!nav.submenu ? (
                    <MenuItem component={<Link to={routeServer+nav.route} />} icon={nav.icon}>
                      {nav.title}
                    </MenuItem>
                ) : (
                  <SubMenu label={nav.title} icon={nav.icon}>
                    {nav.submenu.map((sub, index) => (
                      <>
                        {sub.auth.includes(roleCode) && (
                          <MenuItem key={index} component={<Link to={routeServer+sub.route} />} icon={sub.icon}> {sub.title}</MenuItem>
                        )}
                      </>
                    ))}
                  </SubMenu>
                )}
                </Fragment>
              )}
              </>
            ))}
        </Menu>
      </SB>
    </div>
  )
}

export default Sidebar