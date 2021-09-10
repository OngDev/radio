import { connectDB, disconnectDB } from '../configs/mongo.config.js';
await connectDB();
import UserModel from '../models/user.model.js';
import VideoModel from '../models/video.model.js';

const migrateVotes = async() => {
    const videos = await VideoModel.find({});
    for (let index = 0; index < videos.length; index++) {
        const video = videos[index];
        const existedUser = await UserModel.findOne({ email: video.authorEmail });
        if (existedUser) {
            video.user = existedUser;
        } else {
            const newUserForVideo = await UserModel.create({
                email: video.authorEmail,
                nickname: 'unknown',
                picture: 'unknown'
            });
            video.user = newUserForVideo;
        }
        const mappedLikes = [];
        for (let i = 0; i < video.likes.length; i++) {
            try {
                const like = video.likes[i];
                if (like.includes('@')) {
                    const user = await UserModel.findOne({ email: like });
                    if (!user) {
                        console.log('Create new user')
                        const newUser = await UserModel.create({
                            email: like,
                            nickname: 'unknown',
                            picture: 'unknown'
                        });
                        console.log(`User: ${newUser}`)
                        mappedLikes.push(newUser._id.toString());
                        continue;
                    };
                    if (video.likes.indexOf(user._id.toString()) === -1) {
                        mappedLikes.push(user._id.toString());
                    }
                } else {
                    mappedLikes.push(like);
                }
            } catch (error) {
                console.error(error.message);
            }
        }
        console.log(mappedLikes);
        video.likes = mappedLikes;

        const mappedDislikes = [];
        for (let i = 0; i < video.dislikes.length; i++) {
            try {
                const dislike = video.dislikes[i];
                if (dislike.includes('@')) {
                    console.log(dislike)
                    const user = await UserModel.findOne({ email: dislike });
                    if (!user) {
                        const newUser = await UserModel.create({
                            email: dislike,
                            nickname: 'unknown',
                            picture: 'unknown'
                        });
                        mappedDislikes[i] = newUser._id.toString();;
                        continue;
                    };
                    if (video.dislikes.indexOf(user._id.toString()) === -1) {
                        mappedDislikes[i] = user._id.toString();
                    }
                } else {
                    mappedDislikes[i] = dislike;
                }
            } catch (error) {
                console.error(error.message);
            }
        }
        video.dislikes = mappedDislikes;
        await video.save();
    }
    process.exit()
}

(async() => {
    console.log("start migration")
    await migrateVotes();
    await disconnectDB();
})();