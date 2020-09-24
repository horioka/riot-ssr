/** @format */
require("dotenv").config();

class Utils {
  constructor() {
    // 実行環境
    this.isServer = typeof window === "undefined";
    this.title = "";
    this.fetch = this.isServer
      ? require("node-fetch")
      : window.fetch.bind(window);
    this.layoutState = new Map();
  }

  setTitle(title) {
    if (this.isServer) {
      this.title = title;
    } else {
      window.document.title = title;
    }
  }

  getTitle() {
    return this.title;
  }

  async fetchJson(url, options = {}) {
    if (this.isServer && !url.match(/^http/)) {
      url = process.env.INNER_API_HOST + url;
    }
    const data = this.isServer ? new URLSearchParams() : new FormData();
    for (let [key, value] of Object.entries(options)) {
      data.append(key, value);
    }
    return await this.fetch(url, {
      method: "POST",
      body: data,
    }).then(async (res) => await res.json());
  }

  setPrefetchData(data) {
    this.prefetchData = data;
  }

  getPrefetchData() {
    if (this.isServer) {
      return this.prefetchData;
    } else if (window.__PREFETCH_DATA__) {
      const res = window.__PREFETCH_DATA__;
      window.__PREFETCH_DATA__ = undefined;
      return res;
    }
  }

  setStorage(key, value) {
    if (!window) {
      return;
    }
    if (key === "") {
      window.localStorage.setItem("utils", JSON.stringify(value));
      return;
    }
    let store = {};
    if (window.localStorage.getItem("utils")) {
      store = JSON.parse(window.localStorage.getItem("utils"));
    }
    let keys = key.split(".");
    let leaf = keys.pop();
    let cur = store;
    for (const key of keys) {
      if (typeof cur[key] === "undefined") {
        cur[key] = {};
      }
      cur = cur[key];
    }
    cur[leaf] = value;
    window.localStorage.setItem("utils", JSON.stringify(store));
  }

  getStorage(key) {
    if (!window) {
      return;
    }
    if (!window.localStorage.getItem("utils")) {
      return;
    }
    const store = JSON.parse(window.localStorage.getItem("utils"));

    if (!key) {
      return store;
    }
    let keys = key.split(".");
    let leaf = keys.pop();
    let cur = store;
    for (const key of keys) {
      if (typeof cur[key] === "undefined") {
        return;
      }
      cur = cur[key];
    }
    return cur[leaf];
  }

  setLayoutState(name, state) {
    this.layoutState.set(name, state);
  }

  getLayoutState(name) {
    return this.layoutState.get(name);
  }
}

export default new Utils();
