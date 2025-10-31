import "reflect-metadata";
import {DataSource} from "typeorm"
import { Role } from "./entities/Role";
import { User } from "./entities/User";
import { Student } from "./entities/Student";
import { Course } from "./entities/Course";
import { Enrollment } from "./entities/Enrollment";

export const AppDataSource = new DataSource({
   type:"postgres",
   host:"localhost",
   port: 5432,
   username: "myuser",
   password:"mysecretpassword",
   database: "typeorm_course",
   synchronize: true,
   // logging: true, 
   entities: [
      User, Role,Student,Course,Enrollment
   ]
});