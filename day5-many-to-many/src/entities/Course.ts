import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn 
} from "typeorm";
import { Enrollment } from "./Enrollment";

@Entity("courses")
export class Course {
    @PrimaryGeneratedColumn()
    declare id: number;

    @Column({ type: "varchar", length: 10, unique: true })
    declare code: string; // e.g., "CS101"

    @Column({ type: "varchar", length: 200 })
    declare title: string;

    @Column({ type: "text" })
    declare description: string;

    @Column({ type: "int" })
    declare credits: number;

    @Column({ type: "varchar", length: 100 })
    declare instructor: string;

    @Column({ type: "int" })
    declare maxStudents: number;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    declare fees: number;

    @Column({ type: "boolean", default: true })
    declare isActive: boolean;

    @CreateDateColumn()
    declare createdAt: Date;

    @UpdateDateColumn()
    declare updatedAt: Date;

    // Relation to enrollments (not directly to students)
    @OneToMany(() => Enrollment, enrollment => enrollment.course)
    declare enrollments: Enrollment[];

    // Computed properties
    get enrolledStudentCount(): number {
        return this.enrollments?.length || 0;
    }

    get availableSlots(): number {
        return this.maxStudents - this.enrolledStudentCount;
    }
}