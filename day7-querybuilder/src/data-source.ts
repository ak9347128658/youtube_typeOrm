import "reflect-metadata";
import {DataSource} from "typeorm"
import { User } from "./entities/User";
import { Order } from "./entities/Order";
import { OrderItem } from "./entities/OrderItem";
import { Product } from "./entities/Product";
import { Review } from "./entities/Review";
import { Category } from "./entities/Category";

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
      User,Order,OrderItem,Product,Review,Category
   ]
});