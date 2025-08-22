import "reflect-metadata";
import {DataSource} from "typeorm"
import {User} from './entities/User';

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
      User
   ]
});