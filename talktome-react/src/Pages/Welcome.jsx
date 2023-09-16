import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export const Welcome=()=>{
    const navigate=useNavigate()
    useEffect(()=>{
        setTimeout(()=>{
            navigate("/conversation")
        },4000)
       
    },[])
    return (<div style={{height:'100vh'}}>
    <div style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center',backgroundColor:'black',width:'100%',height:'100%'}}>
  
      <img src='https://media2.giphy.com/media/jUJtNKKVTdIeD0XreN/giphy.gif?cid=790b7611242031e216d1fa871e586bcb2bbd0e3e2e14b8fd&rid=giphy.gif&ct=s' alt=''/>
   
    </div>
    
    </div>)
}