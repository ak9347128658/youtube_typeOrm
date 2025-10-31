import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import { User } from "./User";

@Entity("user_profiles")
export class UserProfile {
    @PrimaryGeneratedColumn()
    declare id: number;

    @Column({ type: "text", nullable: true })
    declare bio?: string;

    @Column({ type: "varchar", length: 200, nullable: true })
    declare website?: string;

    @Column({ type: "varchar", length: 100, nullable: true })
    declare location?: string;

    @Column({ type: "date", nullable: true })
    declare birthDate?: Date;

    @Column({ type: "varchar", length: 100, nullable: true })
    declare company?: string;

    @Column({ type: "varchar", length: 100, nullable: true })
    declare jobTitle?: string;

    @Column({ type: "json", nullable: true })
    declare socialLinks?: {
        twitter?: string;
        linkedin?: string;
        github?: string;
        website?: string;
    };

    @Column({ type: "varchar", length: 500, nullable: true })
    declare avatarUrl?: string;

    @OneToOne(() => User, user => user.profile)
    declare user: User;

    get age(): number | null {
        if(!this.birthDate) return null;
        const today = new Date();
        const birth = new Date(this.birthDate);
        let age = today.getFullYear() - birth.getFullYear()  // 2025 - 1999 = 26
        const mothDiff = today.getMonth() - birth.getMonth();
        if(mothDiff < 0 || (mothDiff === 0 && today.getDate() < birth.getDate())){
            age--;
        }
        return age;     // may 10, october 30  || dec 20, today octorber 30
    }
}
