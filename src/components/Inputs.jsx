import { View, TextInput, StyleSheet} from 'react-native'
import React from 'react'
import { IconZoom } from './Icons'

export const SearchBar =()=> {
  return (
    <View style={st.ctn} >
        <IconZoom/>
        <TextInput style={st.input} placeholder='Buscar...' />
    </View>
  )
}
const st = StyleSheet.create({
    ctn:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        gap:12,
        paddingVertical:8,
        paddingHorizontal:12,
        borderWidth:2,
        borderColor:'#cccccc',
        borderRadius:6,
        flex:1
    },
    input:{
        fontSize:14
    }
})