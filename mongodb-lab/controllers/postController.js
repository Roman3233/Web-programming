const Post = require('../models/Post');
const Comment = require('../models/Comment');

// ==================== CREATE ====================
// Створення нового поста
exports.createPost = async (req, res) => {
 try {
 const { title, content, author, tags } = req.body;

 const post = await Post.create({
 title,
 content,
 author,
 tags: tags || []
 });

 res.status(201).json({
 success: true,
 data: post,
 message: 'Пост успішно створено'
 });
 } catch (error) {
 res.status(400).json({
 success: false,
 message: error.message
 });
 }
};

// ==================== READ ====================
// Отримання всіх постів з пагінацією
exports.getAllPosts = async (req, res) => {
 try {
 const page = parseInt(req.query.page) || 1;
 const limit = parseInt(req.query.limit) || 10;
 const skip = (page - 1) * limit;

 const posts = await Post.find()
 .sort({ createdAt: -1 }) // Сортування від нових до старих
 .skip(skip)
 .limit(limit);

 const total = await Post.countDocuments();

 res.status(200).json({
 success: true,
 count: posts.length,
 total,
 totalPages: Math.ceil(total / limit),
 currentPage: page,
 data: posts
 });
 } catch (error) {
 res.status(500).json({
 success: false,
 message: error.message
 });
 }
};

// Отримання одного поста з коментарями
exports.getPostById = async (req, res) => {
 try {
 const post = await Post.findById(req.params.id);

 if (!post) {
 return res.status(404).json({
 success: false,
 message: 'Пост не знайдено'
 });
 }

 // Отримуємо коментарі до цього поста
 const comments = await Comment.find({ post: post._id })
 .sort({ createdAt: -1 });

 res.status(200).json({
 success: true,
 data: {
 post,
 comments
 }
 });
 } catch (error) {
 res.status(500).json({
 success: false,
 message: error.message
 });
 }
};

// Пошук постів
exports.searchPosts = async (req, res) => {
 try {
 const { q } = req.query;

 const posts = await Post.find(
 { $text: { $search: q } },
 { score: { $meta: 'textScore' } }
 ).sort({ score: { $meta: 'textScore' } });

 res.status(200).json({
 success: true,
 count: posts.length,
 data: posts
 });
 } catch (error) {
 res.status(500).json({
 success: false,
 message: error.message
 });
 }
};

// ==================== UPDATE ====================
// Оновлення поста
exports.updatePost = async (req, res) => {
 try {
 const { title, content, tags } = req.body;

 const post = await Post.findByIdAndUpdate(
 req.params.id,
 {
 title,
 content,
 tags,
 updatedAt: Date.now()
 },
 {
 new: true, // Повернути оновлений документ
 runValidators: true // Запустити валідатори схеми
 }
 );

 if (!post) {
 return res.status(404).json({
 success: false,
 message: 'Пост не знайдено'
 });
 }

 res.status(200).json({
 success: true,
 data: post,
 message: 'Пост успішно оновлено'
 });
 } catch (error) {
 res.status(400).json({
 success: false,
 message: error.message
 });
 }
};

// Збільшення лічильника лайків
exports.likePost = async (req, res) => {
 try {
 const post = await Post.findByIdAndUpdate(
 req.params.id,
 { $inc: { likes: 1 } }, // Оператор $inc для збільшення
 { new: true }
 );

 if (!post) {
 return res.status(404).json({
 success: false,
 message: 'Пост не знайдено'
 });
 }

 res.status(200).json({
 success: true,
 data: post,
 message: 'Лайк додано'
 });
 } catch (error) {
 res.status(500).json({
 success: false,
 message: error.message
 });
 }
};

// ==================== DELETE ====================
// Видалення поста та всіх його коментарів
exports.deletePost = async (req, res) => {
 try {
 const post = await Post.findById(req.params.id);

 if (!post) {
 return res.status(404).json({
 success: false,
 message: 'Пост не знайдено'
 });
 }

 // Видаляємо всі коментарі цього поста (каскадне видалення)
 await Comment.deleteMany({ post: post._id });

 // Видаляємо сам пост
 await post.deleteOne();

 res.status(200).json({
 success: true,
 message: 'Пост та всі коментарі видалено'
 });
 } catch (error) {
 res.status(500).json({
 success: false,
 message: error.message
 });
 }
};
