import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createAttendance1617240395688 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
              name: "attendances",
              columns: [
                {
                  name: "id",
                  type: "varchar",
                  isPrimary: true,
                  generationStrategy: "uuid",
                },
                {
                  name: "scheduling_id",
                  type: "varchar",
                  isNullable: false,
                },
                {
                  name: "clinic_id",
                  type: "varchar",
                  isNullable: false,
                },
                {
                  name: "weight",
                  type: "float",
                  isNullable: true,
                },
                {
                  name: "blood_pressure",
                  type: "varchar(30)",
                  isNullable: true,
                },
                {
                  name: "blood_type",
                  type: 'enum',
                  enum: ['ABN', 'BN', 'AN', 'ON', 'ABP', 'BP', 'AP', 'OP'],
                  isNullable: true,
                },
                {
                  name: "allergies",
                  type: "text",
                  isNullable: true,
                },
                {
                  name: "chronic_diseases",
                  type: "text",
                  isNullable: true,
                },
                {
                  name: "note",
                  type: "text",
                  isNullable: true,
                },
                {
                  name: "prescription",
                  type: "text",
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
                    name: "AttendScheduleData",
                    columnNames: ["scheduling_id"],
                    referencedTableName: "schedule",
                    referencedColumnNames: ["id"],
                  }
                ],
            })
          );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("attendances");
    }

}
