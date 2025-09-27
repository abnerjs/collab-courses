import { env } from "@/env"

export interface SectorDto {
	id: string;
	descricao: string;
}

export interface PositionDto {
	id: string;
	descricao: string;
	setor: SectorDto;
}

export const getSectors = async (): Promise<SectorDto[]> => {
	const response = await fetch(`${env.VITE_API_URL}/sectors`);
	const data = await response.json();
	return data.data;
};

export const getPositionsBySector = async (sectorId: string): Promise<PositionDto[]> => {
	const response = await fetch(`${env.VITE_API_URL}/sectors/${sectorId}/positions`);
	const data = await response.json();
	return data.data;
};