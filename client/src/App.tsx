import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom"
import { getToken } from "./Utils/auth";
import Register from "./Components/Register";
import Login from "./Components/Login";
import AddRestaurant from "./Components/AddRestaurant";
import DispRestaurant from "./Components/DispRestaurant";
import Navbar from "./Components/Navbar";
import AddMenu from "./Components/AddMenu";
import DisplayMenu from "./Components/DispMenu";
import EditRestaurant from "./Components/EditRestaurant";
import EditMenu from "./Components/EditMenu";



function App() {
  const navigate=useNavigate();
  useEffect(()=>{
    const token=getToken();
    if(!token){
      navigate('/');
    }
  },[])

  return (
    <>
       <Routes>
        <Route>
          
          <Route path='/register' element={<Register/>}></Route>
          <Route path='/' element={<Login/>}></Route>
           <Route path='/addRestaurant' element={<AddRestaurant/>}></Route>
            <Route path='/dispRestaurant' element={<DispRestaurant/>}></Route>
            <Route path="/editRestaurant/:id" element={<EditRestaurant />} />

             <Route path='/addMenu/:restaurantId' element={<AddMenu/>}></Route>
             <Route path='/dispMenu/:restaurantId' element={<DisplayMenu/>}></Route>
             <Route path="/editMenu/:menuId/:restaurantId" element={<EditMenu />} />


             <Route path='/navbar' element={<Navbar/>}></Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
