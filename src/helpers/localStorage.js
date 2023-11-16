import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeLocalData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value)
    } catch (e) {
        // saving error
    }
}
export const getLocalData = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key)
        if (value !== null) {
            return value
            // value previously stored
        } else {
            return false
        }
    } catch (e) {
        // error reading value
    }
}

export const storeLocalObject = async (key, value) => {
    try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem(key, jsonValue)
    } catch (e) {
        // saving error
    }
}


export const getLocalObject = async (key) => {
    try {
        const jsonValue = await AsyncStorage.getItem(key)
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        // error reading value
    }
}


export const deleteLocalData = async (key) => {
    try {
        await AsyncStorage.removeItem(key)
    } catch (error) {

    }
}