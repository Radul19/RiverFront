import { url,catchError } from "./url";
import axios from "axios";

export const login = async (email: string, password: string) => {
  // if(true) return await prom({status:200,data:userOffline})
  // if(isOffline) return await prom({status:200,data:userOffline})
  return await axios
    .post(`${url}login`, { email, password })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return catchError(err);
    });
};


export const register = async (data:any)=>{
    // if(true) return await prom({status:200,data:registerOffline})

    return await axios.post(`${url}register`,data).then(res=>{
        return res
    }).catch(err=>{
        return catchError(err)
    })
}


export const searchItems = async (text:string,categ:string[],commerce?:string)=>{
    // if(isOffline) return await prom({status:200,data:items})

    let data = {
        text: text.length > 0 ? text : false,
        categories:categ?.length > 0 ? categ : false,
        commerce
    }
    return await axios.post(`${url}searchItems`, data).then(res => {
        return res
    }).catch(err => {
        return catchError(err)
    })
}


export const getItem = async (id:any)=>{
    // if(isOffline) return await prom({status:200,data:items[0]})

    return await axios.get(`${url}getItem/${id}`).then(res=>{
        return res
    }).catch(err=>{
        return catchError(err)
    })
}
export const getMarket = async (id:any)=>{
    // if(isOffline) return await prom({status:200,data:items[0]})

    return await axios.get(`${url}getMarket/${id}`).then(res=>{
        return res
    }).catch(err=>{
        return catchError(err)
    })
}
