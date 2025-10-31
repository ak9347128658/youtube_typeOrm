import "reflect-metadata";
import {DataSource} from "typeorm"
import { User } from "./entities/User";
import { UserProfile } from "./entities/UserProfile";
import { Post } from "./entities/Post";
import { Comment } from "./entities/Comment";

export const AppDataSource = new DataSource({
   type:"postgres",
   host:"localhost",
   port: 5432,
   username: "myuser",
   password:"mysecretpassword",
   database: "typeorm_course",
   synchronize: true,
   logging: false, 
   entities: [
      User,UserProfile,Post,Comment
   ]
});