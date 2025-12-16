import { DataTypes, Model } from 'sequelize';

class CourseOutcome extends Model {
    static async createOutcome(data) {
        return await this.create(data);
    }

    static async getOutcomeById(id) {
        return await this.findByPk(id);
    }

    static async getAllOutcomes() {
        return await this.findAll();
    }

    static async updateOutcome(id, data) {
        const outcome = await this.findByPk(id);
        if (!outcome) return null;
        return await outcome.update(data);
    }

    static async deleteOutcome(id) {
        const outcome = await this.findByPk(id);
        if (!outcome) return null;
        await outcome.destroy();
        return true;
    }
}

export default (sequelize) => {
    CourseOutcome.init(
        {
            course_id: { type: DataTypes.INTEGER, allowNull: false },
            point_text: { type: DataTypes.TEXT, allowNull: false },
            order_index: { type: DataTypes.INTEGER, allowNull: false },
        },
        {
            sequelize,
            modelName: 'CourseOutcome',
            tableName: 'course_outcomes',
            timestamps: true,
            underscored: true,
        }
    );

    return CourseOutcome;
};
