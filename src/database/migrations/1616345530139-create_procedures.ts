import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class createProcedures1616345530139 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "procedures",
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
            name: "name",
            type: "varchar(150)",
            isNullable: false,
          },
          {
            name: "duration",
            type: "integer",
            isNullable: false,
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
        foreignKeys: [
          {
            name: "ProcedureClinicData",
            columnNames: ["clinic_id"],
            referencedTableName: "clinics",
            referencedColumnNames: ["id"],
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("procedures");
  }
}
