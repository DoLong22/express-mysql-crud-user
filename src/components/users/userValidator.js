import { orderBy } from 'lodash';
import { respondWithError } from '../../helpers/messageResponse';
import { ErrorCodes } from '../../helpers/constants';
import { genders, sortBy, sortDirection } from './userConstant';

const BaseJoi = require('@hapi/joi');
const Extension = require('@hapi/joi-date');

const Joi = BaseJoi.extend(Extension);

const userFormSchema = {
    fullName: Joi.string().max(255).required(),
    birthday: Joi.date()
        .less('now')
        .min('1900-01-01')
        .format('YYYY-MM-DD')
        .allow(null)
        .optional(),
    phone: Joi.string()
        .regex(/^(09|01[2|6|8|9])+([0-9]{7,8})\b$/)
        .max(20)
        .allow(null)
        .optional(),
    gender: Joi.string()
        .valid(genders.MALE, genders.FEMALE, genders.OTHER)
        .allow(null)
        .optional(),
};

const createValidSchema = Joi.object().keys({
    email: Joi.string()
        .regex(/\S+@\S+\.\S+/)
        .required(),
    password: Joi.string().min(8).required(),
    ...userFormSchema,
});

const updateValidSchema = Joi.object().keys(userFormSchema);

export async function createValidator(req, res, next) {
    const { body } = req;
    const result = Joi.validate(body, createValidSchema);
    if (result.error) {
        console.log(result.error);
        res.status(ErrorCodes.ERROR_CODE_INVALID_PARAMETER).json(
            respondWithError(
                ErrorCodes.ERROR_CODE_INVALID_PARAMETER,
                result.error.message,
                result.error.details,
            ),
        );
        return;
    }
    next();
}

export async function updateValidator(req, res, next) {
    const { body } = req;
    const result = Joi.validate(body, updateValidSchema);
    if (result.error) {
        console.log(result.error);
        res.status(ErrorCodes.ERROR_CODE_INVALID_PARAMETER).json(
            respondWithError(
                ErrorCodes.ERROR_CODE_INVALID_PARAMETER,
                result.error.message,
                result.error.details,
            ),
        );
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
        res.json(
            respondWithError(
                ErrorCodes.ERROR_CODE_INVALID_PARAMETER,
                result.error.message,
                result.error.details,
            ),
        );
        return;
    }
    next();
}

const getUserListValidSchema = Joi.object().keys({
    page: Joi.number().integer(),
    limit: Joi.number().min(10).max(1000).integer(),
    keyword: Joi.optional(),
    orderBy: Joi.valid(sortBy.ID, sortBy.FULLNAME).optional(),
    orderDirection: Joi.allow('').valid(sortDirection.DESC, sortDirection.ASC).optional(),
});

export async function getUserListValidator(req, res, next) {
    const { query } = req;
    const result = Joi.validate(query, getUserListValidSchema);
    if (result.error) {
        res.json(
            respondWithError(
                ErrorCodes.ERROR_CODE_INVALID_PARAMETER,
                result.error.message,
                result.error.details,
            ),
        );
        return;
    }
    next();
}
