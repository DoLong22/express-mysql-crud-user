import {
    respondSuccess,
    logSystemError,
} from '../../helpers/messageResponse';

export async function getList(req, res) {
    try {
        return res.json(
            respondSuccess({ items: [], totalItems: 0 }),
        );
    } catch (error) {
        return logSystemError(res, error, 'userController - getList');
    }
}

export async function create(req, res) {
    try {
        return res.json(respondSuccess({}));
    } catch (error) {
        return logSystemError(res, error, 'userController - create');
    }
}
export async function getDetail(req, res) {
    try {
        return res.json(respondSuccess({}));
    } catch (error) {
        return logSystemError(res, error, 'userController - getDetail');
    }
}
export async function update(req, res) {
    try {
        return res.json(respondSuccess());
    } catch (error) {
        return logSystemError(res, error, 'userController - update');
    }
}

export async function updatePassword(req, res) {
    try {
        return res.json(respondSuccess());
    } catch (error) {
        return logSystemError(res, error, 'userController - update');
    }
}

export async function deleteUser(req, res) {
    try {
        return res.json(respondSuccess());
    } catch (error) {
        return logSystemError(res, error, 'userController - deleteUser');
    }
}
