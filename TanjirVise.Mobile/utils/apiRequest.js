import axios from "axios";
import { Platform } from "react-native";
import { MAIN_API_URL } from "./constants";
import { getAuthToken } from "../functions/authTokenFunctions";

export default async (request) => {
    request.method = request.method || "get";
    request.url ? (request.url = `${MAIN_API_URL}/${request.url}`) : (request.url = URL);
    if (Platform.OS === "android") {
        request.data = request.data || {};
    }
    if (request.data && request.method === "get") {
        request.data = null;
    }
    request.headers = {
        ...request.headers,
        "Content-Type": "application/json",
        "X-Device": "mobile",
    };

    const userToken = await getAuthToken();
    if (userToken) {
        request.headers = {
            ...request.headers,
            Authorization: `bearer ${userToken}`,
        };
    }
    return axios(request);
};
