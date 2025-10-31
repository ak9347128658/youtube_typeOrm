import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    Unique 
} from "typeorm";
import { Student } from "./Student";
import { Course } from "./Course";

@Entity("enrollments")
@Unique(["student", "course"]) // Prevent duplicate enrollments
export class Enrollment {
    @PrimaryGeneratedColumn()
    declare id: number;

    @ManyToOne(() => Student, student => student.enrollments, {
        onDelete: "CASCADE",
    })
    declare student: Student;

    @ManyToOne(() => Course, course => course.enrollments, {
        onDelete: "CASCADE"
    })
    declare course: Course;

    // Additional columns for the relationship
    @Column({ type: "date" })
    declare enrollmentDate: Date;

    @Column({ 
        type: "enum", 
        enum: ["enrolled", "completed", "dropped", "failed"],
        default: "enrolled"
    })
    declare status: "enrolled" | "completed" | "dropped" | "failed";

    @Column({ type: "decimal", precision: 5, scale: 2, nullable: true })
    declare finalGrade?: number;            // 888.88

    @Column({ type: "text", nullable: true })
    declare notes?: string;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    declare amountPaid: number;

    @Column({ type: "boolean", default: false })
    declare isPaid: boolean;

    @CreateDateColumn()
    declare createdAt: Date;

    @UpdateDateColumn()
    declare updatedAt: Date;

    // Computed properties
    get letterGrade(): string {
        if (!this.finalGrade) return "N/A";
        if (this.finalGrade >= 90) return "A";
        if (this.finalGrade >= 80) return "B";
        if (this.finalGrade >= 70) return "C";
        if (this.finalGrade >= 60) return "D";
        return "F";
    }

    get isActive(): boolean {
        return this.status === "enrolled";
    }
}

// CREATE TABLE enrollments (
//     id SERIAL PRIMARY KEY,
//     student_id INT NOT NULL,
//     course_id INT NOT NULL,
//     enrollmentDate DATE NOT NULL,
//     status ENUM('enrolled','completed','dropped','failed') DEFAULT 'enrolled',
//     finalGrade DECIMAL(5,2),
//     notes TEXT,
//     amountPaid DECIMAL(10,2) NOT NULL,
//     isPaid BOOLEAN DEFAULT false,
//     createdAt TIMESTAMP DEFAULT now(),
//     updatedAt TIMESTAMP DEFAULT now(),
//     UNIQUE (student_id, course_id)
// );

// id	student_id	course_id	status
// 1	10	               5	enrolled
// 1	10	               5	enrolled