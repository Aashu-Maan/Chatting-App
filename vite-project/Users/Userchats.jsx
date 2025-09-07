
/*

import "./Chat.css"
import {useParams} from "react-router-dom"
import {useState, useEffect} from "react";
//let userId = "";
import {useSelector} from "react-redux";
import {createSocketConnection} from "../Utils/Socketio.js"
export default function Userchats() {
  const userInStore = useSelector((store) => store.user)
  const loggedInUser = userInStore?.User._id
  const {id} = useParams()
  const [name, setName] = useState("")
  
async function getUser() {
  try {
    const isUser = await fetch("http://localhost:9000/chat/" + id);
    if(!isUser.ok) {
      alert("User not found")
    }
    const user = await isUser.json()
    setName(user.user.name)
    console.log("targetUser: " + id)
    console.log("user: " + loggedInUser)
    
  } catch (error) {
    console.log(error)
  }
}

useEffect(() => {
  getUser()
}, [id])

useEffect(() => {
  if(!loggedInUser) {
    return;
  }
  const socket = createSocketConnection();
  socket.emit("joinChat", {loggedInUser, id})
}, [loggedInUser, id])

  return (
    <div id="chatContainer">
      <nav id="topbar"><button id="back">Back</button><div id="content"><h1>{name}</h1><p>online</p></div>
      </nav>
      <section>
        <div id="chatSection">
          <div className="message">hello</div>
        </div>
        <div id="input">
          <input type="text" /> 
          <button id="send">send</button>
        </div>
      </section>
    </div>
    )
}

*/

import "./Chat.css"
import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { createSocketConnection } from "../Utils/Socketio.js"

export default function Userchats() {
  const userInStore = useSelector((store) => store.user)
  const loggedInUser = userInStore?.User?._id;
  const userName = userInStore?.User?.name;
  // ensure nested User object
  const { id } = useParams()
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  
  async function getUser() {
    try {
      const isUser = await fetch("http://localhost:5491/chat/" + id, {
        credentials: "include"
      })
      if (!isUser.ok) {
        alert("User not found")
        return
      }
      const user = await isUser.json()
      setName(user?.user?.name)
      setStatus(user?.user?.status)
      console.log(user?.user?.name)
      console.log("targetUser:", id)
      console.log("loggedInUser:", loggedInUser)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getUser()
  }, [id])

  useEffect(() => {
    // only connect when both values are available
    if (!loggedInUser || !id) {
      console.log("⚠️ Waiting for both loggedInUser and id before connecting")
      return
    }

    const socket = createSocketConnection()

    socket.on("connect", () => {
      
      console.log("📤 Emitting joinChat with:", { loggedInUser, id })
      socket.emit("joinChat", {firstName: userInStore?.User?.name, loggedInUser, id })
    })

    socket.on("disconnect", () => {
      console.log("❌ Disconnected")
    })

socket.on("messageReceived", ({firstName, text, loggedInUser}) => {
  
  console.log(firstName + ": " + text)
setMessage((prev) => [...prev, {text, loggedInUser}]);
})

    return () => {
      socket.disconnect()
    }
  }, [loggedInUser, id])   // runs only when both are set
const sendMessage = (message) => {
  const socket = createSocketConnection()
  socket.emit("sendMessage", {
    firstName: userName,
    loggedInUser,
    id,
    text: newMessage
  })
  setMessage((prev) => [...prev], {text: newMessage, loggedInUser })
}
  return (
    <div id="chatContainer">
      <nav id="topbar">
        <button id="back"><i className="fa-solid fa-arrow-left"></i></button>
        <div id="content">
          <p id="name">{name}</p>
          <p id="status">{status}</p>
        </div>
      </nav>
      <section>
        <div id="chatSection">
          <div className="myMessage">hello</div>
          
{message?.map((msg, index) => {
  const isSender = msg.loggedInUser === loggedInUser; // check if current user sent it
  return (
    <div 
      key={index} 
      className={`message ${isSender ? "otherMessage" : "myMessage"}`}
    >
      {msg.text}
    </div>
  )
})}
         
        </div>
        <div id="input">
          <input value={newMessage} onChange={(e)=>setNewMessage(e.target.value)} type="text" />
          <button onClick={sendMessage} id="send">send</button>
        </div>
      </section>
    </div>
  )
}



