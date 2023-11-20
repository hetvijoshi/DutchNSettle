import { Nextclient } from "../lib/client/http";

export const createGroup = async (payload, token) => {
    let response;
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    try {
        response = await Nextclient.post("/group", payload, config);
    }
    catch (err) {
        console.log("Error", err)
    }

    return response?.data
}

export const getGroupsByUser = async (query, token) => {
    let response;
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    try {
        response = await Nextclient.get(`/group/user/${query}`, config);
    }
    catch (err) {
        console.log("Error", err)
    }

    return response.data
}