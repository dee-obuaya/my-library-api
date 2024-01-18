require('dotenv').config();
const { bookSchema } = require('./schemas');
const ExpressError = require('./utils/ExpressError');


module.exports.validateBook = (req, res, next) => {
    const { error } = bookSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        res.json({
            err: new ExpressError(msg, 400)
        })
    } else {
        next();
    }
}

module.exports.isAuthorized = (req, res, next) => {
    const { authKey } = req.query;
    if (!authKey) {
        res.json({
            err: new ExpressError('An authorization key is required. Please pass authKey as a query.', 400),
        });
    } else if (authKey !== process.env.AUTH_KEY) {
        res.json({
            err: new ExpressError('Wrong authorization key.', 400),
        });
    } else {
        next();
    }
}
