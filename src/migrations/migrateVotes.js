import UserModel from '../models/user.model.js';
import VideoModel from '../models/video.model.js';

const migrateVotes = async() => {
    const videos = await VideoModel.find();
    for (let index = 0; index < videos.length; index++) {
        const video = videos[index];
        video.likes = video.likes.map((like) => {
            if (like.includes('@')) {
                const user = await UserModel.find({ email: like });
                if (!user) return 'unknown';
                return user._id.toString();
            }
        });
        video.dislikes = video.likes.map((like) => {
            if (like.includes('@')) {
                const user = await UserModel.find({ email: like });
                if (!user) return 'unknown';
                return user._id.toString();
            }
        });
        video.save();
    }
}