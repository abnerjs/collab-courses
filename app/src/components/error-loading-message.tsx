interface ErrorLoadingMessageProps {
	message: string;
}

export const ErrorLoadingMessage = ({ message }: ErrorLoadingMessageProps) => {
	return (
		<div className="flex flex-col items-center justify-center h-full flex-1">
			<p className="font-semibold text-2xl">{message}</p>
		</div>
	);
};
