const Joi = require("joi");

exports.fetchFriendsValidator = (req, res, next) => {
    let id = req.query.id;
    const schema = Joi.object({
        id: Joi.string().required().min(5)
    });
    const { error } = schema.validate({ id });
    if (error) {
        return res.status(500).send({
            type: "fail",
            message: error.details.reduce((prev, current) => { return prev + current.message }, ""),
            data: null
        });
    } else {
        next();
    }
}


exports.addFriendValidator = (req, res, next) => {
    let payload = req.body;
    const schema = Joi.object({
        friendEmail: Joi.string().email().required()
    });
    const { error } = schema.validate(payload);
    if (error) {
        return res.status(500).send({
            type: "fail",
            message: error.details.reduce((prev, current) => { return prev + current.message }, ""),
            data: null
        });
    } else {
        next();
    }
}