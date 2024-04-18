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

/**
 * TODO:  ❌ ✅ ⌛
 * - REVIEWS ⌛ 
 * - - Components ✅
 * - - Send info to Back ✅
 * - - Display REAL info to Front ✅
 * - - Update comment logic ✅
 * - - Fetch Data only when loaded reviews ⌛
 * 
 * EXTRA:
 * - Refresing <Home/> not working ⌛
 * - - Alternate between route.params.item || ..params.id ⌛
 * - - CLEAN <ItemPage/> Is so gross ✅
 * 
 * - TEXT FILTER AT FRONT END 
 * - - Item / Company / Description 
 * - EDIT ITEM FLOW
 * - PAYMENT FLOW
 * - UNIT TEST
 * 
 * - MORE KNOWLEDGE:
 * - PAYMENT
 * - IMAGE FILTER FOR ITEMS/ COMPANY - NOT RESULT, MANUAL LOGISTIC NEEDED
 * - 
 * - TEXT FILTER FOR COMMENTS ❌
 * - - Create Item / Register / Register Commerce /
 */