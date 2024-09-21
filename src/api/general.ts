import { ItemType } from "../types/item";
import { url,isOffline, items,catchError, userOffline, registerOffline, regCommerceOffline } from "./url";
import axios from 'axios'

let prom = async (info:{status:number,data?:any})=>{
    let res = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(info)
        }, 1000);
    })
    return await res
}

type ItemUploadT = Omit<ItemType,"favorites" | 'reviews' | 'createdAt' | 'updatedAt'|'_id'> &{
    _id?:string
}


export const editUserData = async (data:any)=>{
    // if(isOffline) return await prom({status:200})

    return await axios.post(`${url}editUserData`,data).then(res=>{
        return res
    }).catch(err=>{
        return catchError(err)
    })
}
export const toggleFavorite = async (data:any)=>{
    // if(isOffline) return await prom({status:200})
    return await axios.post(`${url}itemFavorite`,data).then(res=>{
        return res
    }).catch(err=>{
        return catchError(err)
    })
}
export const toggleMarketFavorite = async (data:any)=>{
    // if(isOffline) return await prom({status:200})
    return await axios.post(`${url}marketFavorite`,data).then(res=>{
        return res
    }).catch(err=>{
        return catchError(err)
    })
}


export const searchFavorites = async (data:any)=>{
    // if(isOffline) return await prom({status:200,data:userOffline})

    return await axios.post(`${url}searchFavorites`,data).then(res=>{
        return res
    }).catch(err=>{
        return catchError(err)
    })
}

export const register = async (data:any)=>{
    // if(true) return await prom({status:200,data:registerOffline})
    // if(isOffline) return await prom({status:200,data:registerOffline})

    return await axios.post(`${url}register`,data).then(res=>{
        return res
    }).catch(err=>{
        return catchError(err)
    })
}
export const codeExist = async (data:any)=>{
    // if(isOffline) return await prom({status:200,data:true})

    return await axios.post(`${url}existCode`,{code:data}).then(res=>{
        return res
    }).catch(err=>{
        return catchError(err)
    })
}


export const registerCommerce = async (data:any)=>{
    // if(isOffline) return await prom({status:200,data:regCommerceOffline})

    return await axios.post(`${url}registerCommerce`,data).then(res=>{
        return res
    }).catch(err=>{
        return catchError(err)
    })
}

export const createItem = async (data:ItemUploadT)=>{
    return await axios.post(`${url}createItem`,data).then(res=>{
        return res
    }).catch(err=>{
        return catchError(err)
    })
}
export const updateItem = async (data:ItemUploadT)=>{
    return await axios.post(`${url}updateItem`,data).then(res=>{
        return res
    }).catch(err=>{
        return catchError(err)
    })
}
export const deleteItem = async (item_list:string[])=>{
    return await axios.post(`${url}deleteItem`,{item_list}).then(res=>{
        return res
    }).catch(err=>{
        return catchError(err)
    })
}

export const validateToken = async (data:any)=>{
    return await axios.post(`${url}validateToken`,{token:data}).then(res=>{
        return res
    }).catch(err=>{
        return catchError(err)
    })
}
export const editMarketData = async (data:any)=>{
    return await axios.post(`${url}editMarketData`,data).then(res=>{
        return res
    }).catch(err=>{
        return catchError(err)
    })
}

export const updateReview = async (user_id:any,text:any,stars:any,isEdit:any,item_id:any,market_id?:string)=>{
    return await axios.post(`${url}updateReview`,{user_id,text,stars,isEdit,item_id,market_id}).then(res=>{
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