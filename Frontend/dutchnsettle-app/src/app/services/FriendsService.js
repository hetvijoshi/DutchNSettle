import { Nextclient } from "../lib/client/http";

export const getSearchResults = async (query, token) => {
    let response;
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    try {
        response = await Nextclient.get(`/user/search?s=${query}`, config);
    }
    catch (err) {
        console.log("Error", err)
    }

    return response.data
}

export const addFriend = async (payload, token) => {
    let response;
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    try {
        response = await Nextclient.post("/friends", payload, config);
    }
    catch (err) {
        console.log("Error", err)
    }

    return response?.data
}

export const getFriends = async (userId, token) => {
    let response;
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    try {
        response = await Nextclient.get(`/friends?id=${userId}`, config);
    }
    catch (err) {
        console.log("Error", err)
    }

    return response.data
}