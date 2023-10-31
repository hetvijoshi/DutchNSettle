const config = require('../config/appconfig');

const isAuthenticated = async (req, res, next) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    try {
        var responseToken = await req.app.authClient.verifyIdToken({
            idToken: token,
            audience: config.auth.google.clientID,  // Specify the expected audience of the token
        });

        const payload = responseToken.getPayload();
        req.user = payload;
        next();
    } catch (error) {
        console.error(error);
        return res.sendStatus(401);
    }

};

module.exports = isAuthenticated;