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
    deleteUserService,
    findUserByEmail,
    findUserByPk,
} from './userService';
import { hashPassword, isValidPassword } from '../auth/authService';

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
        const user = req.body;
        const userId = await findUserByEmail(user.email);
        if (userId) {
            return res
                .status(ErrorCodes.ERROR_CODE_EMAIL_EXIST)
                .json(
                    respondWithError(
                        ErrorCodes.ERROR_CODE_EMAIL_EXIST,
                        i18n.__('auth.login.emailExist'),
                    ),
                );
        }
        const createdUser = await createUser({
            ...user,
            password: hashPassword(user.password),
            createdBy: req.loginUser.id,
            createdAt: new Date(),
        });
        return res.json(respondSuccess(createdUser));
    } catch (error) {
        return logSystemError(res, error, 'userController - create');
    }
}
export async function getDetail(req, res) {
    try {
        const user = await getUserDetail(req.params.id);
        if (!user) {
            return res
                .status(ErrorCodes.ERROR_CODE_ITEM_NOT_EXIST)
                .json(
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
        const user = req.body;
        const userId = await findUserByPk(req.params.id);
        if (!userId) {
            return res
                .status(ErrorCodes.ERROR_CODE_ITEM_NOT_EXIST)
                .json(
                    respondWithError(
                        ErrorCodes.ERROR_CODE_ITEM_NOT_EXIST,
                        i18n.__('user.notFound'),
                    ),
                );
        }
        await updateUser({
            ...user,
            updatedBy: req.loginUser.id,
        }, req.params.id);
        return res.json(respondSuccess());
    } catch (error) {
        return logSystemError(res, error, 'userController - update');
    }
}

export async function updatePassword(req, res) {
    try {
        const { changePassword, oldPassword } = req.body;
        const { id, password } = await findUserByPk(req.params.id);
        if (!id) {
            return res
                .status(ErrorCodes.ERROR_CODE_ITEM_NOT_EXIST)
                .json(
                    respondWithError(
                        ErrorCodes.ERROR_CODE_ITEM_NOT_EXIST,
                        i18n.__('user.notFound'),
                    ),
                );
        }
        if (!isValidPassword(password, oldPassword)) {
            return res
                .status(ErrorCodes.ERROR_CODE_OLD_PASSWORD_NOT_CORRECT)
                .json(
                    respondWithError(
                        ErrorCodes.ERROR_CODE_OLD_PASSWORD_NOT_CORRECT,
                        i18n.__('auth.login.oldPasswordIsNotCorrect'),
                    ),
                );
        }
        await updateUser({
            password: changePassword,
            updatedBy: req.loginUser.id,
        }, id);
        return res.json(respondSuccess());
    } catch (error) {
        return logSystemError(res, error, 'userController - update');
    }
}

export async function deleteUser(req, res) {
    try {
        const { id } = await findUserByPk(req.params.id);
        if (!id) {
            return res
                .status(ErrorCodes.ERROR_CODE_ITEM_NOT_EXIST)
                .json(
                    respondWithError(
                        ErrorCodes.ERROR_CODE_ITEM_NOT_EXIST,
                        i18n.__('user.notFound'),
                    ),
                );
        }
        await deleteUserService(id);
        return res.json(respondSuccess());
    } catch (error) {
        return logSystemError(res, error, 'userController - deleteUser');
    }
}
