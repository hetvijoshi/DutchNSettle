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

exports.getFriendsListByUserId = (userId) => {
    let result;
    try {
        let matchQuery = {
            userId: userId,
        };
        result = Friends.findOne(matchQuery)
            .populate('userId')
            .populate('friends.userId')
            .lean();
    } catch (error) {
        return Promise.reject(error);
    }
    return result;
}