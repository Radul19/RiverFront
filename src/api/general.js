import { url,isOffline, items } from "./url";
let prom = async (info)=>{
    let res = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(info)
        }, 1000);
    })
    return res
}

export const searchItems = async (text,categ)=>{
    let response = {status:404}
    if(isOffline){
        response = await prom({status:200,data:items})
    }

    return response
}
