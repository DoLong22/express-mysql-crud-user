import { logger } from '../../helpers/logger';

const Sequelize = require('sequelize');

const { Op } = Sequelize;

const models = require('../../models');

const userAttributes = [
    'id',
    'email',
    'fullName',
    'gender',
    'birthday',
    'phone',
];

// get user detail
export async function getUserDetail(id) {
    try {
        return await models.User.findByPk(id, {
            attributes: userAttributes,
            raw: true,
        });
    } catch (e) {
        logger.error(`Error in getUserDetail ${e.message}`);
        throw e;
    }
}
export async function findUserByEmail(email) {
    try {
        return await models.User.findOne({
            attributes: ['id'],
            where: {
                email,
            },
        });
    } catch (e) {
        logger.error(`Error in findUserByEmail ${e.message}`);
        throw e;
    }
}
export async function findUserByPk(id) {
    try {
        return await models.User.findByPk(id, {
            attributes: ['id', 'password'],
            raw: true,
        });
    } catch (e) {
        logger.error(`Error in findUserByPk ${e.message}`);
        throw e;
    }
}
export async function getUsers(query) {
    try {
        const {
            page = 0,
            limit = 10,
            keyword,
            orderBy = 'id',
            orderDirection = 'ASC',
        } = query;
        const order = [[orderBy, orderDirection]];
        let where;
        if (keyword) {
            where = {
                [Op.or]: [
                    { fullName: { [Op.like]: `%${keyword}%` } },
                    { email: { [Op.like]: `%${keyword}%` } },
                    { phone: { [Op.like]: `%${keyword}%` } },
                ],
            };
        }
        const users = await models.User.findAndCountAll({
            attributes: userAttributes,
            order,
            where,
            limit: +limit,
            offset: +page * +limit,
            raw: true,
        });
        return { users: users.rows, totalCount: users.count };
    } catch (e) {
        logger.error(`Error in getUsers ${e.message}`);
        throw e;
    }
}

export async function createUser(user) {
    try {
        return await models.User.create(user);
    } catch (error) {
        logger.error(`Error in createUser ${error.message}`);
        throw error;
    }
}

export async function updateUser(user, id) {
    try {
        return await models.User.update(
            user,
            {
                where: {
                    id,
                },
            },
        );
    } catch (error) {
        logger.error(`Error in updateUser ${error.message}`);
        throw error;
    }
}

export async function deleteUserService(id) {
    try {
        return await models.User.destroy({
            where: { id },
        });
    } catch (error) {
        logger.error(`Error in deleteUSer ${error.message}`);
        throw error;
    }
}
