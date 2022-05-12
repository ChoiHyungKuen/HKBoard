const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const knex = require('./knex');
const bcrypt = require('bcrypt');

module.exports = () => {
  passport.serializeUser(function (user, done) {
    console.log(user);
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const result = await knex.select().from('User').where('id', id);

      console.log(result);
      done(null, result);
    } catch (err) {
      console.log(err);
      done(err);
    }
  });

  passport.use(
    'local-login',
    new LocalStrategy(
      {
        usernameField: 'userId',
        passwordField: 'password',
      },
      async (userId, password, done) => {
        try {
          const result = await knex.select().from('User').where('id', userId);
          console.log(result);
          if (result.length === 0) {
            console.log('없는 아이디');
            return done(null, false, { reason: '존재하지 않는 아이디 입니다!' });
          }
          const user = result[0];

          console.log('유저 ', user.password);
          console.log('입력 ', password);

          const compareResult = await bcrypt.compare(password, user.password);
          console.log(compareResult);
          if (compareResult) {
            console.log('성공!');
            return done(null, user);
          } else {
            console.log('실패');
            return done(null, false, { reason: '비밀번호가 틀렸습니다.' });
          }
        } catch (error) {
          console.log(error);
          return done(error);
        }
      }
    )
  );
};
