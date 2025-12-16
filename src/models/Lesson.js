import { DataTypes, Model } from 'sequelize';

class Lesson extends Model {
    static async createLesson(data) {
        return await this.create(data);
    }

    static async getLessonById(id) {
        return await this.findByPk(id);
    }

    static async getAllLessons() {
        return await this.findAll();
    }

    static async updateLesson(id, data) {
        const lesson = await this.findByPk(id);
        if (!lesson) return null;
        return await lesson.update(data);
    }

    static async deleteLesson(id) {
        const lesson = await this.findByPk(id);
        if (!lesson) return null;
        await lesson.destroy();
        return true;
    }
}

export default (sequelize) => {
    Lesson.init(
        {
            module_id: { type: DataTypes.INTEGER, allowNull: false },
            title: { type: DataTypes.STRING, allowNull: false },
            order_index: { type: DataTypes.INTEGER, allowNull: false },
            description: { type: DataTypes.TEXT },
            video_url: { type: DataTypes.STRING },
        },
        {
            sequelize,
            modelName: 'Lesson',
            tableName: 'lessons',
            timestamps: true,
            underscored: true,
        }
    );

    return Lesson;
};
