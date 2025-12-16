import { DataTypes, Model } from 'sequelize';

class StudentHomework extends Model {
    static async createHomework(data) {
        return await this.create(data);
    }

    static async getHomeworkById(id) {
        return await this.findByPk(id);
    }

    static async getAllHomeworks() {
        return await this.findAll();
    }

    static async updateHomework(id, data) {
        const hw = await this.findByPk(id);
        if (!hw) return null;
        return await hw.update(data);
    }

    static async deleteHomework(id) {
        const hw = await this.findByPk(id);
        if (!hw) return null;
        await hw.destroy();
        return true;
    }
}

export default (sequelize) => {
    StudentHomework.init(
        {
            student_id: { type: DataTypes.INTEGER, allowNull: false },
            homework_assignment_id: { type: DataTypes.INTEGER, allowNull: false },
            text_answer: { type: DataTypes.TEXT },
            file_url: { type: DataTypes.STRING },
            status: { type: DataTypes.ENUM('pending','submitted_for_review','graded'), defaultValue: 'pending' },
            submitted_at: { type: DataTypes.DATE },
            grade: { type: DataTypes.SMALLINT, validate: { min: 1, max: 5 } },
            teacher_comment: { type: DataTypes.TEXT },
            graded_at: { type: DataTypes.DATE },
            graded_by: { type: DataTypes.INTEGER },
        },
        {
            sequelize,
            modelName: 'StudentHomework',
            tableName: 'student_homeworks',
            timestamps: true,
            underscored: true,
            uniqueKeys: { unique_student_homework: { fields: ['student_id','homework_assignment_id'] } },
        }
    );

    return StudentHomework;
};
