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
    }, {
        tableName: 'users',
    });
    User.associate = function (models) {
        // define association of this model
    };
    return User;
};
