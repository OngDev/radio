import UserModel from '../models/user.model.js';
export const createOrUpdateUser = async(nickname, email, picture) => {
    try {
        return await UserModel.findOneAndUpdate({
            email
        }, {
            nickname,
            picture
        }, { upsert: true, new: true });
    } catch (error) {
        console.log(error.message);
    }
}