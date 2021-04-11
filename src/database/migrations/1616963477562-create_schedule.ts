import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class createSchedule1616963477562 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "schedule",
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
            name: "patient_id",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "professional_id",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "procedure_id",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "health_insurance_id",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "has_health_insurance",
            type: "boolean",
            default: false,
          },
          {
            name: "scheduling_status",
            type: "enum",
            enum: ['SCHEDULED', 'CONFIRMED', 'CANCELED', 'FINISHED'],
            isNullable: false,
          },
          {
            name: "date_hour",
            type: "datetime",
            isNullable: false,
          },
          {
            name: "date_hour_end",
            type: "datetime",
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
            name: "SchedClinicData",
            columnNames: ["clinic_id"],
            referencedTableName: "clinics",
            referencedColumnNames: ["id"],
          },
          {
            name: "SchedPatientData",
            columnNames: ["patient_id"],
            referencedTableName: "patients",
            referencedColumnNames: ["id"],
          },
          {
            name: "SchedProfData",
            columnNames: ["professional_id"],
            referencedTableName: "professionals",
            referencedColumnNames: ["id"],
          },
          {
            name: "SchedProcData",
            columnNames: ["procedure_id"],
            referencedTableName: "procedures",
            referencedColumnNames: ["id"],
          },
          {
            name: "SchedHealInsData",
            columnNames: ["health_insurance_id"],
            referencedTableName: "health_insurances",
            referencedColumnNames: ["id"],
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("schedule");
  }
}
