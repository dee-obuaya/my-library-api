const BaseJoi = require('joi');

module.exports.bookSchema = BaseJoi.object({
    book: BaseJoi.object({
        title: BaseJoi.string().required(),
        author: BaseJoi.string().required(),
        genre: BaseJoi.array().required()
    }).required(),
});
