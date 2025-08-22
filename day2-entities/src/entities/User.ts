import {Entity,PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    declare id:number;

    // @Column({
    //    type: "varchar",
    //    length: 100,
    //    nullable: false,  // can be NUll?
    //    unique: false,  
    //    default: "Unknown",
    //    comment: "User's name",
    //    name: "user_name" 
    // })
    // declare userName: string;

    @Column({type:'varchar',length:100})
    declare firstName:string;
    
    @Column({type:'varchar',length:100})
    declare lastName: string;
    
    @Column({type:'varchar',length:200, unique: true})
    declare email: string;
    
    
    @Column({type:'int'})
    declare age: number;
    
    @Column({type:'boolean',default: false})
    declare isActive : boolean;
    
    @Column({type:'timestamp',default: () => "CURRENT_TIMESTAMP"})
    declare createdAt : Date;
}

// CREATE TABLE users (
//    id varchar(100),
//    isActive boolean default FALSE 
// );