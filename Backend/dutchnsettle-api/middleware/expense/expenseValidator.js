const Joi = require("joi");

exports.individualExpenseValidator = (req, res, next) => {
    let payload = req.body;
    const schema = Joi.object({
        expenseName: Joi.string().trim().required().min(2),
        expenseAmount: Joi.number().min(0),
        paidBy: Joi.string().required().min(5),
        expenseDate: Joi.string().isoDate(),
        shares: Joi.array().required().min(1).items(Joi.object(
            {
                paidFor: Joi.string().trim().required().min(5),
                amount: Joi.number().required().min(0),
                splitType: Joi.string().required().valid(
                    "BY_EQUALLY",
                    "BY_AMOUNTS",
                    "BY_PERCENTAGE",
                    "BY_SHARE",
                    "SETTLED"
                )
            }
        )).unique("shares.paidFor")
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

exports.groupExpenseValidator = (req, res, next) => {
    let payload = req.body;
    const schema = Joi.object({
        expenseName: Joi.string().trim().required().min(2),
        expenseAmount: Joi.number().min(0),
        paidBy: Joi.string().required().min(5),
        groupId: Joi.string().required().min(5),
        expenseDate: Joi.string().isoDate(),
        shares: Joi.array().required().min(1).items(Joi.object(
            {
                paidFor: Joi.string().trim().required().min(5),
                amount: Joi.number().required().min(0),
                splitType: Joi.string().required().valid(
                    "BY_EQUALLY",
                    "BY_AMOUNTS",
                    "BY_PERCENTAGE",
                    "BY_SHARE",
                    "SETTLED"
                )
            }
        )).unique("shares.paidFor")
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