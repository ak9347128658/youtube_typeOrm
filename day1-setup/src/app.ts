import "reflect-metadata";
import {DataSource} from "typeorm"

const AppDataSource = new DataSource({
   type:"postgres",
   host:"localhost",
   port: 5432,
   username: "myuser",
   password:"mysecretpassword",
   database: "typeorm_course",
   synchronize: true,
   logging: true, 
   entities: [
      
   ]
});

AppDataSource.initialize()
    .then(() => {
       console.log("Database Conneted Successfully.");
       console.log("Welcome to TypeORM!");
    })
    .catch((error) => {
       console.error("Database Connection failed : ",error);
    });