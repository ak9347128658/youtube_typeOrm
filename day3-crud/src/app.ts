// import { readOperations } from './crud/read-operations';
import { deleteOperations } from './crud/deleteOperations';
// import { updateOperations } from './crud/update-operations';
import {AppDataSource} from './data-source';
import { createOperations } from './crud/create-operations';
async function main() {
   try{
      await AppDataSource.initialize();
      console.log("Database connected successfully.");

      // create operations
      await createOperations();

      // read operations
      // await readOperations();

      // update opeations
      // await updateOperations();

      // delete operations
      // await deleteOperations();
   }catch(error){
      console.error("Error : ",error)
   }finally{
      // clean up the connection
      await AppDataSource.destroy();
   }
}

main();