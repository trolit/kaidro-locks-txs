import { defineConfig } from "@farmfe/core";

import vue from "@vitejs/plugin-vue";

export default defineConfig({
  compilation: {
    output: {
      // publicPath: "BASE_PATH/REPOSITORY_NAME",
    },

    resolve: {
      alias: {
        "@": `${__dirname}/src`,
      },
    },
  },
  vitePlugins: [vue()],
});
