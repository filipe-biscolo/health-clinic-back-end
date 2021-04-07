import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class createPerson1614613755853 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "persons",
        columns: [
          {
            name: "id",
            type: "varchar",
            isPrimary: true,
            generationStrategy: "uuid",
          },
          {
            name: "name",
            type: "varchar(150)",
          },
          {
            name: "birth_date",
            type: "varchar(15)",
            isNullable: true,
          },
          {
            name: "sex",
            type: 'enum',
            enum: ['M', 'F'],
            isNullable: true,
          },
          {
            name: "marital_status",
            type: 'enum',
            enum: ['SO', 'CA', 'DI', 'VI', 'SE'],
            isNullable: true,
          },
          {
            name: "cpf",
            type: "varchar(20)",
            isNullable: true,
          },
          {
            name: "rg",
            type: "varchar(20)",
            isNullable: true,
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
            type: "varchar(20)",
            isNullable: true,
          },
          {
            name: "phone",
            type: "varchar(20)",
            isNullable: false,
          },
          {
            name: "phone_aux",
            type: "varchar(20)",
            isNullable: true,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("persons");
  }
}
