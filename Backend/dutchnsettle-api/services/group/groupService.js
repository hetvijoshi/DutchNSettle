const { Group } = require("../../models");

exports.createGroup = (data) => {
    let result;
    try {
        result = new Group(data);
    } catch (error) {
        return Promise.reject(error);
    }
    return result;
}

exports.addMember = (data) => {
    let result;
    try {
        result = Group.findById(data);
    } catch (error) {
        return Promise.reject(error);
    }
    return result;
}

exports.getGroup = (data) => {
    let result;
    try {
        result = Group.findById(data).populate("groupMembers.user").lean();
    } catch (error) {
        return Promise.reject(error);
    }
    return result;
}