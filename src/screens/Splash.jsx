import { View, Text } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { IconLoad } from '../components/Icons'
import Context from '../components/Context'
import { getLocalData } from '../helpers/localStorage'
import { validateToken } from '../api/general'

const Splash = ({navigation}) => {
  const {setUserData} = useContext(Context)

    useEffect(() => {
      
      (async()=>{
        const isLogged = await getLocalData('@userToken')
        if(isLogged){
          const {status,data} = await validateToken(isLogged)
          if(status === 200){
            setUserData(data)
          }
        }
        navigation.navigate("Home")
      })()
    //   return () => {
        
    //   }
    }, [])
    

  return (
    <View style={{alignItems:'center',justifyContent:'center',paddingTop:48}} >
      <IconLoad />
    </View>
  )
}

export default Splash