import { DataTypes, Model } from 'sequelize';

class User extends Model {
    static async createUser(data) {
        return await this.create(data);
    }

    static async getUserById(id) {
        return await this.findByPk(id);
    }

    static async getAllUsers() {
        return await this.findAll();
    }

    static async updateUser(id, data) {
        const user = await this.findByPk(id);
        if (!user) return null;
        return await user.update(data);
    }

    static async deleteUser(id) {
        const user = await this.findByPk(id);
        if (!user) return null;
        await user.destroy();
        return true;
    }
}

export default (sequelize) => {
    User.init(
        {
            email: { type: DataTypes.STRING, allowNull: false, unique: true },
            password_hash: { type: DataTypes.STRING, allowNull: false },
            first_name: { type: DataTypes.STRING, allowNull: false },
            last_name: { type: DataTypes.STRING, allowNull: false },
            avatar_url: { type: DataTypes.STRING },
            role: { type: DataTypes.ENUM('student', 'teacher', 'admin'), allowNull: false },
            bio: { type: DataTypes.TEXT },
            experience_years: { type: DataTypes.INTEGER, defaultValue: 0},
        },
        {
            sequelize,
            modelName: 'User',
            tableName: 'users',
            timestamps: true,
            underscored: true,
        }
    );

    return User;
};
