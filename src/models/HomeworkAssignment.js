// src/models/HomeworkAssignment.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const HomeworkAssignment = sequelize.define('HomeworkAssignment', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        lesson_id: { type: DataTypes.INTEGER, allowNull: false, unique: true }, // по твоей схеме - уникально на урок
        title: { type: DataTypes.STRING(200), allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: false },
        deadline_days: { type: DataTypes.INTEGER, allowNull: false }
    }, {
        tableName: 'homework_assignments',
        timestamps: true,
        underscored: true
    });

    return HomeworkAssignment;
};
