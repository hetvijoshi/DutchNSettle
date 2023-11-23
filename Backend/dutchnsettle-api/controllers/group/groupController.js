const { Friends } = require("../../models");
const { createGroup, getGroup, addMember, getGroupsForUser, checkDuplicateGroup } = require("../../services/group/groupService");
const { getFriendsListByUserIds } = require("../../services/user/friendsService");


class GroupController {
    static async createGroup(req, res) {
        try {
            const payload = req.body;
            let group = await createGroup(payload);
            group.save();

            const { groupMembers } = payload;

            for (let i = 0; i < groupMembers.length - 1; i++) {
                for (let j = i + 1; j < groupMembers.length; j++) {
                    let friendRecords = await getFriendsListByUserIds([groupMembers[i].user, groupMembers[j].user]);
                    let friend = friendRecords.find(f => f.user.toString() == groupMembers[i].user);
                    if (friend) {
                        if (friend.friends.length > 0) {
                            if (friend.friends.find(f => f.user.toString() == groupMembers[j].user) == undefined) {
                                friend.friends = [...friend.friends, { user: groupMembers[j].user }];
                                friend.save();

                            }
                        } else {
                            friend = new Friends();
                            friend.user = groupMembers[i].user;
                            friend.friends = [{ user: groupMembers[j].user }];
                            friend.save();
                        }

                    } else {
                        friend = new Friends();
                        friend.user = groupMembers[i].user;
                        friend.friends = [{ user: groupMembers[j].user }];
                        friend.save();
                    }

                    friend = friendRecords.find(f => f.user.toString() == groupMembers[j].user);
                    if (friend) {
                        if (friend.friends.length > 0) {
                            if (friend.friends.find(f => f.user.toString() == groupMembers[i].user) == undefined) {
                                friend.friends = [...friend.friends, { user: groupMembers[i].user }];
                                friend.save();
                            }
                        } else {
                            friend = new Friends();
                            friend.user = groupMembers[j].user;
                            friend.friends = [{ user: groupMembers[i].user }];
                            friend.save();
                        }
                    } else {
                        friend = new Friends();
                        friend.user = groupMembers[j].user;
                        friend.friends = [{ user: groupMembers[i].user }];
                        friend.save();
                    }
                }
            }

            if (group) {
                return res.status(200).json({
                    type: "success",
                    message: "Success result",
                    data: (await group.populate("createdBy")).populate("groupMembers.user"),
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
                if (group.groupMembers.find(x => x.user.toString() == userId)) {
                    return res.status(200).json({
                        type: "fail",
                        message: "Member already exist in the group.",
                        data: group,
                    });
                } else {
                    for (let i = 0; i < group.groupMembers.length; i++) {
                        let friendRecords = await getFriendsListByUserIds([group.groupMembers[i].user, userId]);
                        let friend = friendRecords.find(f => f.user.toString() == group.groupMembers[i].user.toString());
                        if (friend) {
                            if (friend.friends.length > 0) {
                                if (friend.friends.find(f => f.user.toString() == userId) == undefined) {
                                    friend.friends = [...friend.friends, { user: userId }];
                                    friend.save();

                                }
                            } else {
                                friend = new Friends();
                                friend.user = group.groupMembers[i].user;
                                friend.friends = [{ user: userId }];
                                friend.save();
                            }

                        } else {
                            friend = new Friends();
                            friend.user = group.groupMembers[i].user;
                            friend.friends = [{ user: userId }];
                            friend.save();
                        }

                        friend = friendRecords.find(f => f.user.toString() == userId);
                        if (friend) {
                            if (friend.friends.length > 0) {
                                if (friend.friends.find(f => f.user.toString() == group.groupMembers[i].user.toString()) == undefined) {
                                    friend.friends = [...friend.friends, { user: group.groupMembers[i].user }];
                                    friend.save();
                                }
                            } else {
                                friend = new Friends();
                                friend.user = userId;
                                friend.friends = [{ user: group.groupMembers[i].user }];
                                friend.save();
                            }
                        } else {
                            friend = new Friends();
                            friend.user = userId;
                            friend.friends = [{ user: group.groupMembers[i].user }];
                            friend.save();
                        }
                    }

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

    static async fetchGroupsForUser(req, res) {
        try {
            const payload = req.params.id;
            let group = await getGroupsForUser(payload);
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