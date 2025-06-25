import { env } from "@/env";

interface CollabSummaryRequest {
	nome?: string;
}

export const getCollabSummary = async ({
	queryKey,
}: {
	queryKey: [string, CollabSummaryRequest];
}): Promise<CollabSummaryResponse> => {
	const [_key, { nome }] = queryKey as [string, CollabSummaryRequest];

	const url = new URL(`${env.VITE_API_URL}/`);

	if (nome && nome.trim().length > 0) {
		url.searchParams.set("nome", nome);
	}

	const response = fetch(url).then((res) => {
		return res.json();
	});

	return response;
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
	};
};
