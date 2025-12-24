     
import sequelize from '../db/index.js';

import defineUser from './User.js';
import defineCourse from './Course.js';
import defineModule from './Module.js';
import defineLesson from './Lesson.js';
import defineLessonFile from './LessonFile.js';
import defineCourseOutcome from './CourseOutcome.js';
import defineEnrollment from './Enrollment.js';
import defineStudentLessonProgress from './StudentLessonProgress.js';
import defineHomeworkAssignment from './HomeworkAssignment.js';
import defineStudentHomework from './StudentHomework.js';

const User = defineUser(sequelize);
const Course = defineCourse(sequelize);
const Module = defineModule(sequelize);
const Lesson = defineLesson(sequelize);
const LessonFile = defineLessonFile(sequelize);
const CourseOutcome = defineCourseOutcome(sequelize);
const Enrollment = defineEnrollment(sequelize);
const StudentLessonProgress = defineStudentLessonProgress(sequelize);
const HomeworkAssignment = defineHomeworkAssignment(sequelize);
const StudentHomework = defineStudentHomework(sequelize);

User.hasMany(Course, { foreignKey: 'teacher_id', as: 'courses' });
Course.belongsTo(User, { foreignKey: 'teacher_id', as: 'teacher' });

Course.hasMany(Module, { foreignKey: 'course_id', as: 'modules' });
Module.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });

Module.hasMany(Lesson, { foreignKey: 'module_id', as: 'lessons' });
Lesson.belongsTo(Module, { foreignKey: 'module_id', as: 'module' });

Lesson.hasMany(LessonFile, { foreignKey: 'lesson_id', as: 'files' });
LessonFile.belongsTo(Lesson, { foreignKey: 'lesson_id', as: 'lesson' });

Course.hasMany(CourseOutcome, { foreignKey: 'course_id', as: 'outcomes' });
CourseOutcome.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });

User.hasMany(Enrollment, { foreignKey: 'student_id', as: 'enrollments' });
Enrollment.belongsTo(User, { foreignKey: 'student_id', as: 'student' });

Course.hasMany(Enrollment, { foreignKey: 'course_id', as: 'enrollments' });
Enrollment.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });

User.hasMany(StudentLessonProgress, { foreignKey: 'student_id', as: 'lesson_progress' });
StudentLessonProgress.belongsTo(User, { foreignKey: 'student_id', as: 'student' });

Lesson.hasMany(StudentLessonProgress, { foreignKey: 'lesson_id', as: 'progress' });
StudentLessonProgress.belongsTo(Lesson, { foreignKey: 'lesson_id', as: 'lesson' });

Lesson.hasOne(HomeworkAssignment, { foreignKey: 'lesson_id', as: 'homework' });
HomeworkAssignment.belongsTo(Lesson, { foreignKey: 'lesson_id', as: 'lesson' });

HomeworkAssignment.hasMany(StudentHomework, { foreignKey: 'homework_assignment_id', as: 'submissions' });
StudentHomework.belongsTo(HomeworkAssignment, { foreignKey: 'homework_assignment_id', as: 'assignment' });

User.hasMany(StudentHomework, { foreignKey: 'student_id', as: 'homeworks' });
StudentHomework.belongsTo(User, { foreignKey: 'student_id', as: 'student' });

User.hasMany(StudentHomework, { foreignKey: 'graded_by', as: 'graded_homeworks' });
StudentHomework.belongsTo(User, { foreignKey: 'graded_by', as: 'grader' });

Course.hasMany(Lesson, {
    sourceKey: 'id',
    foreignKey: 'module_id',
    as: 'all_lessons',
    scope: {}
});

export {
    sequelize,
    User,
    Course,
    Module,
    Lesson,
    LessonFile,
    CourseOutcome,
    Enrollment,
    StudentLessonProgress,
    HomeworkAssignment,
    StudentHomework
};
