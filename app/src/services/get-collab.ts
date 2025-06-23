export const getCollabSummary = async (): Promise<CollabSummaryResponse> => {
	const response = await fetch(`${process.env.API_URL}/`);
	const data = await response.json();
	return data;
};

export type CollabSummaryResponse = {
	data: {
		id: string;
		nomeColaborador: string;
		cargo: string;
		setor: string;
		noPrazo: number;
		vencendo: number;
		vencido: number;
		naoRealizado: number;
	}[];
	meta: {
		total: number;
		pageIndex: number;
		pageSize: number;
		pageCount: number;
	};
};
