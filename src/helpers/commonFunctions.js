import { Op } from 'sequelize';
import config from 'config';
import bCrypt from 'bcrypt';
import CryptoJS from 'crypto-js';
import { logger } from './logger';

const cryptoPassword = config.get('auth.secret_crypto_password');

export async function checkIfValueExist(model, value, field = 'id', params = {}) {
    try {
        if (value === undefined) throw new Error('Search value in checkIfValueExist function cannot be undefined');
        const {
            excludeField = null, excludeValues = [], attributes = ['id'], paranoid = false, // Take solf-deleted items
        } = params;
        const whereValue = excludeField
            ? { [field]: value, [excludeField]: { [Op.notIn]: excludeValues } }
            : { [field]: value };
        return await model.findOne({ attributes, where: whereValue, paranoid });
    } catch (e) {
        logger.error(`----> Error in checkIfValueExist ${e.message}`);
        throw e;
    }
}

export async function updateDataAfterDelete(model, field, currentValue, afterDeleteValue = null) {
    try {
        return await model.update({ [field]: afterDeleteValue }, { where: { [field]: currentValue } });
    } catch (e) {
        logger.error(`----> Error in updateDataAfterDelete ${e.message}`);
        throw e;
    }
}

export function encryptPassword(password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
}

export function encryptCrypto(secretString) {
    return CryptoJS.AES.encrypt(secretString, cryptoPassword).toString();
}

export function decryptCrypto(encryptedString) {
    const bytes = CryptoJS.AES.decrypt(encryptedString, cryptoPassword);
    return bytes.toString(CryptoJS.enc.Utf8);
}
export function encodeCSVData(value = '') {
    // Replace all " -> ""
    const convertValue = value.replace('"', '""');
    // Add " at first & last of value
    const result = `"${convertValue}"`;
    return result;
}
