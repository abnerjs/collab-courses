import { ErrorLoadingMessage } from "@/components/error-loading-message";
import { MatrixTrainings } from "@/components/matrix-trainings";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { getTrainingsMatrix } from "@/services/get-trainings";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { importMatrix } from "@/services/import-matrix";
import { useState } from "react";
import { useDropzone } from "react-dropzone";

export const Route = createFileRoute("/matrix-trainings")({
	component: function MatrizTreinamentos() {
		const { data, isLoading, isError } = useQuery({
			queryKey: ["matriz-treinamentos"],
			queryFn: getTrainingsMatrix,
		});

		const [open, setOpen] = useState(false);
		const [file, setFile] = useState<File | null>(null);
		const [loading, setLoading] = useState(false);

		const onDrop = (acceptedFiles: File[]) => {
			if (acceptedFiles.length > 0) {
				setFile(acceptedFiles[0]);
			}
		};

		const { getRootProps, getInputProps, isDragActive } = useDropzone({
			onDrop,
			accept: {
				"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
					".xlsx",
				],
			},
			multiple: false,
		});

		const handleImport = async () => {
			if (!file) return;
			setLoading(true);
			try {
				await importMatrix(file);
				setOpen(false);
				setFile(null);
			} finally {
				setLoading(false);
			}
		};

		return (
			<div className="w-full px-8 mb-8 flex-1 flex flex-col">
				<div className="flex w-full items-center py-4 gap-4">
					<h1 className="text-2xl font-semibold">Matriz de Treinamentos</h1>
					<Dialog open={open} onOpenChange={setOpen}>
						<DialogTrigger asChild>
							<Button className="ml-auto" disabled={loading}>
								{loading ? "Importando..." : "Importar matriz"}
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Importar matriz de treinamentos</DialogTitle>

								<DialogDescription>
									Utilize o seletor abaixo para importar um arquivo .xlsx
								</DialogDescription>
							</DialogHeader>
							<div
								{...getRootProps()}
								className="border-2 border-dashed rounded p-6 text-center cursor-pointer mb-4"
							>
								<input {...getInputProps()} />
								{isDragActive ? (
									<p>Solte o arquivo aqui...</p>
								) : file ? (
									<p>
										Arquivo selecionado: <strong>{file.name}</strong>
									</p>
								) : (
									<p>
										Arraste e solte um arquivo .xlsx aqui, ou clique para
										selecionar
									</p>
								)}
							</div>

							<DialogFooter>
								<DialogClose asChild>
									<Button variant="outline" disabled={loading}>
										Cancelar
									</Button>
								</DialogClose>
								<DialogClose asChild>
									<Button onClick={handleImport} disabled={!file || loading}>
										{loading ? "Enviando..." : "Enviar"}
									</Button>
								</DialogClose>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
				{isLoading && (
					<ErrorLoadingMessage message="Carregando matriz de treinamentos..." />
				)}
				{isError && (
					<ErrorLoadingMessage message="Erro ao carregar dados da matriz." />
				)}
				{data && <MatrixTrainings data={data} />}
			</div>
		);
	},
});
