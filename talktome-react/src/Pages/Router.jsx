import { Route, Routes } from "react-router-dom"
import { Welcome } from "./Welcome"
import Conversation from "./Conversation"


export const Routercompo=()=>{
    return <Routes>
        <Route path="/" element={<Welcome/>}/>
        <Route path="/conversation" element={<Conversation/>}/>

        
    </Routes>
}