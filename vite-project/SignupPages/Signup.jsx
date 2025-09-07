import "./Login.css";
import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
export default function Signup() {
  const navigate = useNavigate()
  const [name, setName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [disabled, setDisable] = useState(true);
  useEffect(() => {
  if(name && emailId && password) {
    setDisable(false)
  } else {
    setDisable(true)
  }
  }, [name, emailId, password]);
  function userName(name) {
    setName(name)
    console.log(name)
  }
  function userEmail(email) {
    setEmailId(email)
    console.log(email)
  }
  function userPassword(password) {
    setPassword(password)
    console.log(password)
  }
  
  async function saveUser(e) {
    e.preventDefault()
    try {
      const isSaved = await fetch("http://localhost:5491/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name, 
          emailId,
          password
        })
      })
      const user = await isSaved.json()
      if(!isSaved.ok) {
        alert("User not saved")
      }
      navigate("/")
    } catch (error) {
      console.log(error.message)
    }
  }
  return (
    <div id="loginContainer">
    <form onSubmit={saveUser} >
      <label htmlFor="name">Name</label>
      <input type="text" id="name" placeholder="Enter your name" onChange={(e)=> userName(e.target.value)
      } />
      <br />
      <label htmlFor="email">Email</label>
      <input type="text" id="email" placeholder="Enter your email id" onChange={(e)=> userEmail(e.target.value) }/>
      <br />
    
      <label htmlFor="password">Password</label>
      <input type="text" id="password" placeholder="Enter your password" 
      onChange={(e)=> userPassword(e.target.value) }/>
    <br />
      <button disabled={disabled} type="submit">Submit</button>
      <span>Already have an account?</span><span>Login here</span>
    </form>
    </div>
    )
}