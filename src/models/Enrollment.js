import { DataTypes, Model } from 'sequelize';

class Enrollment extends Model {
    static async createEnrollment(data) {
        return await this.create(data);
    }

    static async getEnrollmentById(id) {
        return await this.findByPk(id);
    }

    static async getAllEnrollments() {
        return await this.findAll();
    }

    static async updateEnrollment(id, data) {
        const enrollment = await this.findByPk(id);
        if (!enrollment) return null;
        return await enrollment.update(data);
    }

    static async deleteEnrollment(id) {
        const enrollment = await this.findByPk(id);
        if (!enrollment) return null;
        await enrollment.destroy();
        return true;
    }
}

export default (sequelize) => {
    Enrollment.init(
        {
            student_id: { type: DataTypes.INTEGER, allowNull: false },
            course_id: { type: DataTypes.INTEGER, allowNull: false },
            enrolled_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        },
        {
            sequelize,
            modelName: 'Enrollment',
            tableName: 'enrollments',
            timestamps: false,
            underscored: false,
            uniqueKeys: { unique_student_course: { fields: ['student_id', 'course_id'] } },
        }
    );

    return Enrollment;
};
