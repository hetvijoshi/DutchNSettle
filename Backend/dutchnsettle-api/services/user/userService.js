const { Schema } = require("mongoose");
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
            "_id": new Schema.Types.ObjectId(id),
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
        let idArray = ids.map(id => { return new Schema.Types.ObjectId(id) });
        let matchQuery = {
            "_id": { "$in": idArray },
        };
        result = User.findOne(matchQuery).lean();
    } catch (error) {
        return Promise.reject(error);
    }
    return result;
}
