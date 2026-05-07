import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from './pages/login/Login'
import Header from './components/header/Header'
import PrivateRoute from "./PrivateRoute";
import Dashboard from "./pages/dashboard/Dashboard";
import PontoAjuste from "./pages/pontoAjuste/pontoAjuste";

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/ponto-ajuste" element={
          <PrivateRoute>
            <PontoAjuste />
          </PrivateRoute>
        } />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  )
}

export default App
