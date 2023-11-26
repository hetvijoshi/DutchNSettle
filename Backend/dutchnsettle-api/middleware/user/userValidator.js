const Joi = require('joi');

exports.createUserEntityValidator = (req, res, next) => {
    let payload = req.body;
    const schema = Joi.object({
        email: Joi.string().email().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string(),
        picture: Joi.string().uri(),
        Phone: Joi.number().min(100000000).max(9999999999),
        name: Joi.string().required()
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

exports.fetchUserValidator = (req, res, next) => {
    let email = req.query.email;
    const schema = Joi.object({
        email: Joi.string().email().required()
    });
    const { error } = schema.validate({ email });
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

exports.searchUserValidator = (req, res, next) => {
    let s = req.query.s;
    const schema = Joi.object({
        s: Joi.string().required().trim().min(1)
    });
    const { error } = schema.validate({ s });
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

exports.fetchUserIdValidator = (req, res, next) => {
    let id = req.params.id;
    const schema = Joi.object({
        id: Joi.string().required().trim().min(1)
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

exports.updateUserValidator = (req, res, next) => {
    let payload = req.body;
    const schema = Joi.object({
        _id: Joi.string().required().min(5),
        email: Joi.string().email().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string(),
        picture: Joi.string().uri(),
        Phone: Joi.number().min(100000000).max(9999999999),
        name: Joi.string().required()
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