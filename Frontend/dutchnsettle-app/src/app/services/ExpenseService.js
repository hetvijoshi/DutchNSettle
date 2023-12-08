import { Nextclient } from "../lib/client/http";

export const addIndividualExpense = async (payload, token) => {
    let response;
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    try {
        response = await Nextclient.post("/expense", payload, config);
    }
    catch (err) {
        console.log("Error", err)
    }

    return response?.data
}

export const getExpenseDetails = async (payload, token) => {
    let response;
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    try {
        response = await Nextclient.get(`/expense/${payload.userId}/${payload.friendId}`, config);
    }
    catch (err) {
        console.log("Error", err)
    }

    return response?.data
}

export const settleExpenseAmount = async (payload, token) => {
    let response;
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    try {
        response = await Nextclient.post("/expense/settle", payload, config);
    }
    catch (err) {
        console.log("Error", err)
    }

    return response?.data
}