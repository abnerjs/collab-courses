import { env } from "@/env";

export const importMatrix = async (
	file: File,
): Promise<{ success?: boolean; error?: string }> => {
	const formData = new FormData();
	formData.append("file", file);

	const response = await fetch(`${env.VITE_API_URL}/import-matrix`, {
		method: "POST",
		body: formData,
	});
	const data = await response.json();
	return data;
};
