import { changeTrainings } from "@/services/change-trainings";
import type { TrainingsResponse } from "@/services/get-trainings";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import {
	AutoSizer,
	CellMeasurer,
	CellMeasurerCache,
	MultiGrid,
} from "react-virtualized";

const STYLE = {
	border: "1px solid #ddd",
};
const STYLE_BOTTOM_LEFT_GRID = {
	borderRight: "2px solid #aaa",
	backgroundColor: "#f7f7f7",
};
const STYLE_TOP_LEFT_GRID = {
	borderBottom: "2px solid #aaa",
	borderRight: "2px solid #aaa",
	fontWeight: "bold",
};
const STYLE_TOP_RIGHT_GRID = {
	borderBottom: "2px solid #aaa",
	fontWeight: "bold",
};

interface MatrixProps {
	data: TrainingsResponse;
}

export function MatrixTrainings({ data }: MatrixProps) {
	const queryClient = useQueryClient();
	const handleChangeStatus = async (
		treinamentoId: string,
		cargoId: string,
		status: boolean,
	) => {
		const response = await changeTrainings(treinamentoId, cargoId, status);
		if (!response.success) {
			queryClient.setQueryData(
				["matriz-treinamentos"],
				(oldData?: TrainingsResponse) => {
					if (oldData) return oldData;
				},
			);
		}
	};

	const columnCount = data.treinamentos.length + 1;
	const rowCount = data.cargos.length + 1;
	const cache = React.useRef(
		new CellMeasurerCache({
			defaultHeight: 40,
			defaultWidth: 120,
			fixedHeight: true,
			minWidth: 80,
		}),
	).current;

	return (
		<div className="w-full flex flex-1">
			<div className="flex flex-1 border rounded-lg">
				<AutoSizer className="rounded-lg">
					{({ width, height }) => (
						<MultiGrid
							fixedColumnCount={1}
							className="rounded-lg"
							fixedRowCount={1}
							cellRenderer={({ columnIndex, key, rowIndex, style, parent }) => {
								return (
									<CellMeasurer
										cache={cache}
										columnIndex={columnIndex}
										key={key}
										parent={parent}
										rowIndex={rowIndex}
									>
										{({ measure, registerChild }) => {
											const cellClass = `border border-zinc-200 bg-white px-2 py-1 box-border${
												rowIndex === 0 || columnIndex === 0
													? " font-bold bg-zinc-50"
													: ""
											}`;
											if (rowIndex === 0 && columnIndex === 0) {
												return (
													<div
														ref={registerChild}
														style={style}
														onLoad={measure}
														className={cellClass}
													>
														<b>Cargo</b>
													</div>
												);
											}
											if (rowIndex === 0 && columnIndex > 0) {
												return (
													<div
														ref={registerChild}
														style={style}
														onLoad={measure}
														className={`${cellClass} whitespace-nowrap`}
													>
														<b>{data.treinamentos[columnIndex - 1].nome}</b>
													</div>
												);
											}
											if (rowIndex > 0 && columnIndex === 0) {
												return (
													<div
														ref={registerChild}
														style={style}
														onLoad={measure}
														className={`${cellClass} whitespace-nowrap`}
													>
														{data.cargos[rowIndex - 1].descricao}
													</div>
												);
											}
											if (rowIndex > 0 && columnIndex > 0) {
												const cargo = data.cargos[rowIndex - 1];
												const treinamento = data.treinamentos[columnIndex - 1];
												const status = cargo.treinamentos.some(
													(t) => t.id === treinamento.id,
												);
												return (
													<div
														ref={registerChild}
														style={style}
														onLoad={measure}
														className={`${cellClass} flex items-center justify-center`}
													>
														<input
															type="checkbox"
															checked={status}
															onChange={() =>
																handleChangeStatus(
																	treinamento.id,
																	cargo.id,
																	!status,
																)
															}
															className="accent-zinc-950 size-4"
														/>
													</div>
												);
											}
											return null;
										}}
									</CellMeasurer>
								);
							}}
							columnWidth={cache.columnWidth}
							columnCount={columnCount}
							enableFixedColumnScroll
							enableFixedRowScroll
							height={height}
							rowHeight={40}
							rowCount={rowCount}
							style={{}}
							styleBottomRightGrid={{ ...STYLE }}
							styleBottomLeftGrid={STYLE_BOTTOM_LEFT_GRID}
							styleTopLeftGrid={STYLE_TOP_LEFT_GRID}
							styleTopRightGrid={STYLE_TOP_RIGHT_GRID}
							width={width}
							hideTopRightGridScrollbar
							hideBottomLeftGridScrollbar
						/>
					)}
				</AutoSizer>
			</div>
		</div>
	);
}
