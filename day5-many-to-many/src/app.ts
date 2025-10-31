import {AppDataSource} from './data-source';
import { manyToManyOperations, queryManytoManyData } from './operations/many-to-many-operations';
async function main() {
   try{
      await AppDataSource.initialize();
      console.log("Database connected successfully.");
      await manyToManyOperations()
      await queryManytoManyData();
   }catch(error){
      console.error("Error : ",error)
   }finally{
      // clean up the connection
      await AppDataSource.destroy();
   }
}

main();