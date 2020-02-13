const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const flash = require('connect-flash');
const hbs = require('hbs');

const userLocals = require('./configs/user-locals');

const app = express();

require('./configs/db.config');
require('./configs/passport.config')(app);
app.use(userLocals);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(flash());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const index = require('./routes/index.routes');
const authRoutes = require('./routes/auth.routes');
const filesRoutes = require('./routes/files.routes');
const postsRoutes = require('./routes/posts.routes');
const commentsRoutes = require('./routes/comments.routes');
app.use('/', index);
app.use('/', authRoutes);
app.use('/files', filesRoutes);
app.use('/posts', postsRoutes);
app.use('/comments', commentsRoutes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
