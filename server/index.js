const express = require('express');
const { get } = require('./src/configs/env.config');
const { connectDB } = require('./src/configs/mongo.config');
const { handleNotFoundPage, handleError } = require('./src/middlewares/error.middleware');
const morgan = require('morgan');
const cors = require('cors');
const userRoute = require('./src/routes/user.route');
const videoRoutes = require('./src/routes/video.route');
const indexRoutes = require('./src/routes/user.route');
const { auth } = require('express-openid-connect');

const config = {
    authRequired: false,
    auth0Logout: true,
    baseURL: get('base_url'),
    clientID: get('client_id'),
    issuerBaseURL: get('auth0_domain'),
    secret: 'LONG_RANDOM_STRING'
}

// config middleware
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(auth(config));

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