import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";

import "./style.css";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";

import App from "./App.vue";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(ElementPlus);
app.mount("#app");
