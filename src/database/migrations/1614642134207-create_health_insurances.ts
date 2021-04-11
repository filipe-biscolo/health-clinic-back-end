import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class createHealthInsurances1614642134207 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "health_insurances",
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
            name: "HeaInsuClinicData",
            columnNames: ["clinic_id"],
            referencedTableName: "clinics",
            referencedColumnNames: ["id"],
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("health_insurances");
  }
}
