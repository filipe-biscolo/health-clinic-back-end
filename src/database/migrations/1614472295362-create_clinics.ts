import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class createClinics1614472295362 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "clinics",
        columns: [
          {
            name: "id",
            type: "varchar",
            isPrimary: true,
            generationStrategy: "uuid",
          },
          {
            name: "company_name",
            type: "varchar(200)",
            isNullable: true,
          },
          {
            name: "fantasy_name",
            type: "varchar(150)",
            isNullable: false,
          },
          {
            name: "cnpj",
            type: "varchar(20)",
            isNullable: false,
          },
          {
            name: "street",
            type: "varchar(150)",
            isNullable: true,
          },
          {
            name: "district",
            type: "varchar(150)",
            isNullable: true,
          },
          {
            name: "address_number",
            type: "varchar(30)",
            isNullable: true,
          },
          {
            name: "city_id",
            type: "integer",
            isNullable: true,
          },
          {
            name: "state_id",
            type: "integer",
            isNullable: true,
          },
          {
            name: "cep",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "phone",
            type: "varchar(20)",
            isNullable: true,
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
    await queryRunner.dropTable("clinics");
  }
}
