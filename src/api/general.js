import { url,isOffline, items,catchError, userOffline, registerOffline, regCommerceOffline } from "./url";

import axios from 'axios'
let prom = async (info)=>{
    let res = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(info)
        }, 1000);
    })
    return res
}

export const searchItems = async (text,categ)=>{
    if(isOffline) return await prom({status:200,data:items})

    data = {
        text: text.length > 0 ? text : false,
        categories:categ.length > 0 ? categ : false,
    }

    return await axios.post(`${url}searchItems`, data).then(res => {
        return res
    }).catch(err => {
        return catchError(err)
    })
}


export const getItem = async (id)=>{
    if(isOffline) return await prom({status:200,data:items[0]})

    return await axios.get(`${url}getItem/${id}`).then(res=>{
        return res
    }).catch(err=>{
        return catchError(err)
    })
}

export const login = async (email,password)=>{
    if(true) return await prom({status:200,data:userOffline})
    // if(isOffline) return await prom(userOffline)
    return await axios.post(`${url}login`,{email,password}).then(res=>{
        return res
    }).catch(err=>{
        return catchError(err)
    })
}

export const editUserData = async (data)=>{
    if(isOffline) return await prom({status:200})

    return await axios.post(`${url}editUserData`,data).then(res=>{
        return res
    }).catch(err=>{
        return catchError(err)
    })
}
export const toggleFavorite = async (data)=>{
    if(isOffline) return await prom({status:200})

    return await axios.post(`${url}itemFavorite`,data).then(res=>{
        return res
    }).catch(err=>{
        return catchError(err)
    })
}


export const searchFavorites = async (data)=>{
    if(isOffline) return await prom(userOffline)

    return await axios.post(`${url}searchFavorites`,data).then(res=>{
        return res
    }).catch(err=>{
        return catchError(err)
    })
}

export const register = async (data)=>{
    // if(true) return await prom({status:200,data:registerOffline})
    if(isOffline) return await prom({status:200,data:registerOffline})

    return await axios.post(`${url}register`,data).then(res=>{
        return res
    }).catch(err=>{
        return catchError(err)
    })
}
export const codeExist = async (data)=>{
    if(isOffline) return await prom({status:200,data:true})

    return await axios.post(`${url}codeExist`,data).then(res=>{
        return res
    }).catch(err=>{
        return catchError(err)
    })
}


export const registerCommerce = async (data)=>{
    if(isOffline) return await prom({status:200,data:regCommerceOffline})

    return await axios.post(`${url}registerCommerce`,data).then(res=>{
        return res
    }).catch(err=>{
        return catchError(err)
    })
}
// export const login = async (data)=>{
//     if(isOffline) return await prom(userOffline)

//     return await axios.post(`${url}login`,data).then(res=>{
//         return res
//     }).catch(err=>{
//         return catchError(err)
//     })
// }