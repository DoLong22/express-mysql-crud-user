import { logger } from '../../helpers/logger';
import { hashPassword } from '../auth/authService';

const Sequelize = require('sequelize');

const { Op } = Sequelize;

const models = require('../../models');

const userAttributes = [
    'id',
    'email',
    'password',
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
            where: {
                email,
            },
        });
    } catch (e) {
        logger.error(`Error in findUserByEmail ${e.message}`);
        throw e;
    }
}
export async function getUsers(query) {
    try {
        const {
            page,
            limit,
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
            offset: page * limit,
            raw: true,
        });
        return { users: users.rows, totalCount: users.count };
    } catch (e) {
        logger.error(`Error in getUsers ${e.message}`);
        throw e;
    }
}

export async function createUser({ payload, createdBy }) {
    try {
        const {
            fullName, birthday, phone, gender, email, password,
        } = payload;
        const user = await findUserByEmail(email);
        if (user) {
            return null;
        }
        return await models.User.create({
            fullName,
            birthday,
            phone,
            gender,
            email,
            password: hashPassword(password),
            createdBy: createdBy.id,
            createdAt: new Date(),
        });
    } catch (error) {
        logger.error(`Error in createUser ${error.message}`);
        throw error;
    }
}

export async function updateUser({ payload, idUser, updatedBy }) {
    try {
        const user = await models.User.findByPk(idUser);
        if (!user) {
            return null;
        }
        if (payload.password) {
            payload.password = hashPassword(payload.password);
        }
        return await models.User.update(
            { ...payload, updatedBy: updatedBy.id },
            {
                where: {
                    id: idUser,
                },
            },
        );
    } catch (error) {
        logger.error(`Error in updateUser ${error.message}`);
        throw error;
    }
}

export async function deleteUserSv(id) {
    try {
        const user = await models.User.findByPk(id);
        if (!user) {
            return null;
        }
        return await models.User.destroy({
            where: { id },
        });
    } catch (error) {
        logger.error(`Error in deleteUSer ${error.message}`);
        throw error;
    }
}
