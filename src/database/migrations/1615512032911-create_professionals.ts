import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class createProfessionals1615512032911 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "professionals",
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
            name: "person_id",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "user_id",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "occupation_id",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "note",
            type: "text",
            isNullable: true,
          },
          {
            name: "admin",
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
            name: "ProClinicData",
            columnNames: ["clinic_id"],
            referencedTableName: "clinics",
            referencedColumnNames: ["id"],
          },
          {
            name: "ProPersonData",
            columnNames: ["person_id"],
            referencedTableName: "persons",
            referencedColumnNames: ["id"],
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
          },
          {
            name: "ProUserData",
            columnNames: ["user_id"],
            referencedTableName: "users",
            referencedColumnNames: ["id"],
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
          },
          {
            name: "ProOccupData",
            columnNames: ["occupation_id"],
            referencedTableName: "occupations",
            referencedColumnNames: ["id"],
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("professionals");
  }
}