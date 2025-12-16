import { DataTypes, Model } from 'sequelize';

class LessonFile extends Model {
    static async createFile(data) {
        return await this.create(data);
    }

    static async getFileById(id) {
        return await this.findByPk(id);
    }

    static async getAllFiles() {
        return await this.findAll();
    }

    static async updateFile(id, data) {
        const file = await this.findByPk(id);
        if (!file) return null;
        return await file.update(data);
    }

    static async deleteFile(id) {
        const file = await this.findByPk(id);
        if (!file) return null;
        await file.destroy();
        return true;
    }
}

export default (sequelize) => {
    LessonFile.init(
        {
            lesson_id: { type: DataTypes.INTEGER, allowNull: false },
            file_name: { type: DataTypes.STRING, allowNull: false },
            file_type: { type: DataTypes.STRING, allowNull: false },
        },
        {
            sequelize,
            modelName: 'LessonFile',
            tableName: 'lesson_files',
            timestamps: true,
            underscored: true,
        }
    );

    return LessonFile;
};
