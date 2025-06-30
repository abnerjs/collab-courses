import xlsx from "xlsx";
import { db } from "../db";
import { treinamento, cargo, cargoTreinamento, setor } from "../db/schema";
import { inArray, eq, and } from "drizzle-orm";

/**
 * Importa um arquivo XLSX, separa as abas em CSVs e cadastra os conteúdos no banco.
 * @param fileBuffer Buffer do arquivo XLSX
 */
export async function importMatrix(fileBuffer: Buffer) {
	const workbook = xlsx.read(fileBuffer, { type: "buffer" });
	for (const sheetName of workbook.SheetNames) {
		const sheet = workbook.Sheets[sheetName];
		const range = xlsx.utils.decode_range(sheet["!ref"] ?? "");
		let startRow = 0;
		let startCol = 0;
		let found = false;
		// Encontrar a célula "FUNÇÕES"
		for (let R = range.s.r; R <= range.e.r && !found; ++R) {
			for (let C = range.s.c; C <= range.e.c && !found; ++C) {
				const cell = sheet[xlsx.utils.encode_cell({ r: R, c: C })];
				if (cell?.v && String(cell.v).toUpperCase() === "FUNÇÕES") {
					startRow = R;
					startCol = C;
					found = true;
				}
			}
		}
		if (!found) continue; // pula aba se não encontrar
		// Extrair treinamentos (células à direita de FUNÇÕES)
		const trainingNames: string[] = [];
		for (let C = startCol + 1; C <= range.e.c; ++C) {
			const cell = sheet[xlsx.utils.encode_cell({ r: startRow, c: C })];
			if (cell?.v) trainingNames.push(String(cell.v).trim());
		}
		// Extrair cargos (células abaixo de FUNÇÕES)
		const cargosList: string[] = [];
		for (let R = startRow + 1; R <= range.e.r; ++R) {
			const cell = sheet[xlsx.utils.encode_cell({ r: R, c: startCol })];
			if (cell?.v) {
				const cargoNome = String(cell.v).trim();
				if (!cargoNome.includes("-")) cargosList.push(cargoNome);
			}
		}
		// Garantir unicidade de treinamentos e cargos
		const uniqueTrainings = [...new Set(trainingNames)];
		const uniqueCargos = [...new Set(cargosList)];
		// Buscar existentes no banco
		const dbTrainings = await db
			.select()
			.from(treinamento)
			.where(inArray(treinamento.nome, uniqueTrainings));
		const dbCargos = await db
			.select()
			.from(cargo)
			.where(inArray(cargo.descricao, uniqueCargos));
		// Cadastrar novos treinamentos
		for (const nome of uniqueTrainings) {
			if (!dbTrainings.find((t) => t.nome === nome)) {
				await db.insert(treinamento).values({ nome, validade: 365 }); // validade default 0
			}
		}
		// Buscar ou criar setor "Geral"
		const setorGeral = await db
			.select()
			.from(setor)
			.where(eq(setor.descricao, "Geral"));
		let setorGeralId: string;
		if (setorGeral.length === 0) {
			const inserted = await db
				.insert(setor)
				.values({ descricao: "Geral" })
				.returning();
			setorGeralId = inserted[0].id;
		} else {
			setorGeralId = setorGeral[0].id;
		}
		// Cadastrar novos cargos
		for (const descricao of uniqueCargos) {
			if (!dbCargos.find((cg) => cg.descricao === descricao)) {
				await db.insert(cargo).values({ descricao, setor: setorGeralId });
			}
		}
		// Atualizar vínculos cargo-treinamento
		// Buscar IDs atualizados
		const allTrainings = await db
			.select()
			.from(treinamento)
			.where(inArray(treinamento.nome, uniqueTrainings));
		const allCargos = await db
			.select()
			.from(cargo)
			.where(inArray(cargo.descricao, uniqueCargos));
		for (let r = 0; r < uniqueCargos.length; ++r) {
			for (let c = 0; c < uniqueTrainings.length; ++c) {
				const cell =
					sheet[
						xlsx.utils.encode_cell({ r: startRow + 1 + r, c: startCol + 1 + c })
					];
				const hasX = cell && String(cell.v).toUpperCase() === "X";
				const cargoObj = allCargos.find(
					(cg) => cg.descricao === uniqueCargos[r],
				);
				const trainingObj = allTrainings.find(
					(tr) => tr.nome === uniqueTrainings[c],
				);
				if (!cargoObj || !trainingObj) continue;
				const exists = await db
					.select()
					.from(cargoTreinamento)
					.where(
						and(
							eq(cargoTreinamento.cargo, cargoObj.id),
							eq(cargoTreinamento.treinamento, trainingObj.id),
						),
					);
				if (hasX && exists.length === 0) {
					await db
						.insert(cargoTreinamento)
						.values({ cargo: cargoObj.id, treinamento: trainingObj.id });
				} else if (!hasX && exists.length > 0) {
					await db
						.delete(cargoTreinamento)
						.where(
							and(
								eq(cargoTreinamento.cargo, cargoObj.id),
								eq(cargoTreinamento.treinamento, trainingObj.id),
							),
						);
				}
			}
		}
	}
}
