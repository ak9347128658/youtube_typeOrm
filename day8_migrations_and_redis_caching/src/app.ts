import {AppDataSource} from './data-source';
import { CachingOperations } from './operations/caching-operations';
// import { seedData } from './seed-data';
async function main() {
   try{
      await AppDataSource.initialize();
      console.log("Database connected successfully.");
      //  await seedData();
      // await CachingOperations.clearData()
      // const posts = await CachingOperations.getAllPosts();
      //  console.log("all posts :",JSON.stringify(posts,null,2));

      // const posts1 = await CachingOperations.getAllPosts();
      //  console.log("all posts :",JSON.stringify(posts1,null,2));
       
      //  await CachingOperations.createPost("Intro to Node.js","Learn how to cache efficiently")
       
      //  const posts2 = await CachingOperations.getAllPosts();
      //  console.log("all posts :",JSON.stringify(posts2,null,2));
      const post = await CachingOperations.getPostById(2);
   }catch(error){
      console.error("Error : ",error)
   }finally{
      // clean up the connection
      await AppDataSource.destroy();
   }
}

main();