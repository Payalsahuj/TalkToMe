import { Route, Routes } from "react-router-dom"
import { Welcome } from "./Welcome"
import Conversation from "./Conversation"
import { Thankcompo } from "./Thank"


export const Routercompo=()=>{
    return <Routes>
        <Route path="/" element={<Welcome/>}/>
        <Route path="/conversation" element={<Conversation/>}/>    
        <Route path="/thank" element={<Thankcompo/>}/>    

    </Routes>
}