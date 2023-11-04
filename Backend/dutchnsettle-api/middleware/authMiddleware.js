const { appConfig } = require('../config/appconfig');
const { getUserDetailsByEmail } = require('../services/user/userService');

const isAuthenticated = async (req, res, next) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    try {

        var responseToken = await req.app.authClient.verifyIdToken({
            idToken: token,
            audience: appConfig.auth.google.clientID,  // Specify the expected audience of the token
        });

        const payload = responseToken.getPayload();
        if (payload) {
            if (req.route.stack[req.route.stack.length - 1].name.toLowerCase() != "newuser") {
                const isUser = await getUserDetailsByEmail(payload.email);
                if (isUser) {
                    req.user = payload;
                    next();
                } else {
                    return res.status(401).send({
                        type: "fail",
                        message: "User not found.",
                        data: null
                    });
                }
            } else {
                if (req.body.email == payload.email) {
                    next();
                } else {
                    return res.status(401).send({
                        type: "fail",
                        message: "Email in token is not same as that in payload.",
                        data: null
                    });
                }
            }
        } else {
            return res.status(401).send({
                type: "fail",
                message: "Invalid token.",
                data: null
            });
        }

    } catch (error) {
        console.error(error);
        return res.sendStatus(401);
    }

};

module.exports = isAuthenticated;