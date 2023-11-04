const { Friends } = require("../../models");

exports.addFriend = (data) => {
    let result;
    try {
        result = new Friends(data);
    } catch (error) {
        return Promise.reject(error);
    }
    return result;
}

exports.getFriendsListByUserId = async (userId) => {
    let result;
    try {
        let matchQuery = {
            user: userId,
        };
        result = await Friends.findOne(matchQuery)
            .populate("user")
            .populate("friends.user");
    } catch (error) {
        return Promise.reject(error);
    }
    return result;
}

exports.getFriendsListByUserIds = async (ids) => {
    let result;
    try {
        let matchQuery = {
            user: { "$in": ids },
        };
        result = await Friends.find(matchQuery);
    } catch (error) {
        return Promise.reject(error);
    }
    return result;
}