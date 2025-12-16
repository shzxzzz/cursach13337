import { DataTypes, Model } from 'sequelize';

class StudentLessonProgress extends Model {
    static async createProgress(data) {
        return await this.create(data);
    }

    static async getProgressById(id) {
        return await this.findByPk(id);
    }

    static async getAllProgress() {
        return await this.findAll();
    }

    static async updateProgress(id, data) {
        const progress = await this.findByPk(id);
        if (!progress) return null;
        return await progress.update(data);
    }

    static async deleteProgress(id) {
        const progress = await this.findByPk(id);
        if (!progress) return null;
        await progress.destroy();
        return true;
    }
}

export default (sequelize) => {
    StudentLessonProgress.init(
        {
            student_id: { type: DataTypes.INTEGER, allowNull: false },
            lesson_id: { type: DataTypes.INTEGER, allowNull: false },
            is_completed: { type: DataTypes.BOOLEAN, defaultValue: false },
            last_accessed_at: { type: DataTypes.DATE },
        },
        {
            sequelize,
            modelName: 'StudentLessonProgress',
            tableName: 'student_lesson_progress',
            timestamps: true,
            underscored: true,
            uniqueKeys: { unique_student_lesson: { fields: ['student_id', 'lesson_id'] } },
        }
    );

    return StudentLessonProgress;
};
