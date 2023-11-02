const { getFriendsListByUserId, addFriend } = require("../../services/user/friendsService");
const { getUserDetailsByEmails } = require("../../services/user/userService");

class FriendsController {
    static async addFriend(req, res) {
        try {
            const payload = req.body;
            let usersExist = await getUserDetailsByEmails([req.user.email, payload.friendEmail]);
            if (usersExist && usersExist.length == 2) {
                let friendRecord = await getFriendsListByUserId(usersExist[1]._id.valueOf());
                if (friendRecord) {
                    friendRecord.friends = [...friendRecord.friends, { userId: usersExist[0]._id.valueOf() }];
                } else {
                    friendRecord = {};
                    friendRecord.userId = usersExist[1]._id.valueOf();
                    friendRecord.friends = [{ userId: usersExist[0]._id.valueOf() }];
                    friendRecord = await addFriend(friendRecord);
                }
                friendRecord.save();

                friendRecord = await getFriendsListByUserId(usersExist[0]._id.valueOf());
                if (friendRecord) {
                    friendRecord.friends = [...friendRecord.friends, { userId: usersExist[1]._id.valueOf() }];
                } else {
                    friendRecord = {};
                    friendRecord.userId = usersExist[0]._id.valueOf();
                    friendRecord.friends = [{ userId: usersExist[1]._id.valueOf() }];
                    friendRecord = await addFriend(friendRecord);
                }
                friendRecord.save();

                return res.status(200).json({
                    type: "success",
                    message: "Friends added.",
                    data: friendRecord,
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
                data: friendRecord,
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