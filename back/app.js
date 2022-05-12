const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const express = require('express');
const app = express();
const port = 3500;
const passportInit = require('./passport');
const authController = require('./auth.controller');
const knex = require('./knex');
const bcrypt = require('bcrypt');
const middlewares = require('./middlewares');

require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
passportInit();

// app.post('/login', authController.login);

// 이과정에 대한 소스? (API 문서)  가 필요 .. 홈페이지에는 이에 대한 정보가 없음
app.post('/login', (req, res, next) => {
  passport.authenticate('local-login', (err, user, info) => {
    if (err) {
      console.log(err);
      return next(err);
    }
    if (info) {
      return res.status(401).send(info.reason);
    }

    return req.login(user, async (loginErr) => {
      // passport의 로그인 (우리거아님)
      if (loginErr) {
        console.log(loginErr);
        return next(loginErr);
      }
      console.log('로그인 완료', user);

      return res.status(200).json({ userIdx: user.user_idx });
    });
  })(req, res, next);
});

app.post('/join', async (req, res) => {
  try {
    const { userId: id, email, name } = req.body;
    const hashedPassword = await bcrypt.hash(req.body.password, 11);

    console.log(id);

    const result = await knex('User').insert({
      id,
      email,
      name,
      phone: '1211234',
      password: hashedPassword,
    });
    console.log(result);
  } catch (err) {
    console.log(err);
  }
});
app.get('/board', middlewares.isLoggedIn, async (req, res) => {
  const result = await knex
    .select(
      'board_idx',
      'User.user_idx',
      'title',
      'contents',
      'create_date',
      'view_cnt',
      'img_path',
      'User.id',
      'User.name',
      'User.email'
    )
    .from('Board')
    .innerJoin('User', 'Board.user_idx', 'User.user_idx')
    .orderBy('create_date', 'desc');

  console.log('게시판 ', result);
  res.status(201).json(result);
});

app.post('/board', async (req, res) => {
  // const result = await knex.select().from('Board').orderBy('create_date');

  // res.status(201).json(result);

  try {
    const { title, contents, userIdx } = req.body;
    console.log(userIdx);

    const result = await knex('Board').insert({
      title,
      contents,
      user_idx: userIdx,
    });
    console.log(result);
    // 반드시 응답을 해줘야 react query에서 그 응답값으로 성공 실패 여부를 알수있음!!!!!
    res.status(201).json(result);
  } catch (err) {
    console.log(err);
  }
});

app.delete('/board/:boardIdx', async (req, res) => {
  // const result = await knex.select().from('Board').orderBy('create_date'); req.params

  // res.status(201).json(result);
  try {
    const result = await knex('Board')
      .where({
        board_idx: req.params.boardIdx,
      })
      .del();
    console.log(result);
    // 반드시 응답을 해줘야 react query에서 그 응답값으로 성공 실패 여부를 알수있음!!!!!
    res.status(201).json(result);
  } catch (err) {
    console.log(err);
  }
});

app.get('/', authController.verifyToken, (req, res) => {
  res.send('<h1>당신은 인가된 사람입니다!</h1>');
});

app.listen(port, () => {
  console.log('listen port... ', port);
});
