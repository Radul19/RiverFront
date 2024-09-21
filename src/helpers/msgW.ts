import { Linking, Platform } from "react-native";

export const sendWhatsApp = (phone: string,msg?: string) => {
  // let msg = "type something";
  // let phoneWithCountryCode = "xxxxxxxxxx";
  Linking.openURL(`whatsapp://send?text=${msg??""}&phone=${phone}`)
//   let mobile = Platform.OS == "ios" ? phone : "+" + phone;
//   if (mobile) {
//     if (msg) {
//       let url = "whatsapp://send?text=" + msg + "&phone=" + mobile;
//       Linking.openURL(url)
//         .then((data) => {
//           console.log("WhatsApp Opened");
//         })
//         .catch(() => {
//           alert("Make sure WhatsApp installed on your device");
//         });
//     } else {
//       alert("Please insert message to send");
//     }
//   } else {
//     alert("Please insert mobile no");
//   }
};

export const sendSMS = (phone:string,msg?:string)=>{
    Linking.openURL(`sms:${phone}?body=${msg??""}`)
}

export const openIg = (user:string)=>{
    Linking.openURL(`https://www.instagram.com/${user}`)
}
export const openMessenger = (user:string,msg?:string)=>{
    /// https://m.me/${user}?text=hello
    Linking.openURL(`https://m.me/${user}?text=${msg??""}`)
}
export const openTelegram = (user:string,msg:string)=>{
    /// https://m.me/${user}?text=hello
    // Linking.openURL(`https://t.me/${user}&text=${text}`)
    Linking.openURL(`https://t.me/${user}?text=${msg??""}`)
}