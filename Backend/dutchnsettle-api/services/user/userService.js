const { User } = require("../../models");

exports.createUser = (data) => {
    let result;
    try {
        result = new User(data);
    } catch (error) {
        return Promise.reject(error);
    }
    return result;
}

exports.getUserDetailsByEmail = (email) => {
    let result;
    try {
        let matchQuery = {
            email: email,
        };
        result = User.findOne(matchQuery).lean();
    } catch (error) {
        return Promise.reject(error);
    }
    return result;
}

exports.getUserDetailsByEmails = (emails) => {
    let result;
    try {
        let matchQuery = {
            "email": { "$in": emails },
        };
        result = User.find(matchQuery).lean();
    } catch (error) {
        return Promise.reject(error);
    }
    return result;
}

exports.getUserDetailsById = (id) => {
    let result;
    try {
        let matchQuery = {
            "_id": id,
        };
        result = User.findOne(matchQuery).lean();
    } catch (error) {
        return Promise.reject(error);
    }
    return result;
}

exports.getUserDetailsByIds = (ids) => {
    let result;
    try {
        let matchQuery = {
            "_id": { "$in": ids },
        };
        result = User.find(matchQuery).lean();
    } catch (error) {
        return Promise.reject(error);
    }
    return result;
}

exports.getUsersBySearchKeyword = (data) => {
    let result;
    try {
        let matchQuery = {
            name: { $regex: "^" + data, $options: "i" },
        };
        result = User.find(matchQuery).lean();
    } catch (error) {
        return Promise.reject(error);
    }
    return result;
}

exports.updateUser = (data) => {
    let result;
    try {
        const { _id } = data;
        result = User.findByIdAndUpdate(
            { _id },
            { $set: data },
            { new: true });
    } catch (error) {
        return Promise.reject(error);
    }
    return result;
}
