import { Repository } from "typeorm";
import { Enrollment } from "../entities/Enrollment";
import { AppDataSource } from "../data-source";

export class EnrollmentRepository extends Repository<Enrollment> {
    constructor() {
        super(Enrollment, AppDataSource.manager);
    }

    // Enroll student in course
    async enrollStudent(
        studentId: number,
        courseId: number,
        amountPaid: number
    ): Promise<Enrollment> {
        // Check if student is already enrolled
        const existingEnrollment = await this.findOne({
            where: {
                student: { id: studentId },
                course: { id: courseId }
            }
        });

        if (existingEnrollment) {
            throw new Error("Student is already enrolled in this course");
        }

        const enrollment = this.create({
            student: { id: studentId },
            course: { id: courseId },
            enrollmentDate: new Date(),
            amountPaid,
            isPaid: amountPaid > 0,
            status: "enrolled"
        });

        return this.save(enrollment);
    }

    // Get student's enrollments with course details
    async getStudentEnrollments(studentId: number): Promise<Enrollment[]> {
        return this.find({
            where: { student: { id: studentId } },
            relations: ["course"],
            order: { enrollmentDate: "DESC" }
        });
    }

    // Get course enrollments with student details
    async getCourseEnrollments(courseId: number): Promise<Enrollment[]> {
        return this.find({
            where: { course: { id: courseId } },
            relations: ["student"],
            order: { enrollmentDate: "ASC" }
        });
    }

    // Get enrollment statistics
    async getEnrollmentStats(courseId?: number) {
        let query = this.createQueryBuilder("enrollment")
            .leftJoin("enrollment.course", "course")
            .leftJoin("enrollment.student", "student");

        if (courseId) {
            query = query.where("course.id = :courseId", { courseId });
        }

        const startTime = Date.now();

        // const totalEnrollments = await query.getCount();

        // const activeEnrollments = await query
        //     .clone()
        //     .andWhere("enrollment.status = :status", { status: "enrolled" })
        //     .getCount();

        // const completedEnrollments = await query
        //     .clone()
        //     .andWhere("enrollment.status = :status", { status: "completed" })
        //     .getCount();

        // const droppedEnrollments = await query
        //     .clone()
        //     .andWhere("enrollment.status = :status", { status: "dropped" })
        //     .getCount();

        // const averageGrade = await query
        //     .clone()
        //     .select("AVG(enrollment.finalGrade)", "avg")
        //     .where("enrollment.finalGrade IS NOT NULL")
        //     .getRawOne();
        const [
            totalEnrollments,
            activeEnrollments,
            completedEnrollments,
            droppedEnrollments,
            averageGrade
        ] = await Promise.all([
            query.getCount(),
            query.clone().andWhere("enrollment.status = :status", { status: "enrolled" }).getCount(),
            query.clone().andWhere("enrollment.status = :status", { status: "completed" }).getCount(),
            query.clone().andWhere("enrollment.status = :status", { status: "dropped" }).getCount(),
            query.clone()
                .select("AVG(enrollment.finalGrade)", "avg")
                .where("enrollment.finalGrade IS NOT NULL")
                .getRawOne()
        ]);

        const endTime = Date.now();
        const executionTime = endTime - startTime;
        console.log(`⚡ Promise.all Execution Time: ${executionTime}ms`);
        return {
            total: totalEnrollments,
            active: activeEnrollments,
            completed: completedEnrollments,
            dropped: droppedEnrollments,
            averageGrade: parseFloat(averageGrade?.avg) || 0
        };
    }

    // Update grade for enrollment
    async updateGrade(enrollmentId: number, grade: number): Promise<void> {
        await this.update(enrollmentId, {
            finalGrade: grade,
            status: grade >= 60 ? "completed" : "failed"
        });
    }
}