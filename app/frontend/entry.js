/** @format */
import "babel-polyfill";
import "@riotjs/hot-reload";
import hydrate from "@riotjs/hydrate";
import routeBase from "../riot/route-base.riot";

hydrate(routeBase)(document.querySelector('div[is="route-base"]'));
