import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class createUsersForgot1615854300249 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "users_forgot",
        columns: [
          {
            name: "id",
            type: "varchar",
            isPrimary: true,
            generationStrategy: "uuid",
          },
          {
            name: "email",
            type: "varchar(200)",
            isUnique: true,
          },
          {
            name: "confirmed",
            type: "boolean",
            default: false,
          },
          {
            name: "code",
            type: "varchar",
          },
          {
            name: "created_at",
            type: "datetime",
            default: "now()",
          },
          {
            name: "update_at",
            type: "datetime",
            onUpdate: "CURRENT_TIMESTAMP",
            isNullable: true,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("users_forgot");
  }
}
