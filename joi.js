// const joi = require("joi");

// module.exports.listingSchema = joi.object({
//     listing: joi.object({
//         title: joi.string().required(),
//         description: joi.string().required(),
//         location: joi.string().required(),
//         country: joi.string().required(),
//         price: joi.number().required().min(0),

        
//         image: joi.object({
//             filename: joi.string().allow("", null),
//             url: joi.string().allow("", null)
//         }).optional()
//     }).required(),

//     image: joi.any().optional()
// });

// module.exports.reviewSchema = joi.object({
//     review:joi.object({
//         rating:joi.number().required().min(1).max(5),
//         comment:joi.string().required(),
//     }).required(),
// });


const Joi = require("joi");

const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),

        category: Joi.string().required(),

        image: Joi.object({
            filename: Joi.string(),
            url: Joi.string()
        })
    }).required()
});


module.exports = {
    listingSchema
};