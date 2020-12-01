'use strict';

/**
 * 指定した要素の子要素を全削除する
 * @param {HTMLElement} element 
 */
function removeAllChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

/**
 * 日記
 */
class Diary {
  /**
   * 内容
   * @param {string} title 題名
   * @param {string} content 本文
   * @param {string} createdAt 作成日時
   * @param {string} updatedAt 更新日時
   */
  constructor(title, content, createdAt, updatedAt) {
    this.title = title;
    this.content = content;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

/**
 * ユーザーに通知を送信する
 * @param {string} title タイトル
 * @param {string} body 本文文字列
 * @param {string} icon アイコンの画像 URL
 */
function notification(title, body, icon) {
  // 通知 API に対応しているか確認する
  if (!('Notification' in window)) {
    alert('ブラウザ通知はサポートされていません');
    return;
  }

  // 通知の許可状態で処理を分ける
  switch (Notification.permission) {
    case 'granted':
      createNotification(title, body, icon);
      break;
    case 'denied':
      console.info('通知が拒否されています');
      break;
    case 'default':
      permissionNotification();
      break;
  }
}

/**
 * 通知を作成する
 * @param {string} title タイトル
 * @param {string} body 本文文字列
 * @param {string} icon アイコンの画像 URL
 */
function createNotification(title, body, icon) {
  const options = { body, icon };
  const notification = new Notification(title, options);
  notification.onshow = () => console.info('通知が正常に表示されました');
  notification.onerror = () => console.warn('通知で問題が発生しました');
  notification.onclick = () => {
    notification.close();
    notification.onclose = () => window.open('https://parakeet15.github.io/experiment/', '_blank');
  }
}

/**
 * 通知の許可を要求する
 */
function permissionNotification() {
  Notification.requestPermission().then(permission => {
    console.info(`Permission: ${permission}`);
    alert('通知の表示を許可しました');
  });
}

export { notification, removeAllChildren, Diary };