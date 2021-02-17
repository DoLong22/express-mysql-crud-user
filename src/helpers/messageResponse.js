import { v4 as uuidv4 } from 'uuid';
import { logger } from './logger';
import { ErrorCodes } from './constants';

export function respondSuccess(data, message = 'Success') {
    return {
        code: ErrorCodes.ERROR_CODE_SUCCESS,
        message,
        data,
    };
}

export function respondWithError(errorCode, message = 'Error', data = {}) {
    return {
        code: errorCode,
        message,
        errors: data,
    };
}

export function logSystemError(res, error, functionName) {
    const errorObj = {};
    errorObj.id = `${Date.now()}-${uuidv4()}`;
    errorObj.message = error.message;
    errorObj.stack = error.stack;
    errorObj.functionName = functionName;
    logger.error(`Error in ${functionName}: ${JSON.stringify(errorObj)}`);
    return res.json(respondWithError(ErrorCodes.ERROR_CODE_SYSTEM_ERROR, `SYSTEM_ERROR: ${errorObj.id}`));
}
