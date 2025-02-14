import AsyncStorage from "@react-native-async-storage/async-storage";
import "core-js/stable/atob";
import { jwtDecode } from 'jwt-decode';

export const getAuthToken = async () => {
    try
    {
        return await AsyncStorage.getItem('authToken');
    } catch (e)
    {
        console.log(e);
        return null;
    }
};

export const storeAuthToken = async (token) => {
    try
    {
        await AsyncStorage.setItem('authToken', token);
    } catch (e)
    {
        console.log(e);
    }
};

export const removeAuthToken = async () => {
    try
    {
        await AsyncStorage.removeItem('authToken')
    } catch (e)
    {
        console.log(e);
    }
};

export const getRoleFromToken = async (token = null) => {
    try
    {
        if (token === null)
        {
            let authToken = await getAuthToken();
            return jwtDecode(authToken)["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        }
        else
        {
            return jwtDecode(token)["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        }
    } catch (e)
    {
        console.log(e);
    }
};

export const getUserIdFromToken = async (token = null) => {
    try
    {
        if (token === null)
        {
            let authToken = await getAuthToken();
            return jwtDecode(authToken)["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
        }
        else
        {
            return jwtDecode(token)["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
        }
    } catch (e)
    {
        console.log(e);
    }
};
