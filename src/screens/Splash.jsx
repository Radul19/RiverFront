import { View, Text } from 'react-native'
import React, { useEffect } from 'react'

const Splash = ({navigation}) => {

    useEffect(() => {
      
        navigation.navigate("Home")
    //   return () => {
        
    //   }
    }, [])
    

  return (
    <View>
      <Text>Splash</Text>
    </View>
  )
}

export default Splash