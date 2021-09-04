import { APIError } from '../utils/error.util';
const ObjectId = require('mongoose').Types.ObjectId;

const checkReqParam = (req, res, next) => {
    try {
        const id = req.params.id;
        if (id && ObjectId.isValid(id)) next();
        throw new APIError({ message: 'Id wrong!' });
    } catch (error) {
        next(error);
    }
};

export default { checkReqParam };