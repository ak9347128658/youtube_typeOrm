import {AppDataSource} from './data-source';
import { advancedJoinOperations } from './queries/advanced-joins';
import { aggregationsAndGrouping } from './queries/aggregations-grouping';
import { basicQueryBuilderOperations } from './queries/basic-querybuilder';
import { subqueriesAndCTEs } from './queries/subqueries-ctes';
// import { seedData } from './seedData';
async function main() {
   try{
      await AppDataSource.initialize();
      console.log("Database connected successfully.");
      // await seedData();
      // await basicQueryBuilderOperations();
      // await advancedJoinOperations();
      // await subqueriesAndCTEs();
      await aggregationsAndGrouping();
   }catch(error){
      console.error("Error : ",error)
   }finally{
      // clean up the connection
      await AppDataSource.destroy();
   }
}

main();