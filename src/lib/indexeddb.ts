export type CharacterClass = "mage" | "warrior" | "priest";

export interface Character {
  id: number;
  createdAt: number;
  name: string;
  class: CharacterClass;
  level: number;
  xp: number;
  gold: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  attack: number;
  defense: number;
  magicPower: number;
}

const DB_NAME = "viberpg-indexeddb";
const DB_VERSION = 1;
const CHARACTER_STORE = "characters";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(CHARACTER_STORE)) {
        const store = db.createObjectStore(CHARACTER_STORE, {
          keyPath: "id",
        });
        store.createIndex("createdAt", "createdAt");
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => console.warn("IndexedDB open blocked");
  });
}

async function withStore<T>(mode: IDBTransactionMode, callback: (store: IDBObjectStore) => Promise<T>): Promise<T> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(CHARACTER_STORE, mode);
    const store = tx.objectStore(CHARACTER_STORE);

    callback(store).then((result) => {
      tx.oncomplete = () => resolve(result);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    }).catch(reject);
  });
}

export async function getCurrentCharacter(): Promise<Character | null> {
  return withStore("readonly", (store) => {
    return new Promise((resolve, reject) => {
      const idx = store.index("createdAt");
      const request = idx.openCursor(null, "prev");
      request.onsuccess = () => {
        const cursor = request.result;
        resolve(cursor ? (cursor.value as Character) : null);
      };
      request.onerror = () => reject(request.error);
    });
  });
}

export async function createCharacter(character: Omit<Character, "id" | "createdAt">): Promise<Character> {
  const record: Character = {
    ...character,
    id: Date.now() + Math.floor(Math.random() * 1000),
    createdAt: Date.now(),
  };

  await withStore("readwrite", (store) => {
    return new Promise((resolve, reject) => {
      const req = store.add(record);
      req.onsuccess = () => resolve(undefined);
      req.onerror = () => reject(req.error);
    });
  });

  return record;
}

export async function updateCharacter(character: Character): Promise<Character> {
  await withStore("readwrite", (store) => {
    return new Promise((resolve, reject) => {
      const req = store.put(character);
      req.onsuccess = () => resolve(undefined);
      req.onerror = () => reject(req.error);
    });
  });

  return character;
}
