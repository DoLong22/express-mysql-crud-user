import i18n from 'i18n';
import { ErrorCodes } from '../../helpers/constants';
import {
    respondWithError,
    respondSuccess,
    logSystemError,
} from '../../helpers/messageResponse';

import {
    getUsers,
    getUserDetail,
    updateUser,
    createUser,
    deleteUserSv,
} from './userService';

export async function getListUser(req, res) {
    try {
        const users = await getUsers(req.query);
        return res.json(respondSuccess(users));
    } catch (error) {
        return res.json(
            logSystemError(res, error, 'userController - getListUser'),
        );
    }
}

export async function create(req, res) {
    try {
        const user = await createUser({
            payload: req.body,
            createdBy: req.loginUser,
        });
        if (!user) {
            return res.json(
                respondWithError(
                    ErrorCodes.ERROR_CODE_EMAIL_EXIST,
                    i18n.__('auth.login.emailExist'),
                ),
            );
        }
        return res.json(respondSuccess(user));
    } catch (error) {
        return logSystemError(res, error, 'userController - create');
    }
}
export async function getDetail(req, res) {
    try {
        const user = await getUserDetail(req.params.id);
        if (!user) {
            return res.json(
                respondWithError(
                    ErrorCodes.ERROR_CODE_ITEM_NOT_EXIST,
                    i18n.__('user.notFound'),
                ),
            );
        }
        return res.json(respondSuccess(user));
    } catch (error) {
        return logSystemError(res, error, 'userController - getDetail');
    }
}
export async function update(req, res) {
    try {
        const isUpdate = await updateUser({
            payload: req.body,
            idUser: req.params.id,
            updatedBy: req.loginUser,
        });
        if (!isUpdate) {
            return res.json(
                respondWithError(
                    ErrorCodes.ERROR_CODE_ITEM_NOT_EXIST,
                    i18n.__('user.notFound'),
                ),
            );
        }
        return res.json(respondSuccess());
    } catch (error) {
        return logSystemError(res, error, 'userController - update');
    }
}

export async function updatePassword(req, res) {
    try {
        const isUpdated = await updateUser({
            payload: req.body,
            idUser: req.params.id,
            updateBy: req.loginUser,
        });
        if (!isUpdated) {
            return res.json(
                respondWithError(
                    ErrorCodes.ERROR_CODE_EMAIL_EXIST,
                    i18n.__('user.notFound'),
                ),
            );
        }
        return res.json(respondSuccess());
    } catch (error) {
        return logSystemError(res, error, 'userController - update');
    }
}

export async function deleteUser(req, res) {
    try {
        const isDelete = await deleteUserSv(req.params.id);
        if (!isDelete) {
            return res.json(
                respondWithError(
                    ErrorCodes.ERROR_CODE_EMAIL_EXIST,
                    i18n.__('user.notFound'),
                ),
            );
        }
        return res.json(respondSuccess(isDelete));
    } catch (error) {
        return logSystemError(res, error, 'userController - deleteUser');
    }
}
