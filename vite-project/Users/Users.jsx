


/*
export default function Users() {
  return (
    <div>
      <nav><h1>Users</h1></nav>
      <div id="userContainer">
      <ul id="userList">
      <li>
   <span><div className="icon"></div>
   <span className="content"><p className="userName">Arshdeep singh</p>
 <p className="status">active</p></span></span> <button>Chat</button></li>
      </ul>
      </div>
    </div>
    )
  
}
*/
/*
export default function Users() {
  const [users, setUsers] = useState();
async function getUsers() {
  try {
  const isUsers = await fetch("http://localhost:9000/users")
  const data = await isUsers.json()
  if(data.length === 0) {
    throw new Error ("no user here")
  }
  setUsers(data.users)
  } catch (error) {
    console.log(error.message)
  }
}

useEffect(() => {
  getUsers()
}, [])
  return (
    <div>
      <nav>
        <h1>Users</h1>
      </nav>
      <div id="userContainer">
        <ul id="userList">
          <li>
            <div className="icon"></div>
            <div className="content">
              <p className="userName">Arshdeep Singh</p>
              <p className="status">active</p>
            </div>
            <button className="chat">Chat</button>
          </li>
          {
            users?.map((user) => {
              return (
              <h1>{user.name}</h1>
              )
            })
          }
          
        </ul>
      </div>
    </div>
  );
}
*/
/*
import "./Users.css"
import { useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import { useSelector } from "react-redux"
import {createSocketConnection} from "../Utils/Socketio.js";
export default function Users() {
  const socket = createSocketConnection()
  const [users, setUsers] = useState([]);
  const loggedInUser = useSelector((store) => store?.user?.User)
  console.log(loggedInUser?.name)
  const [isActive, setIsActive] = useState(false)
const navigate = useNavigate()
  async function getUsers() {
    try {
      const res = await fetch("http://localhost:5491/", {
        credentials: "include"
      });
      const data = await res.json();

      if (!data.users || data.users.length === 0) {
        throw new Error("No user here");
    
      }

      setUsers(data.users); // ✅ save users into state
      
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    getUsers();
     
     socket.on("update-status", ({userName, status}) => {
      console.log(userName + ": " + status)
      setUsers((prev) => prev.map((user) => user.name === userName ? {...user, status} : user)) 
      }) 
     
  }, []);
 
 function getUserId(id) {
  navigate("/chat/" + id)
}
async function logOut() {
  try {
    const loggedOut = await fetch("http://localhost:5491/logout", {
      method: "POST",
      credentials: "include"
    })
    if(!loggedOut.ok) {
      alert("logout failed")
    }
    
    alert("logout sucessfull")
    socket.emit("user-logout", loggedInUser)
    console.log(loggedOut.name + " logged out")
    navigate("/login")
  } catch (error) {
    console.log(error.message)
  }
}

function changeValue() {
  setIsActive(!isActive)
}


  return (
    <div>
      <div className={isActive ? "menu showmenu" : "menu" }><button onClick={() => logOut()}>logout</button></div>
      <nav>
        <h1>Users</h1>
       <div className="right"> <p>{loggedInUser?.name}</p> <button onClick={() => changeValue()}><i className="fa-solid fa-bars"></i></button>
       </div>
      </nav>
      <div id="userContainer">
        <ul id="userList">
          {users?.map((user, index) => 
          { 
          
          return (
            <li key={index}>
              <div className="icon"></div>
              <div className="content">
                <p className="userName">{user?.name}</p>
                <p className="status" style={{color: user.status === "online" ? "green" : "darkgrey"}}>{user.status}</p>
              </div>
              <button onClick={()=> getUserId(user._id)} className="chat">Chat</button>
            </li>
          )
            
          })}
        </ul>
      </div>
    </div>
  );
}
*/


import "./Users.css"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { createSocketConnection } from "../Utils/Socketio.js";

export default function Users() {
  const socket = createSocketConnection();
  const [users, setUsers] = useState([]);
  const loggedInUser = useSelector((store) => store?.user?.User);
  console.log(loggedInUser?.name);
  const [accountUser, setAccountUser] = useState()
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true)
  
  const navigate = useNavigate();

  async function getUsers() {
    
    try {
      
      const res = await fetch("http://localhost:5491/users", {
        credentials: "include"
      });
      if(!res.ok) {
       return navigate("/login")
      }
      const data = await res.json();

      if (!data.users || data.users.length === 0) {
        throw new Error("No user here");
      } 

      setUsers(data.users);
      setAccountUser(data.accountUser)
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getUsers();

    // 👇 Re-register user as online when page refreshes
    socket.on("update-online", ({ userId, status }) => {
  setUsers(prev =>
    prev.map(user =>
      user._id.toString() === userId.toString()
        ? { ...user, status } // spread all user properties and update status
        : user
    )
  );
});
socket.on("update-offline", ({ userId, statusOffline }) => {
  setUsers(prev =>
    prev.map(user =>
      user._id.toString() === userId.toString()
        ? { ...user, status: statusOffline} // spread all user properties and update status
        : user
    )
  );
});
  }, [loggedInUser]);

  function getUserId(id) {
    navigate("/chat/" + id);
  }

  async function logOut() {
    try {
      const loggedOut = await fetch("http://localhost:5491/logout", {
        method: "POST",
        credentials: "include"
      });
      if (!loggedOut.ok) {
        alert("logout failed");
      }

      alert("logout successful");
    
      console.log(loggedInUser?.name + " logged out");
      socket.emit("user-logout", accountUser)
      navigate("/login");
    } catch (error) {
      console.log(error.message);
    }
  }

  function changeValue() {
    setIsActive(!isActive);
  }

  return (
    <div>
      <div className={isActive ? "menu showmenu" : "menu"}>
        <button onClick={logOut}>logout</button>
      </div>
      <nav>
        <h1>Users</h1>
        <div className="right">
          <p>{accountUser?.name}</p>
          <button onClick={changeValue}>
            <i className="fa-solid fa-bars"></i>
          </button>
        </div>
      </nav>
      <div id="userContainer">
        <ul id="userList"> {
           loading ?
             (<p id="loading">Loading users....</p>)
           :
           users && users?.map((user, index) => {
          
            return (
              <li key={index}>
                <div className="icon"></div>
                <div className="content">
                  <p className="userName">{user?.name}</p>
                  <p
                    className="status"
                    style={{
                      color: user.status === "online" ? "green" : "darkgrey"
                    }}
                  >
                    {user.status}
                  </p>
                </div>
                <button onClick={() => getUserId(user._id)} className="chat">
                  Chat
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}