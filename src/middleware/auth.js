import config from 'config';
import { respondWithError } from '../helpers/messageResponse';
import { logger } from '../helpers/logger';
import { ErrorCodes } from '../helpers/constants';

const jwt = require('jsonwebtoken');

const SECRET_ACCESS_TOKEN = config.get('auth.secret_access_token');
const SECRET_REFRESH_ACCESS_TOKEN = config.get('auth.secret_refresh_access_token');

function extractToken(authorization = '') {
    if (/^Bearer /.test(authorization)) {
        return authorization.substr(7, authorization.length);
    }
    return '';
}
export const REFRESH_TYPE = 'refresh';
export function authenticate(type = 'token') {
    const isRefresh = type === REFRESH_TYPE;
    return (req, res, next) => {
        try {
            const token = extractToken(req.headers.authorization || '');
            const user = isRefresh
                ? (jwt.verify(token, SECRET_REFRESH_ACCESS_TOKEN))
                : (jwt.verify(token, SECRET_ACCESS_TOKEN));
            // Token is invalid
            if (!user.id) {
                return res.json(respondWithError(ErrorCodes.ERROR_CODE_UNAUTHORIZED, 'ERROR_CODE_UNAUTHORIZED'));
            }

            // Token valid, set user to request
            req.loginUser = user;
            return next();
        } catch (e) {
            logger.error(`Func: authenticate ; error in authenticate: ${e.message}`);
            return res.json(respondWithError(ErrorCodes.ERROR_CODE_UNAUTHORIZED, 'ERROR_CODE_UNAUTHORIZED'));
        }
    };
}
