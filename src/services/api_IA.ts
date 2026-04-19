import axios from "axios";

export const api_IA =  axios.create({
  baseURL: 'https://api.clarifai.com',
  headers:{
    
    "Authorization":"Key 09608932a79740a28ebda4d8297ab020"    
  }
})