import { authenticate } from '../../middleware/auth';
import {
    getList, create, update, deleteUser, getDetail, updatePassword,
} from './userController';
import {
    createValidator, updateValidator, updatePasswordValidator, getUserListValidator,
} from './userValidator';

const express = require('express');

module.exports = (app) => {
    const router = express.Router();
    router.get('/', authenticate(), getUserListValidator, getList);
    router.post('/', authenticate(), createValidator, create);
    router.get('/:id', authenticate(), getDetail);
    router.patch('/:id', authenticate(), updateValidator, update);
    router.patch('/:id/password', authenticate(), updatePasswordValidator, updatePassword);
    router.delete('/:id', authenticate(), deleteUser);
    app.use('/api/user', router);
};
