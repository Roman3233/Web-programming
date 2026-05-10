const express = require('express');

const postController = require('../controllers/postController');
const validate = require('../middlewares/validate');
const postV = require('../middlewares/validators/postValidator');

const router = express.Router();

router.post('/', postV.createPostRules, validate, postController.createPost);
router.get('/', postV.getPostsRules, validate, postController.getAllPosts);
router.get('/search', postV.searchPostsRules, validate, postController.searchPosts);
router.get('/:id', postV.mongoIdParamRule, validate, postController.getPostById);
router.put('/:id', postV.updatePostRules, validate, postController.updatePost);
router.patch('/:id/like', postV.mongoIdParamRule, validate, postController.likePost);
router.delete('/:id', postV.mongoIdParamRule, validate, postController.deletePost);

module.exports = router;
