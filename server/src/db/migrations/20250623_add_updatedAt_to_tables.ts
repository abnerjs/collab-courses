import { sql } from "drizzle-orm";

export async function up(db: any): Promise<void> {
	await db.execute(sql`
    ALTER TABLE "setor" ADD COLUMN "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now();
    ALTER TABLE "cargo" ADD COLUMN "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now();
    ALTER TABLE "colaborador" ADD COLUMN "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now();
    ALTER TABLE "treinamento" ADD COLUMN "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now();
    ALTER TABLE "cargoTreinamento" ADD COLUMN "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now();
    ALTER TABLE "treinamentoColaborador" ADD COLUMN "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now();
  `);
}

export async function down(db: any): Promise<void> {
	await db.execute(sql`
    ALTER TABLE "setor" DROP COLUMN "updatedAt";
    ALTER TABLE "cargo" DROP COLUMN "updatedAt";
    ALTER TABLE "colaborador" DROP COLUMN "updatedAt";
    ALTER TABLE "treinamento" DROP COLUMN "updatedAt";
    ALTER TABLE "cargoTreinamento" DROP COLUMN "updatedAt";
    ALTER TABLE "treinamentoColaborador" DROP COLUMN "updatedAt";
  `);
}
