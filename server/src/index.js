const express = require('express');
const { get } = require('./configs/env.config');
const { connectDB } = require('./configs/mongo.config');
const { handleNotFoundPage, handleError } = require('./middlewares/error.middleware');
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const { getUser } = require('./middlewares/user.middleware');
const userRoute = require('./routes/user.route');
const authRoute = require('./routes/auth.route');
const videoRoutes = require('./routes/video.route');
const indexRoutes = require('./routes/user.route');

// config middleware
const app = express();
const sess = {
	secret: 'CHANGE THIS TO A RANDOM SECRET',
	cookie: {},
	resave: false,
	saveUninitialized: true,
};
if (app.get('env') === 'production') {
	// Use secure cookies in production (requires SSL/TLS)
	sess.cookie.secure = true;

	// Uncomment the line below if your application is behind a proxy (like on Heroku)
	// or if you're encountering the error message:
	// "Unable to verify authorization request state"
	// app.set('trust proxy', 1);
}
app.use(session(sess));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

var strategy = new Auth0Strategy(
	{
		domain: process.env.AUTH0_DOMAIN,
		clientID: process.env.AUTH0_CLIENT_ID,
		clientSecret: process.env.AUTH0_CLIENT_SECRET,
		callbackURL: process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback',
	},
	function (accessToken, refreshToken, extraParams, profile, done) {
		// accessToken is the token to call Auth0 API (not needed in the most cases)
		// extraParams.id_token has the JSON Web Token
		// profile has all the information from the user
		return done(null, profile);
	}
);

passport.use(strategy);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (user, done) {
	done(null, user);
});

// connect DB
connectDB();

// config routes
app.use(getUser());
app.use('/auth', authRoute());
app.use('/video', videoRoutes());
app.use('/user', userRoute());
app.use('/', indexRoute());

// handler error
app.use(handleNotFoundPage);
app.use(handleError);

// start app
const port = get('port');
app.listen(port, () => console.log(`Server start at port ${port}`));
