import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class createPatients1615639756865 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "patients",
        columns: [
          {
            name: "id",
            type: "varchar",
            isPrimary: true,
            generationStrategy: "uuid",
          },
          {
            name: "person_id",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "clinic_id",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "health_insurance_id",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "email",
            type: "varchar(200)",
            isNullable: true,
          },
          {
            name: "sus_number",
            type: "varchar(30)",
            isNullable: true,
          },
          {
            name: "note",
            type: "text",
            isNullable: true,
          },
          {
            name: "deleted",
            type: "boolean",
            default: false,
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
            name: "PatClinicData",
            columnNames: ["clinic_id"],
            referencedTableName: "clinics",
            referencedColumnNames: ["id"],
          },
          {
            name: "PatPersonData",
            columnNames: ["person_id"],
            referencedTableName: "persons",
            referencedColumnNames: ["id"],
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
          },
          {
            name: "PatHealInsData",
            columnNames: ["health_insurance_id"],
            referencedTableName: "health_insurances",
            referencedColumnNames: ["id"],
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("patients");
  }
}
