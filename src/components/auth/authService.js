import config from 'config';
import { logger } from '../../helpers/logger';

const bCrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require('../../models');

const SECRET_ACCESS_TOKEN = config.get('auth.secret_access_token');
const SECRET_ACCESS_TOKEN_EXPIRE = config.get('auth.secret_access_token_expire');
const SECRET_REFRESH_ACCESS_TOKEN = config.get('auth.secret_refresh_access_token');
const SECRET_REFRESH_ACCESS_TOKEN_EXPIRE = config.get('auth.secret_refresh_access_token_expire');

export function isValidPassword(userpass, password) {
    return bCrypt.compareSync(password, userpass);
}
export function hashPassword(password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
}

export async function saveToken(user, token, type = 'refresh_token') {
    try {
        const tokenDate = {
            userId: user.id,
            email: user.email,
            type,
            token,
        };
        const newToken = await models.UserToken.create(tokenDate);
        return newToken;
    } catch (e) {
        logger.error(`Error in saveRefreshToken ${e.message}`);
        throw e;
    }
}

export async function destroyToken(tokenId) {
    try {
        await models.UserToken.destroy({
            where: {
                id: tokenId,
            },
        });
        return {
            success: true,
        };
    } catch (e) {
        logger.error(`Error in saveRefreshToken ${e.message}`);
        throw e;
    }
}

export async function checkIfTokenExist(user, token, type = 'refresh_token') {
    try {
        const tokenData = await models.UserToken.findOne({
            attributes: ['id'],
            where: {
                token,
                type,
                userId: user.id,
                email: user.email,
            },
        });
        return tokenData;
    } catch (e) {
        logger.error(`Error in checkIfTokenExist ${e.message}`);
        throw e;
    }
}

export async function signToken(user) {
    try {
        // sign token
        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_ACCESS_TOKEN, {
            expiresIn: SECRET_ACCESS_TOKEN_EXPIRE,
        });
        const rToken = jwt.sign({ id: user.id, email: user.email }, SECRET_REFRESH_ACCESS_TOKEN, {
            expiresIn: SECRET_REFRESH_ACCESS_TOKEN_EXPIRE,
        });
        return { token, rToken };
    } catch (e) {
        logger.error(`Error in signToken ${e.message}`);
        throw e;
    }
}

export function userAuthInfo(user, token, rToken) {
    const tokenExpiredAt = new Date();
    tokenExpiredAt.setSeconds(tokenExpiredAt.getSeconds() + +SECRET_ACCESS_TOKEN_EXPIRE);
    const refreshTokenExpiredAt = new Date();
    refreshTokenExpiredAt.setSeconds(tokenExpiredAt.getSeconds() + +SECRET_REFRESH_ACCESS_TOKEN_EXPIRE);
    // return data
    return {
        accessToken: {
            token,
            expiresIn: SECRET_ACCESS_TOKEN_EXPIRE,
            expiredAt: tokenExpiredAt.getTime(),
        },
        refreshToken: {
            token: rToken,
            expiresIn: SECRET_REFRESH_ACCESS_TOKEN_EXPIRE,
            expiredAt: refreshTokenExpiredAt.getTime(),
        },
        profile: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            phone: user.phone,
            birthday: user.birthday,
            role: user.role,
        },
    };
}
