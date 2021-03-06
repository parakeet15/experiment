'use strict';

// TODO
// IndexedDB への保存機能の実装

const dbName = 'diary';
const storeName = 'diaries'
const openRequest = indexedDB.open(dbName, 2);

openRequest.onupgradeneeded = event => {
  const database = event.target.result;
  database.createObjectStore(storeName, {
    keyPath: 'id',
    autoIncrement: true
  });
}

openRequest.onsuccess = event => {
  const database = event.target.result;
  const transaction = database.transaction(storeName, 'readwrite');
  const objectStore = transaction.objectStore(storeName);
  const putRequest = objectStore.put({
    title: '今日の食べたもの',
    body: 'おにぎり、八宝菜、イカリング',
    createdAt: new Date().toLocaleString()
  });

  putRequest.onsuccess = () => {
    console.info('データの追加に成功しました');
  }

  transaction.oncomplete = () => {
    console.info('トランザクションが完了しました');
  }
}

openRequest.onerror = event => {
  console.error('Error');
}