import {AppDataSource} from './data-source';
import { basicFindOptions } from './queries/basic-find-options';
import { createSampleData } from './queries/create-sample-data';
import { demonstrateDynamicSearch } from './queries/dynamic-search';
import { findAndCountOperations } from './queries/find-and-count';
import { findWithRelations } from './queries/find-with-relations';
async function main() {
   try{
      await AppDataSource.initialize();
      console.log("Database connected successfully.");
      // await createSampleData();
      // await basicFindOptions();
      // await findWithRelations();
      // await findAndCountOperations();
      await demonstrateDynamicSearch();
   }catch(error){
      console.error("Error : ",error)
   }finally{
      // clean up the connection
      await AppDataSource.destroy();
   }
}

main();