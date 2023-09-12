import React from 'react'
import { BrowserRouter, Routes, Route} from "react-router-dom";
import { Layout, Navigation, Users, Login, FormUsers, FormTickets, Tickets, Reports } from './components/index';
import dayjs from "dayjs";
import { es } from "dayjs/locale/es";

dayjs.locale("es");

// export const apiUrl = 'http://13.92.232.100:81/HelpDesk/api'
export const apiUrl = 'http://172.25.1.70:3001/HelpDesk/api'
export const routeServer = "/HelpDeskRG" // Production
export const config = {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}}
// export const routeServer = "" // Development

const App = () => {

  return (
    <div className=" h-screen overflow-x-hidden">
      <BrowserRouter>
        <Routes>
          <Route exact path={routeServer} element={<Layout />}>
            <Route index element={<Navigation />}></Route>
            <Route exact path={routeServer+"/usuarios"} element={<Users/>}></Route>
            <Route exact path={routeServer+"/usuarios/crear"} element={<FormUsers/>}></Route>
            <Route exact path={routeServer+"/usuarios/editar/:id"} element={<FormUsers/>}></Route>
            <Route exact path={routeServer+"/tickets"} element={<Tickets/>}></Route>
            <Route exact path={routeServer+"/tickets/crear"} element={<FormTickets/>}></Route>
            <Route exact path={routeServer+"/tickets/editar/:id"} element={<FormTickets/>}></Route>
            <Route exact path={routeServer+"/reportes"} element={<Reports/>}></Route>
            <Route exact path={routeServer+"/areas"} element={<h1>Areas</h1>}></Route>
          </Route>
          <Route path={routeServer + "/login"}>
            <Route index element={<Login />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App