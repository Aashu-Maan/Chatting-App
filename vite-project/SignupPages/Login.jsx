/*import "./Login.css";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {getId} from "../Users/Userchats.jsx"
export default function Login() {
  const [emailId, setEmailId] = useState("")
  const [password, setPassword] = useState("")
  
  const navigate = useNavigate()
  async function loggedIn() {
    const isUser = await fetch("http://localhost:9000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        emailId,
        password
      })
    })
    const data = await isUser.json()
    const id = data.User._id
    if(!isUser.ok) {
      alert(data.message || "wrong crendentials")
    } 
    getId(id)
    navigate("/"+id)
  }
  return (
    <div id="loginContainer">
    <form  onSubmit={(e)=> {e.preventDefault();
    loggedIn()}}>
      
      <label htmlFor="email">Email</label>
      <input type="text" id="email" placeholder="Enter your email id"
      onChange={(e)=> {
        setEmailId(e.target.value)
        console.log(emailId)
      }} />
      <br />
    
      <label htmlFor="password">Password</label>
      <input type="text" id="password" placeholder="Enter your password" 
      onChange={(e)=> {
        setPassword(e.target.value)
        console.log(password)
      }}/>
    <br />
      <button type="submit">Login</button>
      <span>Do not have an account?</span><span>Signup here</span>
    </form>
    </div>
    )
}

*/
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
// make sure getId is actually exported from Userchats.jsx
//import { getId } from "../Users/Userchats.jsx";
import {useDispatch} from "react-redux"
import {addUser} from "../Utils/Store.js"
import {createSocketConnection} from "../Utils/Socketio.js"
export default function Login() {
  const socket = createSocketConnection();
  const dispatch = useDispatch()
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  
  const navigate = useNavigate();

  async function loggedIn() {
    const res = await fetch("http://localhost:5491/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ emailId, password })
    });

    const data = await res.json();

    if (!data.User) {
      alert(data.message || "Wrong credentials");
      return;
      
    }
    dispatch(addUser(data))
    const id = data.User._id;
    console.log(data.User.name + " logged in")
    socket.emit("user-online", data)
    //getId(id)
     // make sure this is exported correctly
    navigate("/users");
    
  }

  return (
    <div id="loginContainer">
      <form onSubmit={(e) => { e.preventDefault(); loggedIn(); }}>
        
        <label htmlFor="email">Email</label>
        <input
          type="text"
          id="email"
          placeholder="Enter your email id"
          onChange={(e) => setEmailId(e.target.value)}
        />
        <br />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Enter your password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />

        <button type="submit">Login</button>
        <span>Do not have an account?</span><span> Signup here</span>
      </form>
    </div>
  );
}

