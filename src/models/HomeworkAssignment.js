import { DataTypes, Model } from 'sequelize';

class HomeworkAssignment extends Model {
    static async createAssignment(data) {
        return await this.create(data);
    }

    static async getAssignmentById(id) {
        return await this.findByPk(id);
    }

    static async getAllAssignments() {
        return await this.findAll();
    }

    static async updateAssignment(id, data) {
        const assignment = await this.findByPk(id);
        if (!assignment) return null;
        return await assignment.update(data);
    }

    static async deleteAssignment(id) {
        const assignment = await this.findByPk(id);
        if (!assignment) return null;
        await assignment.destroy();
        return true;
    }
}

export default (sequelize) => {
    HomeworkAssignment.init(
        {
            lesson_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
            title: { type: DataTypes.STRING, allowNull: false },
            description: { type: DataTypes.TEXT, allowNull: false },
            deadline_days: { type: DataTypes.INTEGER, allowNull: false },
        },
        {
            sequelize,
            modelName: 'HomeworkAssignment',
            tableName: 'homework_assignments',
            timestamps: true,
            underscored: true,
        }
    );

    return HomeworkAssignment;
};
