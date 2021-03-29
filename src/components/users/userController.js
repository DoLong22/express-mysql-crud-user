import i18n from 'i18n';
import { ErrorCodes } from '../../helpers/constants';
import {
    respondWithError,
    respondSuccess,
    logSystemError,
} from '../../helpers/messageResponse';

import { hashPassword } from '../auth/authService';
import { getUserDetail, findUserByEmail } from './userService';

const models = require('../../models');

export async function getList(req, res) {
    try {
        const { page, limit = 10 } = req.query;
        const users = await models.User.findAll({
            limit,
            offset: page * limit,
        });
        return res.json(
            respondSuccess({ items: users, totalItems: limit }),
        );
    } catch (error) {
        return logSystemError(res, error, 'userController - getList');
    }
}

export async function create(req, res) {
    try {
        const {
            fullName, birthday, phone, gender, email,
        } = req.body;
        const password = hashPassword(req.body.password);
        const user = await findUserByEmail(email);
        if (user) {
            return res.json(respondWithError(ErrorCodes.ERROR_CODE_EMAIL_EXIST, i18n.__('Email exist'), {}));
        }
        await models.User.create({
            fullName, birthday, phone, gender, email, password,
        });
        return res.json(respondSuccess({}));
    } catch (error) {
        return logSystemError(res, error, 'userController - create');
    }
}
export async function getDetail(req, res) {
    try {
        const user = await getUserDetail(req.params.id);
        return res.json(respondSuccess(user));
    } catch (error) {
        return logSystemError(res, error, 'userController - getDetail');
    }
}
export async function update(req, res) {
    try {
        const {
            fullName, gender, email, phone, birthday,
        } = req.body;
        const password = hashPassword(req.body.password);
        const user = await models.User.update({
            fullName, gender, email, phone, birthday, password,
        }, {
            where: {
                id: req.params.id,
            },
        });
        return res.json(respondSuccess(user));
    } catch (error) {
        return logSystemError(res, error, 'userController - update');
    }
}

export async function updatePassword(req, res) {
    try {
        const newPassword = hashPassword(req.body.password);
        const user = await models.User.update({
            password: newPassword,
        }, {
            where: {
                id: req.params.id,
            },
        });
        return res.json(respondSuccess(user));
    } catch (error) {
        return logSystemError(res, error, 'userController - update');
    }
}

export async function deleteUser(req, res) {
    try {
        const { id } = req.params;
        const isDelete = await models.User.destroy({ where: { id } });
        return res.json(respondSuccess(isDelete));
    } catch (error) {
        return logSystemError(res, error, 'userController - deleteUser');
    }
}
