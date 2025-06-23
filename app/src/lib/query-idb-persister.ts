import type { Persister } from "@tanstack/react-query-persist-client";
import { openDB } from "idb";

const DB_NAME = "tanstack-query-cache";
const STORE_NAME = "query-cache";
const KEY = "cache";

export async function createIDBPersister(): Promise<Persister> {
	const db = await openDB(DB_NAME, 1, {
		upgrade(db) {
			if (!db.objectStoreNames.contains(STORE_NAME)) {
				db.createObjectStore(STORE_NAME);
			}
		},
	});

	return {
		persistClient: async (client) => {
			await db.put(STORE_NAME, client, KEY);
		},
		restoreClient: async () => {
			return (await db.get(STORE_NAME, KEY)) ?? null;
		},
		removeClient: async () => {
			await db.delete(STORE_NAME, KEY);
		},
	};
}
