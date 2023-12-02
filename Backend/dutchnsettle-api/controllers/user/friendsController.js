const { Friends } = require("../../models");
const { getFriendsListByUserId, getFriendsListByUserIds, addFriend } = require("../../services/user/friendsService");
const { getUserDetailsByEmails } = require("../../services/user/userService");

class FriendsController {
    static async addFriend(req, res) {
        try {
            const payload = req.body;
            let usersExist = await getUserDetailsByEmails([req.user.email, payload.friendEmail]);
            if (usersExist && usersExist.length == 2) {
                let friendRecords = await getFriendsListByUserIds([usersExist[0]._id.valueOf(), usersExist[1]._id.valueOf()]);
                let friend = friendRecords.find(f => f.user.valueOf() == usersExist[0]._id.valueOf());
                if (friend) {
                    if (friend.friends.length > 0) {
                        if (friend.friends.find(f => f.user.valueOf() == usersExist[1]._id.valueOf()) == undefined) {
                            friend.friends = [...friend.friends, { user: usersExist[1]._id }];
                            friend.save();

                        } else {
                            return res.status(200).json({
                                type: "fail",
                                message: "Friend already exist.",
                                data: null,
                            });
                        }

                    } else {
                        friend = new Friends();
                        friend.user = usersExist[0]._id;
                        friend.friends = [{ user: usersExist[1]._id }];
                        friend.save();
                    }

                } else {
                    friend = new Friends();
                    friend.user = usersExist[0]._id;
                    friend.friends = [{ user: usersExist[1]._id }];
                    friend.save();
                }

                friend = friendRecords.find(f => f.user.valueOf() == usersExist[1]._id.valueOf());
                if (friend) {
                    if (friend.friends.length > 0) {
                        if (friend.friends.find(f => f.user.valueOf() == usersExist[0]._id.valueOf()) == undefined) {
                            friend.friends = [...friend.friends, { user: usersExist[0]._id }];
                            friend.save();
                        } else {
                            return res.status(200).json({
                                type: "fail",
                                message: "Friend already exist.",
                                data: null,
                            });
                        }
                    } else {
                        friend = new Friends();
                        friend.user = usersExist[1]._id;
                        friend.friends = [{ user: usersExist[0]._id }];
                        friend.save();
                    }
                } else {
                    friend = new Friends();
                    friend.user = usersExist[1]._id;
                    friend.friends = [{ user: usersExist[0]._id }];
                    friend.save();
                }

                let responseData = await getFriendsListByUserId(usersExist.find(u => u.email == req.user.email)?._id);
                return res.status(200).json({
                    type: "success",
                    message: "Friends added.",
                    data: responseData,
                });

            } else {
                return res.status(200).json({
                    type: "fail",
                    message: `${req.user.email} or ${payload.friendEmail} does not exist.`,
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

    static async getFriends(req, res) {
        try {
            const id = req.query.id;
            let friendRecord = await getFriendsListByUserId(id);
            return res.status(200).json({
                type: "success",
                message: "Success result",
                data: friendRecord ? friendRecord : [],
            });
        } catch (error) {
            return res.status(500).json({
                type: "error",
                message: error.message || "Unhandled Error",
                error,
            });
        }
    }
}

module.exports = FriendsController;