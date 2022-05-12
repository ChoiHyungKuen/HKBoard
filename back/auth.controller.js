const jwt = require('jsonwebtoken');
const knex = require('./knex');

require('dotenv').config();
exports.login = async (req, res, next) => {
  const { userId, password } = req.body;

  try {
    const result = await knex.select().from('User').where('id', userId);

    if (!result) {
      // return done(null, flase, { reason: '존재하지 않는 이메일 입니다.!' });
    }
    const user = result[0];

    // console.log('유저 ', user.password);
    // console.log('입력 ', password);
    //임시
    if (user.password === password) {
      console.log('성공!');
      const token = jwt.sign(
        {
          id: user.id,
        },
        process.env.SECRET_KEY,
        {
          expiresIn: '1h',
        }
      );

      res.cookie('user', token);
      res.status(200).json({
        result: 'ok',
        token,
      });
      // return done(null, user);
    } else {
      console.log('실패');
      // return done(null, false, 'D?');
    }
  } catch (error) {
    console.log(error);
    // return done(error);
  }
};

exports.verifyToken = (req, res, next) => {
  try {
    const clientToken = req.cookies.user;
    console.log(clientToken);
    const decoded = jwt.verify(clientToken, process.env.SECRET_KEY);
    if (decoded) {
      next();
    } else {
      res.status(401).json({ error: 'unauthorized' });
    }
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: 'token expired' });
  }
};
