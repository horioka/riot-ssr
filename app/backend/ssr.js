/** @format */
import utils from "../model/utils.js";
import { renderAsyncFragments as render } from "@riotjs/ssr";

const unregister = require("@riotjs/ssr/register")();
const routeBase = require(`../riot/route-base.riot`).default;

const getHtml = (args) => {
  return `<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${args.title}</title>
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/fomantic-ui@2.8.5/dist/semantic.min.css">
    <script src="https://cdn.jsdelivr.net/npm/jquery@3.3.1/dist/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/fomantic-ui@2.8.5/dist/semantic.min.js"></script>
    <script>
      window.__PREFETCH_DATA__=${JSON.stringify(args.prefetchData)};
    </script>
    <style>${args.css}</style>
  </head>
  <body>
    ${args.body}
  </body>
  <script src="/js/script.js"></script>
</html>`;
};

export default {
  register: (router) => {
    router.get("*", async (req, res, next) => {
      // ルートに対応するコンポーネントを取得
      const route = routeBase.exports.match(req.originalUrl);
      if (route) {
        // コンポーネントのfetch
        const prefetchData = await route.fetch(route.args);
        // fetchしたデータを登録
        utils.setPrefetchData(prefetchData);
        const url = `${req.protocol}://${req.hostname}${req.originalUrl}`;
        // レンダリング
        const { html, css } = await render("div", routeBase, {}, { url });
        res.send(
          getHtml({ title: utils.getTitle(), prefetchData, css, body: html })
        );
        return;
      }
      next();
    });
  },
};
