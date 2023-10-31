const { sendEmail } = require("../../services/email/emailService");
const { createUser, getUserDetailsByEmail } = require("../../services/user/userService");

class GroupController {
    static async createGroup(req, res) {
        try {
            const payload = req.body;
            let user = await getUserDetailsByEmail(payload.email);
            if (!user) {
                user = await createUser(payload);
                user.save();
                const emailData = {
                    body: 'Your Account has been created.',
                    isBodyHtml: true,
                    toEmail: user.email
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

    static async getUser(req, res) {
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
}

module.exports = GroupController;