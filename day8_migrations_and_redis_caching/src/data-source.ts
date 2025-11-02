import "reflect-metadata";
import {DataSource} from "typeorm"

export const AppDataSource = new DataSource({
   type:"postgres",
   host:"localhost",
   port: 5432,
   username: "myuser",
   password:"mysecretpassword",
   database: "typeorm_course",
   synchronize: true,
   logging: true, 
       // Connection pool optimization
    extra: {
        // Connection pool settings
        max: 20,                    // Maximum connections
        min: 5,                     // Minimum connections
        idle_timeout: 30 * 1000,        // 30 seconds idle timeout
        acquire_timeout: 60000,     // 60 seconds acquire timeout
        
        // Performance tuning
        statement_timeout: 30000,   // 30 seconds statement timeout
        query_timeout: 30000,       // 30 seconds query timeout
        
        // Connection optimization
        application_name: "typeorm_performance_app",
        
        // SSL and security (for production)
        ssl: false // Set to true in production with proper certificates
      //   ssl: { rejectUnauthorized: true, ca: fs.readFileSync("rds-ca.pem") }

    },
      // Entity caching
    cache: {
        type: "redis",
        options: {
            host: "localhost",
            port: 6379,
            db: 0,
            password: undefined, // Set in production
            
            // Redis performance settings
            retryDelayOnFailover: 100,
            enableReadyCheck: false,
            maxRetriesPerRequest: 3,
            
            // Connection pool for Redis
            family: 4,
            keepAlive: true,
            
            // Serialization optimization
            lazyConnect: true
        },
        duration: 300000 // 5 minutes cache duration
    },
   entities: [
       __dirname + "/entities/*.ts"
   ],
   migrations: [
       __dirname + "/migrations/*.ts"
   ],
   migrationsRun: false,

});