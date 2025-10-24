import "reflect-metadata";
import {DataSource} from "typeorm"
import {User} from './entities/User';
import { Profile } from "./entities/Profile";
import { Post } from "./entities/Post";

export const AppDataSource = new DataSource({
   type:"postgres",
   host:"localhost",
   port: 5432,
   username: "myuser",
   password:"mysecretpassword",
   database: "typeorm_course",
   synchronize: true,
   logging: true, 
   entities: [
      User, Profile, Post
   ]
});