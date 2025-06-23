import { useEffect, useState } from "react";
import { getQueue, removeFromQueue } from "@/lib/mutation-queue";
import { useQueryClient } from "@tanstack/react-query";
import { env } from "@/env";

export function SyncManager() {
	const [status, setStatus] = useState<
		"online" | "offline" | "syncing" | "idle"
	>(navigator.onLine ? "online" : "offline");
	const queryClient = useQueryClient();

	useEffect(() => {
		const handleOnline = () => setStatus("online");
		const handleOffline = () => setStatus("offline");
		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);
		return () => {
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
		};
	}, []);

	useEffect(() => {
		if (status === "online") {
			(async () => {
				const queue = await getQueue();
				if (queue.length > 0) {
					setStatus("syncing");
					try {
						const res = await fetch(`${env.VITE_API_URL}/sync/changes`, {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({ changes: queue }),
						});
						if (res.ok) {
							for (const item of queue) {
								await removeFromQueue(item.id);
							}
							setStatus("idle");
							queryClient.invalidateQueries();
						} else {
							setStatus("online");
						}
					} catch {
						setStatus("online");
					}
				} else {
					setStatus("idle");
				}
			})();
		}
	}, [status, queryClient]);

	let label = "";
	if (status === "offline") label = "Offline";
	else if (status === "syncing") label = "Sincronizando...";
	else if (status === "idle") label = "Dados sincronizados";

	return label ? (
		<div style={{ position: "fixed", bottom: 16, right: 16, zIndex: 1000 }}>
			<span
				style={{
					background:
						status === "offline"
							? "#f87171"
							: status === "syncing"
								? "#fbbf24"
								: "#34d399",
					color: "#fff",
					padding: "8px 16px",
					borderRadius: 8,
					fontWeight: 600,
				}}
			>
				{label}
			</span>
		</div>
	) : null;
}
