import { respondWithError } from '../../helpers/messageResponse';
import { ErrorCodes } from '../../helpers/constants';

const BaseJoi = require('@hapi/joi');
const Extension = require('@hapi/joi-date');

const Joi = BaseJoi.extend(Extension);

const userFormSchema = {
};

const createValidSchema = Joi.object().keys({
});

const updateValidSchema = Joi.object().keys(userFormSchema);

export async function createValidator(req, res, next) {
    const { body } = req;

    const result = Joi.validate(body, createValidSchema);

    if (result.error) {
        res.json(respondWithError(ErrorCodes.ERROR_CODE_INVALID_PARAMETER, result.error.message, result.error.details));
        return;
    }
    next();
}

export async function updateValidator(req, res, next) {
    const { body } = req;

    const result = Joi.validate(body, updateValidSchema);

    if (result.error) {
        res.json(respondWithError(ErrorCodes.ERROR_CODE_INVALID_PARAMETER, result.error.message, result.error.details));
        return;
    }
    next();
}

const updatePasswordValidSchema = Joi.object().keys({
    password: Joi.string().min(6).max(20).required(),
});

export async function updatePasswordValidator(req, res, next) {
    const { body } = req;

    const result = Joi.validate(body, updatePasswordValidSchema);

    if (result.error) {
        res.json(respondWithError(ErrorCodes.ERROR_CODE_INVALID_PARAMETER, result.error.message, result.error.details));
        return;
    }
    next();
}

const getUserListValidSchema = Joi.object().keys({
});

export async function getUserListValidator(req, res, next) {
    const { query } = req;

    const result = Joi.validate(query, getUserListValidSchema);

    if (result.error) {
        res.json(respondWithError(ErrorCodes.ERROR_CODE_INVALID_PARAMETER, result.error.message, result.error.details));
        return;
    }
    next();
}
