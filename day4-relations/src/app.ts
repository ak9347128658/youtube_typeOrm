import {AppDataSource} from './data-source';
import { updateWithRelations } from './operations/update-with-relations';
// import { readWithRelations } from './operations/read-with-relations';
// import { createWithRelations } from './operations/create-with-relations';
async function main() {
   try{
      await AppDataSource.initialize();
      console.log("Database connected successfully.");

      // await createWithRelations();
      //   await readWithRelations();
      await updateWithRelations();
   }catch(error){
      console.error("Error : ",error)
   }finally{
      // clean up the connection
      await AppDataSource.destroy();
   }
}

main();