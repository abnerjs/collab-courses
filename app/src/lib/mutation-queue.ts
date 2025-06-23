import { openDB } from "idb";

const DB_NAME = "mutation-queue";
const STORE_NAME = "queue";

export type MutationQueueItem = {
	id: string; // uuid
	table: string;
	operation: "create" | "update" | "delete";
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	data: any;
	createdAt: number;
};

export async function getQueue() {
	const db = await openDB(DB_NAME, 1, {
		upgrade(db) {
			if (!db.objectStoreNames.contains(STORE_NAME)) {
				db.createObjectStore(STORE_NAME, { keyPath: "id" });
			}
		},
	});
	return db.getAll(STORE_NAME) as Promise<MutationQueueItem[]>;
}

export async function addToQueue(item: MutationQueueItem) {
	const db = await openDB(DB_NAME, 1);
	await db.put(STORE_NAME, item);
}

export async function removeFromQueue(id: string) {
	const db = await openDB(DB_NAME, 1);
	await db.delete(STORE_NAME, id);
}

export async function clearQueue() {
	const db = await openDB(DB_NAME, 1);
	await db.clear(STORE_NAME);
}
