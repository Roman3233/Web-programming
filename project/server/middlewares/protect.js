const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {

  try {

    // 1. Отримати токен з заголовка

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Доступ заборонено. Токен відсутній'
      });
    }


    const token = authHeader.split(' ')[1];


    // 2. Верифікувати токен

    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    // 3. Знайти користувача за id з токена

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Користувача не знайдено'
      });
    }


    // 4. Додати користувача до запиту

    req.user = user;
    next();


  } catch (err) {

    res.status(401).json({
      success: false,
      message: 'Недійсний токен'
    });
  }
};


module.exports = protect;