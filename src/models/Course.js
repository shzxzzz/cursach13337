import { DataTypes, Model } from 'sequelize';
import User from './User.js';
class Course extends Model {

    static async createCourse(data) {
        return await this.create(data);
    }

    static async getCourseById(id) {
        return await this.findByPk(id);
    }

    static async getAllCourses() {
        return await this.findAll();
    }

    static async updateCourse(id, data) {
        const course = await this.findByPk(id);
        if (!course) return null;
        return await course.update(data);
    }

    static async deleteCourse(id) {
        const course = await this.findByPk(id);
        if (!course) return null;
        await course.destroy();
        return true;
    }
}

export default (sequelize) => {
    Course.init(
        {
            title: { type: DataTypes.STRING, allowNull: false },
            short_description: { type: DataTypes.TEXT, allowNull: false },
            full_description: { type: DataTypes.TEXT, allowNull: false },
            teacher_id: { type: DataTypes.INTEGER, allowNull: false },
            price: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
            duration: { type: DataTypes.INTEGER, allowNull: false }, // длительность в неделях
            student_count: { type: DataTypes.INTEGER, defaultValue: 0 },
            is_published: { type: DataTypes.BOOLEAN, defaultValue: false },
            icon: { type: DataTypes.STRING },
        },
        {
            sequelize,
            modelName: 'Course',
            tableName: 'courses',
            timestamps: true,
            underscored: true,
        }
    );
    return Course;
};
