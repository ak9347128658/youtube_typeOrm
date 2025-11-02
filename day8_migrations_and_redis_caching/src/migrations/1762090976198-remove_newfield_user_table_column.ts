import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveNewfieldUserTableColumn1762090976198 implements MigrationInterface {
    name = 'RemoveNewfieldUserTableColumn1762090976198'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "newField"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "newField" character varying NOT NULL DEFAULT 'this new field'`);
    }

}
