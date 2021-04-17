module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        fullName: {
            type: DataTypes.STRING,
        },
        phone: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
        },
        password: {
            type: DataTypes.STRING,
        },
        birthday: {
            type: DataTypes.DATE,
        },
        gender: {
            allowNull: false,
            type: DataTypes.ENUM('male', 'female', 'other'),
            defaultValue: 'other',
        },
        createdBy: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            allowNull: true,
        },
        updatedBy: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            allowNull: true,
        },
        deletedAt: {
            type: DataTypes.DATE,
        },
    }, {
        tableName: 'users',
        paranoid: true,
        timestamps: true,
    });
    User.associate = function (models) {
    };
    return User;
};
