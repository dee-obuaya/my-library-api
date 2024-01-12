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
