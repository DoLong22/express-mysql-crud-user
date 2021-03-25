import { logger } from '../../helpers/logger';

const Sequelize = require('sequelize');

const { Op } = Sequelize;

const models = require('../../models');

const userAttributes = ['id', 'email'];

// get user detail
export async function getUserDetail(id) {
    try {
        const user = await models.User.findByPk(id, {
            attributes: userAttributes,
            raw: true,
        });
        return user;
    } catch (e) {
        logger.error(`Error in getUserDetail ${e.message}`);
        throw e;
    }
}
