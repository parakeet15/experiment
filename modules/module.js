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

export { removeAllChildren, Diary };