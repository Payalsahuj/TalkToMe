import { useEffect } from "react"
import { useNavigate } from "react-router-dom"



export const Thankcompo=()=>{
    const navigate=useNavigate()
    useEffect(()=>{
        setTimeout(()=>{
            navigate("/conversation")
        },4000)
       
    },[])
    return (<div style={{height:'100vh',backgroundColor:'rgba(21,25,31,255)',display:'flex',justifyContent:'center',alignItems:'center',color:'white'}}>
        <h2>Thanks for Conversation Hope you Find it Effective</h2>

    </div>)
}