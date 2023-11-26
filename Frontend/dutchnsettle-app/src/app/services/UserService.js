import { Nextclient } from "../lib/client/http";

export const getUserDetails = async (id, token) => {
    let response;
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    try {
        response = await Nextclient.get(`/user/${id}`, config);
    }
    catch (err) {
        console.log("Error", err)
    }

    return response.data
}