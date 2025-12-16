import { DataTypes, Model } from 'sequelize';

class Module extends Model {
    static async createModule(data) {
        return await this.create(data);
    }

    static async getModuleById(id) {
        return await this.findByPk(id);
    }

    static async getAllModules() {
        return await this.findAll();
    }

    static async updateModule(id, data) {
        const mod = await this.findByPk(id);
        if (!mod) return null;
        return await mod.update(data);
    }

    static async deleteModule(id) {
        const mod = await this.findByPk(id);
        if (!mod) return null;
        await mod.destroy();
        return true;
    }
}

export default (sequelize) => {
    Module.init(
        {
            course_id: { type: DataTypes.INTEGER, allowNull: false },
            title: { type: DataTypes.STRING, allowNull: false },
            order_index: { type: DataTypes.INTEGER, allowNull: false },
        },
        {
            sequelize,
            modelName: 'Module',
            tableName: 'modules',
            timestamps: true,
            underscored: true,
        }
    );

    return Module;
};
