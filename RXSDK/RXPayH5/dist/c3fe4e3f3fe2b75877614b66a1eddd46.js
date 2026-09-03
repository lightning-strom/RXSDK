const CACHE_FILE_DATABASE_NAME = "CACHE_FILE_DATABASE_NAME";
const CACHE_FILE_DATABASE_TABLE = "CACHE_FILE_DATABASE_TABLE";
const CACHE_FILE_MAPPING_STORAGE_KEY = "CACHE_FILE_MAPPING_STORAGE_KEY";
const SHOULD_ALLOW_FETCH_FROM_CACHING_STORAGE_KEY =
  "SHOULD_ALLOW_FETCH_FROM_CACHING_STORAGE_KEY";

const CHUNK_SIZE = 2 * 1024 * 1024;

var CACHE_FILE_MAPPING = [];

function getMimeType(fileName) {
  if (fileName.endsWith(".wasm")) return "application/wasm";
  if (fileName.endsWith(".data")) return "application/octet-stream";
  if (fileName.endsWith(".json")) return "application/json";
  if (fileName.endsWith(".png")) return "image/png";

  return "application/octet-stream";
}

async function readDataFromIndexDB(fileName, onChunk) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(CACHE_FILE_DATABASE_NAME);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(CACHE_FILE_DATABASE_TABLE)) {
        db.createObjectStore(CACHE_FILE_DATABASE_TABLE);
      }
    };

    request.onerror = () => reject(request.error);

    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction(CACHE_FILE_DATABASE_TABLE, "readonly");
      const store = tx.objectStore(CACHE_FILE_DATABASE_TABLE);
      const getReq = store.get(fileName);

      getReq.onerror = () => reject(getReq.error);

      getReq.onsuccess = async () => {
        const fileData = getReq.result;
        const fileContent = fileData.parsedBody;
        if (!fileData) {
          reject(new Error("File not found in IndexedDB: " + fileName));
          return;
        }

        if (!(fileContent instanceof Uint8Array)) {
          reject(new Error("File not valid: " + fileName));
          return;
        }

        for (let i = 0; i < fileContent.byteLength; i += CHUNK_SIZE) {
          const end = Math.min(i + CHUNK_SIZE, fileContent.byteLength);
          onChunk(new Uint8Array(fileContent.slice(i, end)));
        }
        db.close();
        resolve();
      };
    };
  });
}

function indexDBFetch(fileName, size) {
  return new Promise((resolve, reject) => {
    const stream = new ReadableStream({
      async start(controller) {
        await readDataFromIndexDB(fileName, (chunk) => {
          controller.enqueue(chunk);
        });
        controller.close();
      },
      cancel: () => {
        reject();
      },
    });

    const response = new Response(stream, {
      status: 200,
      headers: {
        "Content-Type": getMimeType(fileName),
        "Content-Length": size.toString(),
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Range",
        "Accept-Ranges": "bytes",
      },
    });
    resolve(response);
  });
}

function interceptFetch() {
  window._fetchPatched = true;

  window._originalFetch = window.fetch;

  window.fetch = function (input, init) {
    const url = typeof input === "string" ? input : input.url;
    const match = CACHE_FILE_MAPPING.find((m) => url.endsWith(m.name));

    if (match) {
      console.log("match", match);
      return indexDBFetch(match.name, match.size);
    } else {
      return window._originalFetch(input, init);
    }
  };
}

function ensureCacheFileMapping() {
  const raw = localStorage.getItem(CACHE_FILE_MAPPING_STORAGE_KEY);
  if (raw) {
    try {
      CACHE_FILE_MAPPING = JSON.parse(raw);
    } catch (e) {
      console.log("[BUNDLE-FETCH]", "get cache file mapping error", e);
    }
  }
}

async function process() {
  console.log("[BUNDLE-FETCH] process");
  const allowFetchFromCaching = localStorage.getItem(
    SHOULD_ALLOW_FETCH_FROM_CACHING_STORAGE_KEY
  );
  if (!allowFetchFromCaching) {
    console.log("[BUNDLE-FETCH] not allow fetch from caching");
    return;
  }
  console.log("[BUNDLE-FETCH] allow fetch from caching");
  ensureCacheFileMapping();
  interceptFetch();
}

process();
