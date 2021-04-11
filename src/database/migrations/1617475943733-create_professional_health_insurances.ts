import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class createProfessionalHealthInsurances1617475943733
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "professional_health_insurances",
        columns: [
          {
            name: "id",
            type: "varchar",
            isPrimary: true,
            generationStrategy: "uuid",
          },
          {
            name: "professional_id",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "health_insurance_id",
            type: "varchar",
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
            name: "ProfHIData",
            columnNames: ["professional_id"],
            referencedTableName: "professionals",
            referencedColumnNames: ["id"],
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("professional_health_insurances");
  }
}
