const { sendEmail } = require("../../services/email/emailService");
const { createUser, getUserDetailsByEmail, getUserDetailsByEmails, getUserDetailsById, getUserDetailsByIds, updateUser, getUsersBySearchKeyword } = require("../../services/user/userService");

class UserController {
    static async newUser(req, res) {
        try {
            const payload = req.body;
            let user = await getUserDetailsByEmail(payload.email);
            if (!user) {
                user = await createUser(payload);
                user.save();

                const emailData = {
                    body: `Your ${user.name}, Account has been created.`,
                    isBodyHtml: true,
                    toEmail: user.email,
                    subject: 'Welcome to DutchNSettle!'
                }
                await sendEmail(emailData);
            }
            return res.status(200).json({
                type: "success",
                message: "Success result",
                data: user,
            });
        } catch (error) {
            return res.status(500).json({
                type: "error",
                message: error.message || "Unhandled Error",
                error,
            });
        }
    }

    static async fetchUserByEmail(req, res) {
        try {
            const email = req.query.email;
            let user = await getUserDetailsByEmail(email);
            if (user) {
                return res.status(200).json({
                    type: "success",
                    message: "Success result",
                    data: user,
                });
            } else {
                return res.status(200).json({
                    type: "fail",
                    message: "User not found",
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

    static async fetchUserById(req, res) {
        try {
            const id = req.params.id;
            let user = await getUserDetailsById(id);
            if (user) {
                return res.status(200).json({
                    type: "success",
                    message: "Success result",
                    data: user,
                });
            } else {
                return res.status(200).json({
                    type: "fail",
                    message: "User not found",
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

    static async searchUsers(req, res) {
        try {
            const searchQuery = req.query.s;
            let user = await getUsersBySearchKeyword(searchQuery);
            if (user) {
                return res.status(200).json({
                    type: "success",
                    message: "Success result",
                    data: user,
                });
            } else {
                return res.status(200).json({
                    type: "fail",
                    message: "User not found",
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

    static async updateUserDetails(req, res) {
        try {
            const payload = req.body;
            const user = await updateUser(payload);
            user.modifiedDate = Date.now();
            user.save();
            return res.status(200).json({
                type: "success",
                message: "User updated successfully",
                data: user,
            });
        } catch (error) {
            return res.status(500).json({
                type: "error",
                message: error.message || "Unhandled Error",
                error,
            });
        }
    }

    // static async fetchUserByIds(req, res) {
    //     try {
    //         const ids = req.query.id.split(",");
    //         let users = await getUserDetailsByIds(ids);
    //         if (users) {
    //             return res.status(200).json({
    //                 type: "success",
    //                 message: "Success result",
    //                 data: users,
    //             });
    //         } else {
    //             return res.status(200).json({
    //                 type: "fail",
    //                 message: "Users not found.",
    //                 data: null,
    //             });
    //         }

    //     } catch (error) {
    //         return res.status(500).json({
    //             type: "error",
    //             message: error.message || "Unhandled Error",
    //             error,
    //         });
    //     }
    // }

    // static async fetchUserByEmails(req, res) {
    //     try {
    //         const emails = req.query.email.split(",");
    //         let users = await getUserDetailsByEmails(emails);
    //         if (users) {
    //             return res.status(200).json({
    //                 type: "success",
    //                 message: "Success result",
    //                 data: users,
    //             });
    //         } else {
    //             return res.status(200).json({
    //                 type: "fail",
    //                 message: "User not found",
    //                 data: null,
    //             });
    //         }

    //     } catch (error) {
    //         return res.status(500).json({
    //             type: "error",
    //             message: error.message || "Unhandled Error",
    //             error,
    //         });
    //     }
    // }
}

module.exports = UserController;