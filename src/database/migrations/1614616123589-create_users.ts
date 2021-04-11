import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class createUsers1614616123589 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "users",
        columns: [
          {
            name: "id",
            type: "varchar",
            isPrimary: true,
            generationStrategy: "uuid",
          },
          {
            name: "clinic_id",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "email",
            type: "varchar(200)",
            isUnique: true,
          },
          {
            name: "password",
            type: "varchar(100)",
          }
        ],
        foreignKeys: [
          {
            name: "UserClinicData",
            columnNames: ["clinic_id"],
            referencedTableName: "clinics",
            referencedColumnNames: ["id"],
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("users");
  }
}
