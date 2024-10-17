import { View, Text } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { IconLoad } from '../components/Icons'
import Context from '../components/Context'
import { getLocalData } from '../helpers/localStorage'
import { validateToken } from '../api/general'
import { NavigationProp } from '@react-navigation/native';

interface SplashProps {
  navigation: NavigationProp<any, any>
}

const Splash = ({ navigation }: SplashProps) => {
  const { setUserData } = useContext(Context)

  useEffect(() => {

    (async () => {
      const isLogged = await getLocalData('@userToken')
      if (isLogged) {
        const { status, data } = await validateToken(isLogged)
        if (status === 200) {
          setUserData(data)
        }
      }
      navigation.navigate("Home")
    })()
    //   return () => {

    //   }
  }, [])


  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 48 }} >
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
 * - - Show error when not text ✅
 * - - Fetch Data only when loaded reviews 💡 or maybe not?
 * - TEXT FILTER AT FRONT END ⌛
 * - - Item ✅ / Company / 
 * - EDIT ITEM FLOW ✅
 * - - Check Item at long press ✅
 * - - Check is item is being selected  ✅
 * - - Toggle normal press at being selected  ✅
 * - - Show icons with functions  ✅
 * - - Show icons with functions  ✅
 * - - Btn Contact Performance  ✅
 * - - Show Page to edit ✅
 * - - Preview Page to edit ✅
 * - - Send Info to update item / Delete old Images logic ✅ 
 * - - Delete by bulks (need learning)  ✅
 * 
 * - NEW API ✅
 * - COMMERCE PAGE ✅
 * 
 * - PAYMENT FLOW
 * - IMAGE LOGISTIC with API
 * - REPORTS SYSTEM
 * - UNIT TEST
 * 
 * 
 * EXTRA:
 * - - Alternate between route.params.item || ..params.id ❓
 * - - CLEAN <ItemPage/> Is so gross ✅
 * 
 * - MORE KNOWLEDGE:
 * - PAYMENT
 * - IMAGE FILTER FOR ITEMS/ COMPANY - NOT RESULT (Allow any upload when private selected markets, use API when public markets allowed) 
 * - 
 * - 
 * - TEXT FILTER FOR COMMENTS ❌
 * - - Create Item / Register / Register Commerce ✅

 */


/// TO DO:
/**
 * 
 * ✔ Dollar before price <NewItem> 
 * ✔ Load image picker spinner <NewItem>
 * ✔ <NewItem> Validations
 * ✔ <Register> Validations 
 * ✔ Upload <NewItem> to DB
 * ✔ Reviews load and show stars
 * ✔ Create Reviews
 * 
 * ✔ Edit Item from Commercial perspective
 * ✔ Delete Item from Commercial Inventory
 * ✔ Delete Items from Bulk ????
 * ✔ Favorites logic Item
 * 
 * ✔ Commerce Page - - Search shop info with items at the same time
 * ✔ Favorites logic Commerce
 * ✔ Searchbar items from commerce
 * ✔ Review from commerce
 * 
 * ✔ Show and enable contact info
 * 
 * ✔ Commerce search
 * ✔ Clean Commerce Register/Edit
 * ✔ Delivery btn on Create/edit Commerce
 * ✔ Schedules in Commerce page
 * ✔ Commerce btn redesign on Item Page
 * 
 * ✔ Search by open or close
 * ✔ Splash Screen + Icon App
 * ✔ Hide Shedules or Create "Show More" btn
 * 
 * ✔ Better Schedules
 * ✔ Delivery on Categories Shop + remove label
 * ✔ Fixed home bad "executeSearch" + commerce
 * ✔ Load to bulk delete on commerce
 * 
 * ⏳ Color primary
 *  
 * 
 * ⏳ Send Email Code (Email logic)
 * ⏳ Web Page
 * ⏳ Update / Link / Versions system
 * ⏳ Do pilot apk
 * ⏳ Instagram post/ account
 * 
 * ❓ Reduce Categories size ❌
 * ❓ Review btn redesign ❌
 */