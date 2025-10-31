import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { Role } from "../entities/Role";
import { Student } from "../entities/Student";
import { Course } from "../entities/Course";
import { Enrollment } from "../entities/Enrollment";
import { UserRepository } from "../repositories/UserRepository";
import { EnrollmentRepository } from "../repositories/EnrollmentRepository";

export async function manyToManyOperations() {
    const userRepository = new UserRepository();
    const roleRepository = AppDataSource.getRepository(Role);
    const studentRepository = AppDataSource.getRepository(Student);
    const courseRepository = AppDataSource.getRepository(Course);
    const enrollmentRepository = new EnrollmentRepository();

    // === Basic Many-to-Many Operations ===

    // // 1. Create roles
    // const adminRole = await roleRepository.save({
    //     name: "admin",
    //     description: "Full system access",
    //     permissions: ["read", "write", "delete", "manage_users"]
    // });

    // const editorRole = await roleRepository.save({
    //     name: "editor",
    //     description: "Content management access",
    //     permissions: ["read", "write"]
    // });

    // const viewerRole = await roleRepository.save({
    //     name: "viewer",
    //     description: "Read-only access",
    //     permissions: ["read"]
    // });

    // console.log("👥 Roles created");

    // // 2. Create users with roles
    // const adminUser = await userRepository.save({
    //     firstName: "Alice",
    //     lastName: "Admin",
    //     email: "alice@example.com",
    //     username: "alice_admin",
    //     roles: [adminRole, editorRole] // Admin can also edit
    // });

    // const editorUser = await userRepository.save({
    //     firstName: "Bob",
    //     lastName: "Editor",
    //     email: "bob@example.com",
    //     username: "bob_editor",
    //     roles: [editorRole]
    // });

    // const viewerUser = await userRepository.save({
    //     firstName: "Charlie",
    //     lastName: "Viewer",
    //     email: "charlie@example.com",
    //     username: "charlie_viewer",
    //     roles: [viewerRole]
    // });

    // console.log("👤 Users with roles created");

    // // 3. Add/remove roles from existing user
    // const userToUpdate = await userRepository.findOne({
    //     where: { id: viewerUser.id },
    //     relations: ["roles"]
    // });

    // if (userToUpdate) {
    //     // Add editor role to viewer
    //     userToUpdate.roles.push(editorRole);
    //     await userRepository.save(userToUpdate);
    //     console.log("🔄 Added editor role to viewer");
    // }

 // === Many-to-Many with Junction Entity ===
     // 4. Create students
    // const student1 = await studentRepository.save({
    //     firstName: "Emma",
    //     lastName: "Student",
    //     email: "emma@university.edu",
    //     studentId: "ST2024001",
    //     enrollmentDate: new Date("2024-01-15"),
    //     major: "Computer Science"
    // });

    // const student2 = await studentRepository.save({
    //     firstName: "David",
    //     lastName: "Learner",
    //     email: "david@university.edu",
    //     studentId: "ST2024002",
    //     enrollmentDate: new Date("2024-01-16"),
    //     major: "Mathematics"
    // });

    //     // 5. Create courses
    // const course1 = await courseRepository.save({
    //     code: "CS101",
    //     title: "Introduction to Programming",
    //     description: "Learn the fundamentals of programming using Python",
    //     credits: 3,
    //     instructor: "Dr. Smith",
    //     maxStudents: 30,
    //     fees: 1200.00
    // });

    // const course2 = await courseRepository.save({
    //     code: "MATH201",
    //     title: "Calculus II",
    //     description: "Advanced calculus concepts and applications",
    //     credits: 4,
    //     instructor: "Dr. Johnson",
    //     maxStudents: 25,
    //     fees: 1500.00
    // });
    // console.log("🎓 Students and courses created");
    // await enrollmentRepository.enrollStudent(student1.id, course1.id, 1200.00);
    // await enrollmentRepository.enrollStudent(student1.id, course2.id, 1500.00);
    // await enrollmentRepository.enrollStudent(student2.id, course1.id, 1200.00);
    //  console.log("📚 Students enrolled in courses");

    // 7. Update grades
    // const enrollements = await enrollmentRepository.find({
    //     relations: ["student","course"]
    // })

    // // console.log(enrollements)
    // for(const enrollement of enrollements){
    //     const grade = Math.floor(Math.random() * 40) + 60;  //0.0, 0.27, 0.5432, 0.999999, etc.  0 and 1
    //     await enrollmentRepository.updateGrade(enrollement.id,grade);
    // }
    // console.log("Grades updated")
}

export async function queryManytoManyData(){
    const userRepository = new UserRepository();
    const enrollmentRepository = new EnrollmentRepository();

   // Query user by role
//    const admins = await userRepository.findByRole("admin");
//    console.log("Admin users :",admins.map(u => u.firstName + "" + u.lastName))              //

   // Get user statistics by role
//    const roleStats = await userRepository.getUserStatsByRole();
//    console.log("User statistics by role: ",roleStats);
     
// Query enrollement data
//    const student1Enrollments = await enrollmentRepository.getStudentEnrollments(8);
//    console.log("student 1 enrollments:", 
//     student1Enrollments.map(e => `${e.course.title} - ${e.letterGrade}`)
//    )

    // Get course statistics
    const course1Stats = await enrollmentRepository.getEnrollmentStats(1);
    console.log("📊 Course 1 statistics:", course1Stats);

}