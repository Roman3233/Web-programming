const { body, param } = require('express-validator');

exports.createCommentRules = [
 body('postId')
 .trim()
 .notEmpty().withMessage('postId: is required')
 .bail()
 .isMongoId().withMessage('postId: must be a valid MongoDB ObjectId'),
 body('author')
 .trim()
 .notEmpty().withMessage('author: is required')
 .bail()
 .isLength({ min: 2, max: 100 }).withMessage('author: length must be 2-100 characters'),
 body('content')
 .trim()
 .notEmpty().withMessage('content: is required')
 .bail()
 .isLength({ min: 1, max: 1000 }).withMessage('content: length must be 1-1000 characters')
];

exports.updateCommentRules = [
 param('id').trim().isMongoId().withMessage('id: must be a valid MongoDB ObjectId'),
 body('content')
 .trim()
 .notEmpty().withMessage('content: is required')
 .bail()
 .isLength({ min: 1, max: 1000 }).withMessage('content: length must be 1-1000 characters')
];

exports.deleteCommentRules = [
 param('id').trim().isMongoId().withMessage('id: must be a valid MongoDB ObjectId')
];

exports.postIdParamRules = [
 param('postId').trim().isMongoId().withMessage('postId: must be a valid MongoDB ObjectId')
];
