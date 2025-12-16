import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
    process.env.DB_NAME ?? 'platforma',
    process.env.DB_USER ?? 'postgres',
    process.env.DB_PASS ?? '123',
    {
        host: process.env.DB_HOST ?? 'localhost',
        dialect: 'postgres',
        logging: false
    }
);

export default sequelize;
