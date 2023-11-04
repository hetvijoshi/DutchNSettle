const { createGroup, getGroup, addMember } = require("../../services/group/groupService");


class GroupController {
    static async createGroup(req, res) {
        try {
            const payload = req.body;
            let group = await createGroup(payload);
            group.save();
            if (group) {
                return res.status(200).json({
                    type: "success",
                    message: "Success result",
                    data: group,
                });
            } else {
                return res.status(200).json({
                    type: "success",
                    message: "Success result",
                    data: null,
                });
            }

        } catch (error) {
            return res.status(500).json({
                type: "error",
                message: error.message || "Unhandled Error",
                error,
            });
        }
    }

    static async addMember(req, res) {
        try {
            const { groupId, userId } = req.body;
            let group = await addMember(groupId);
            if (group) {
                if (group.groupMembers.findIndex(x => x.user == userId) >= 0) {
                    return res.status(200).json({
                        type: "fail",
                        message: "Member already exist in the group.",
                        data: group,
                    });
                } else {
                    group.groupMembers = [...group.groupMembers, { user: userId }];
                    group.modifiedDate = Date.now();
                    group.save();
                    group.populate('groupMembers.user');
                    return res.status(200).json({
                        type: "success",
                        message: "Success result",
                        data: group,
                    });
                }

            } else {
                return res.status(200).json({
                    type: "success",
                    message: "No group found",
                    data: null,
                });
            }
        } catch (error) {
            return res.status(500).json({
                type: "error",
                message: error.message || "Unhandled Error",
                error,
            });
        }
    }

    static async fetchGroup(req, res) {
        try {
            const payload = req.params.id;
            let group = await getGroup(payload);
            if (group) {
                return res.status(200).json({
                    type: "success",
                    message: "Success result",
                    data: group,
                });
            } else {
                return res.status(200).json({
                    type: "success",
                    message: "No group found",
                    data: null,
                });
            }
        } catch (error) {
            return res.status(500).json({
                type: "error",
                message: error.message || "Unhandled Error",
                error,
            });
        }
    }
}

module.exports = GroupController;