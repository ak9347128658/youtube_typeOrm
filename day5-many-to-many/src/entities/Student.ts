import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    OneToMany,
    CreateDateColumn 
} from "typeorm";
import { Enrollment } from "./Enrollment";

@Entity("students")
export class Student {
    @PrimaryGeneratedColumn()
    declare id: number;

    @Column({ type: "varchar", length: 100 })
    declare firstName: string;

    @Column({ type: "varchar", length: 100 })
    declare lastName: string;

    @Column({ type: "varchar", length: 200, unique: true })
    declare email: string;

    @Column({ type: "varchar", length: 20, unique: true })
    declare studentId: string;

    @Column({ type: "date" })
    declare enrollmentDate: Date;

    @Column({ type: "varchar", length: 100 })
    declare major: string;

    @CreateDateColumn()
    declare createdAt: Date;

    // Relation to enrollments (not directly to courses)
    @OneToMany(() => Enrollment, enrollment => enrollment.student)
    declare enrollments: Enrollment[];

    // Computed properties
    get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    get enrolledCourseCount(): number {
        return this.enrollments?.length || 0;
    }
}