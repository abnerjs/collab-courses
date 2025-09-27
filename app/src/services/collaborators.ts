import { env } from "@/env"

export interface CollaboratorDto {
	id: string;
	nome: string;
	cargo: string;
	setor: string;
}

export interface CreateCollaboratorRequest {
	nome: string;
	cargoId: string;
}

export interface UpdateCollaboratorRequest {
	nome?: string;
	cargoId?: string;
}

export const getCollaborators = async (): Promise<CollaboratorDto[]> => {
	const response = await fetch(`${env.VITE_API_URL}/collaborators`);
	const data = await response.json();
	return data.data;
};

export const createCollaborator = async (collaborator: CreateCollaboratorRequest): Promise<CollaboratorDto> => {
	const response = await fetch(`${env.VITE_API_URL}/collaborators`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(collaborator),
	});
	const data = await response.json();
	return data.data;
};

export const updateCollaborator = async (id: string, collaborator: UpdateCollaboratorRequest): Promise<CollaboratorDto> => {
	const response = await fetch(`${env.VITE_API_URL}/collaborators/${id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(collaborator),
	});
	const data = await response.json();
	return data.data;
};

export const deleteCollaborator = async (id: string): Promise<void> => {
	await fetch(`${env.VITE_API_URL}/collaborators/${id}`, {
		method: 'DELETE',
	});
};