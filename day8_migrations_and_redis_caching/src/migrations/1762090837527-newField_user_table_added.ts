import { MigrationInterface, QueryRunner } from "typeorm";

export class NewFieldUserTableAdded1762090837527 implements MigrationInterface {
    name = 'NewFieldUserTableAdded1762090837527'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "newField" character varying NOT NULL DEFAULT 'this new field'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "newField"`);
    }

}
