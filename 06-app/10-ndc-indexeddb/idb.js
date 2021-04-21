export class IDB {
   // IDB.db() gives an instance that enables interaction with IndexedDB
   static db(DB_NAME, DB_VERSION, TABLE) {
      return new Promise(function (resolve, reject) {
         // Make sure IndexedDB is supported before attempting to use it
         if (!self.indexedDB) {
            reject("IndexedDB not supported");
         }
         const request = self.indexedDB.open(DB_NAME, DB_VERSION);
         request.onerror = function (event) {
            reject("Database error: " + event.target.error);
         };
         request.onupgradeneeded = function (event) {
            const db = event.target.result;
            const upgradeTransaction = event.target.transaction;
            if (!db.objectStoreNames.contains(TABLE)) {
               DB_NAME = db.createObjectStore(TABLE, {
                  keyPath: "id" // use this as index field
               });
            } else {
               DB_NAME = upgradeTransaction.objectStore(TABLE);
            }
         };
         request.onsuccess = function (event) {
            resolve(event.target.result);
         };
      });
   };

}