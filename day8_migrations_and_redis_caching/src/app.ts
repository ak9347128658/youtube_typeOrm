import {AppDataSource} from './data-source';
// import { seedData } from './seed-data';
async function main() {
   try{
      await AppDataSource.initialize();
      console.log("Database connected successfully.");
      //  await seedData();
   }catch(error){
      console.error("Error : ",error)
   }finally{
      // clean up the connection
      await AppDataSource.destroy();
   }
}

main();