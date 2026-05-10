const validate = require('../middlewares/validate');
const postV = require('../middlewares/validators/postValidator');
router.post('/', postV.createPostRules, validate, postController.createPost);
router.get('/', postV.getPostsRules, validate, postController.getAllPosts);
router.get('/search', postV.searchPostsRules, validate, postController.searchPosts);
router.get('/:id', postV.mongoIdParamRule, validate, postController.getPostById);
router.put('/:id', postV.updatePostRules, validate, postController.updatePost);
router.patch('/:id/like', postV.mongoIdParamRule, validate, postController.likePost);
router.delete('/:id', postV.mongoIdParamRule, validate, postController.deletePost);
// routes/commentRoutes.js (фрагмент)
const validate = require('../middlewares/validate');
const commentV = require('../middlewares/validators/commentValidator');
router.post('/', commentV.createCommentRules, validate,
commentController.createComment);
router.get('/post/:postId', commentV.postIdParamRules, validate,
commentController.getCommentsByPost);
router.put('/:id', commentV.updateCommentRules, validate,
commentController.updateComment);
router.delete('/:id', commentV.deleteCommentRules, validate,
commentController.deleteComment);