import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import * as Highcharts from "highcharts";
import HighchartsVue from "highcharts-vue";
import App from "./App.vue";
import router from "./router";
import { VueQueryPlugin } from "@tanstack/vue-query";
import VueAwesomePaginate from "vue-awesome-paginate";
import Vue3ColorPicker from "vue3-colorpicker";
import "vue3-colorpicker/style.css";

// @ts-nocheck
import HighchartsMapModule from "highcharts/modules/map";
HighchartsMapModule(Highcharts);

const app = createApp(App);
const pinia = createPinia();

pinia.use(piniaPluginPersistedstate);
app.use(VueAwesomePaginate);
app.use(Vue3ColorPicker);
app.use(VueQueryPlugin);
app.use(router);
app.use(pinia);
app.use(HighchartsVue, { tagName: "highcharts" });
app.mount("#app");
