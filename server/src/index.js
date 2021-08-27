const express = require('express');
const { get } = require('./configs/env.config');
const { connectDB } = require('./configs/mongo.config');
const { handleNotFoundPage, handleError } = require('./middlewares/error.middleware');
const morgan = require('morgan');
const cors = require('cors');
const userRoute = require('./routes/user.route');
const videoRoutes = require('./routes/video.route');
const indexRoutes = require('./routes/user.route');

// config middleware
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// connect DB
connectDB();

// config routes
app.use('/video', videoRoutes());
app.use('/user', userRoute());
app.use('/', indexRoutes());

// handler error
app.use(handleNotFoundPage);
app.use(handleError);

// start app
const port = get('port');
app.listen(port, () => console.log(`Server start at port ${port}`));
