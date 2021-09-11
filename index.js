import express from 'express';
import get from './src/configs/env.config.js';
import { connectDB } from './src/configs/mongo.config.js';
import { handleNotFoundPage, handleError } from './src/middlewares/error.middleware.js';
import morgan from 'morgan';
import userRoute from './src/routes/user.route.js';
import videoRoutes from './src/routes/video.route.js';
import { getPlayingVideo, getTracksInQueue, getSenior, getJunior, getOther } from './src/services/video.service.js';
import oidc from 'express-openid-connect';
const auth = oidc.auth;
import { createServer } from 'http';
import { Server } from "socket.io";
import * as fs from 'fs';
import moment from 'moment';

const config = {
    authRequired: false,
    auth0Logout: true,
    baseURL: get('base_url'),
    clientID: get('client_id'),
    issuerBaseURL: get('auth0_domain'),
    secret: get('secret'),
}

// config middleware
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
io.on('connection', (client) => {
    const tracks = getTracksInQueue();
    client.emit('update-tracks', tracks)
    const { playingVideo, playedTime } = getPlayingVideo();
    client.emit('playingVideo', {
        playingVideo,
        playedTime
    });
    io.emit('senior-tracks-update', getSenior());
    io.emit('junior-tracks-update', getJunior());
    io.emit('other-tracks-update', getOther());

    var clientIpAddress = client.request.headers['x-forwarded-for'] || client.request.connection.remoteAddress;
    fs.appendFile('address.txt', `New connection from ${clientIpAddress} at ${moment().format()} \n`, function(err) {
        if (err) console.log(err.message);
    });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(auth(config));
app.use(express.static('public'))

// connect DB
connectDB();

// config routes
app.use('/video', videoRoutes());
app.use('/user', userRoute());

app.get("/login", (req, res) => {
    res.oidc.login();
});
app.get("/logout", (req, res) => {
    req.oidc.logout();
});

// handler error
app.use(handleNotFoundPage);
app.use(handleError);

// start app
const port = get('port');

httpServer.listen(port, () => console.log(`Server start at port ${port}`));

export default io;