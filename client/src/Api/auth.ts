import axios from "axios";

const API_URL="http://localhost:3000";

export const registerUser=(name:string,email:string,password:string,role:string,phone:string)=>{
    return axios.post(`${API_URL}/register`,{name,email,password,role,phone});
}

export const loginUser=(email:string,password:string)=>{
    return axios.post(`${API_URL}/login`,{email,password})
}   

