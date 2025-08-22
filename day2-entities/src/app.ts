import {AppDataSource} from './data-source';
import { User } from './entities/User';

async function main() {
   try{
      await AppDataSource.initialize();
      console.log("Database connected successfully.");
      
      const userRepository  = AppDataSource.getRepository(User);

      // Create a new User
      // const newUser = new User();
      // newUser.firstName = "John";
      // newUser.lastName = "Doe";
      // newUser.email = "john.doe@example.com";
      // newUser.age = 25;

      // save the user to the database
      // const savedUser = await userRepository.save(newUser);
      // console.log("User saved :", savedUser);
      
      // Find all users
      const allUsers = await userRepository.find();
      console.log("All users : ",allUsers); 

   }catch(error){
      console.error("Error : ",error)
   }finally{
      // clean up the connection
      await AppDataSource.destroy();
   }
}

main();