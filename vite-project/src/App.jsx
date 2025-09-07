import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
//import './App.css'
import Login from "../SignupPages/Login.jsx";
import Signup from "../SignupPages/Signup.jsx";
 import Users from "../Users/Users.jsx"
import Userchats from "../Users/Userchats.jsx";
import {Routes, Route} from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/chat/:id" element={<Userchats />} />
        <Route path="/:id" element={<Users />} />
      </Routes>
    </>
    )
}

export default App
