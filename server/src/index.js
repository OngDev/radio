const express = require('express');
const { get } = require('./configs/env.config');
const { connectDB } = require('./configs/mongo.config');
const { handleNotFoundPage, handleError } = require('./middlewares/error.middleware');
const videoRoutes = require('./routes/video.route');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

connectDB();

app.use('/video', videoRoutes());

app.get((req, res, next) => {
	return res.json('Hello World!');
});

app.use(handleNotFoundPage);
app.use(handleError);

const port = get('port');
app.listen(port, () => console.log(`Server start at port ${port}`));
