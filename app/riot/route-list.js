/** @format */

import { toRegexp, toPath } from "@riotjs/route";
import index from "./pages/index.riot";
import sqlite from "./pages/sqlite.riot";
import square from "./pages/square.riot";

const pages = [
  { path: "/", is: "index", component: index },
  { path: "/sqlite", is: "sqlite", component: sqlite },
  { path: "/square/:num", is: "square", component: square },
];

for (const page of pages) {
  page.route = toRegexp(page.path, [], { endsWith: "([#?].*)?" });
}

const makePath = (name, param) =>
  toPath(pages.find((p) => p.is == name).path, param);

const match = (pathname) => {
  for (const page of pages) {
    let res = pathname.match(page.route);
    if (res) {
      res.shift();
      return {
        fetch: page.component.exports.fetch
          ? page.component.exports.fetch
          : () => [],
        args: Array.from(res),
      };
    }
  }
};

export { pages, makePath, match };
