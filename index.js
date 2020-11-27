'use strict';

// モジュール
// import { removeAllChildren, Diary } from './modules/module.js';

// ツールバー
const createButton = document.getElementById('create-button');
const saveButton = document.getElementById('save-button');
const deleteButton = document.getElementById('delete-button');
const addFileInput = document.getElementById('add-file-input');

// メインコンテンツ
const titleArea = document.getElementById('title-area');
const contentArea = document.getElementById('content-area');
const writeDate = document.getElementById('write-date');
const saveList = document.getElementById('save-list');

// ドラッグ禁止
document.ondragstart = () => false;

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
 * リストアイテムのスタイルを設定する
 * @param {HTMLElement} listItem 選択した項目
 */
function listStyle(listItem) {
    for (let savedItem of saveList.getElementsByClassName('saved-item')) {
        savedItem.style.display = 'flex';
        savedItem.style.backgroundColor = '#ffffff';
        listItem.style.backgroundColor = '#eeeeee';
    }
}

// 画像、動画を添付する
addFileInput.addEventListener('change', event => {
    const file = event.target.files[0];
    addFileInput.value = null;
    if (file.size >= (1 * 1024 * 1024)) {
        alert(`“${file.name}”を添付できませんでした。\n1MB以下のファイルを添付できます。`);
        return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = e => {
        const url = e.target.result;
        if (file.type === 'video/mp4') {
            contentArea.innerHTML += `<video src="${url}" controls></video>`;
        } else {
            contentArea.innerHTML += `<img src="${url}">`;
        }
    }
}, false);

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
 * ローカルストレージに記事を保存する
 * @param {String} key 保存するキーの名称
 */
function save(key) {
    if (!titleArea.value.length) titleArea.value = `Untitled`;
    const title = titleArea.value;
    const content = contentArea.innerHTML;
    const updatedAt = new Date().toLocaleString();
    const createdAt = new Date(parseInt(key.split('_')[1])).toLocaleString();
    const diary = new Diary(title, content, createdAt, updatedAt);
    try {
        localStorage.setItem(key, JSON.stringify(diary));
    } catch (error) {
        titleArea.value = null;
        load(saveList.querySelector(`li[data-key="${key}"]`) || saveList.firstChild);
        alert(`“${diary.title}”を保存できませんでした。\nローカルストレージの空き領域が不足しています。`);
        console.warn(`ローカルストレージの空き領域が不足しています`, error);
    }
    addToList(key);
}

/**
 * 保存したデータをリストに追加する
 * @param {String} key キーの名称
 */
function addToList(key) {
    const container = document.createElement('div');
    const video = document.createElement('video');
    const image = document.createElement('img');
    const title = document.createElement('h3');
    const text = document.createElement('p');
    container.className = 'container';
    video.className = 'thumbnail';
    image.className = 'thumbnail';
    title.className = 'list-title';
    text.className = 'list-text';
    if (contentArea.getElementsByTagName('video').length) {
        video.setAttribute('loop', '');
        video.setAttribute('muted', '');
        video.setAttribute('autoplay', '');
        video.setAttribute('disablepictureinpicture', '');
        video.src = contentArea.getElementsByTagName('video')[0].src;
        container.appendChild(video);
    } else if (contentArea.getElementsByTagName('img').length) {
        image.src = contentArea.getElementsByTagName('img')[0].src;
        container.appendChild(image);
    } else {
        image.src = './images/no-image.png';
        container.appendChild(image);
    }
    title.innerText = titleArea.value;
    container.appendChild(title);
    text.innerText = contentArea.textContent;
    container.appendChild(text);
    titleArea.value = null;
    if (saveList.querySelector(`li[data-key="${key}"]`)) {
        const savedItem = saveList.querySelector(`li[data-key="${key}"]`);
        removeAllChildren(savedItem);
        savedItem.appendChild(container);
        load(savedItem);
    } else {
        const savedItem = document.createElement('li');
        savedItem.className = 'saved-item';
        savedItem.dataset.key = key;
        savedItem.setAttribute('onclick', 'load(this)');
        savedItem.appendChild(container);
        saveList.insertBefore(savedItem, saveList.firstChild);
        load(savedItem);
    }
}

// 新規作成
createButton.addEventListener('click', create, false);

/**
 * 新しく記事を作成する
 */
function create() {
    titleArea.value = null;
    removeAllChildren(contentArea);
    removeAllChildren(writeDate);
    save(`diary_${Date.now()}`);
}

/**
 * 引数に渡されたキーを削除する
 * @param {String} key 削除するキーの名称
 */
function remove(key) {
    localStorage.removeItem(key);
    if (saveList.querySelector(`li[data-key="${key}"]`)) {
        saveList.querySelector(`li[data-key="${key}"]`).remove();
    }
    saveList.firstChild ? load(saveList.firstChild) : create();
}

/**
 * ローカルストレージからデータを取得して表示する
 * @param {String} key 取得するキーの名称
 */
function output(key) {
    const diary = JSON.parse(localStorage.getItem(key));
    titleArea.value = diary.title;
    contentArea.innerHTML = diary.content;
    writeDate.innerText = diary.updatedAt;
}

/**
 * 引数に渡された要素の情報を取得して操作する
 * @param {HTMLElement} listItem 選択した要素
 */
function load(listItem) {
    listStyle(listItem);
    listItem.scrollIntoView({ behavior: 'smooth' });
    const key = listItem.dataset.key;
    if (localStorage.getItem(key)) {
        try {
            output(key);
        } catch (error) {
            remove(key);
            console.warn(`“${key}” のデータを取得できませんでした`, error);
        }
        saveButton.onclick = () => save(key);
        deleteButton.onclick = () => remove(key);
    } else {
        remove(key);
        console.warn(`“${key}” の値を取得できません`);
    }
}

// ページ読み込み時
window.onload = () => {
    const items = new Array();
    for (let i = 0; i < localStorage.length; i++) {
        items.push(localStorage.key(i));
    }
    const keys = items
        .filter(item => /diary_\d+/.test(item))
        .sort((a, b) => parseInt(a.split('_')[1]) - parseInt(b.split('_')[1]));
    if (keys.length === 0) {
        create();
        return;
    }
    keys.forEach((key, index) => {
        try {
            output(key);
            addToList(key);
            console.info(`${index}: ${key}`);
        } catch (error) {
            remove(key);
            console.warn(`“${key}” のデータを取得できませんでした`, error);
        }
    });
    console.assert(
        keys.length === saveList.childElementCount,
        `リストの項目数が正しくありません`
    );
}