const Joi = require("joi");

exports.addMemberValidator = (req, res, next) => {
    let payload = req.body;
    const schema = Joi.object({
        groupId: Joi.string().trim().required().min(5),
        userId: Joi.string().trim().required().min(5)
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

exports.createGroupValidator = (req, res, next) => {
    let payload = req.body;
    const schema = Joi.object({
        groupName: Joi.string().trim().required().min(2),
        groupIcon: Joi.string().optional().trim().allow(""),
        groupMembers: Joi.array().min(3).items(Joi.object(
            {
                user: Joi.string().trim().required().min(5)
            }
        )),
        createdBy: Joi.string().trim().required().min(5)
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

exports.fetchGroupsValidator = (req, res, next) => {
    let id = req.params.id;
    const schema = Joi.object({
        id: Joi.string().required().trim().min(5)
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