import axios from "axios";
import { apiRequest } from "./api";

export const getCurrentUser = async () => {
 console.log("fetching user");
 
      const res =  await axios.get("http://localhost:8000/api/me");
      return res.data
    
    
    
    };