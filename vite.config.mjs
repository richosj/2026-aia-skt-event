import glob from "fast-glob";
import fs from "fs";
import path from "path";
import { defineConfig, loadEnv } from "vite";
import handlebars from "vite-plugin-handlebars";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const basePath = "./";

  // 📂 src/**/*.html 전부 entry
  const htmlFiles = glob.sync("src/**/*.html", {
    ignore: [
      "src/partials/**/*.html",
      "src/components/**/*.html",
      "src/layout/**/*.html",
    ],
  });

  // 📋 메타 추출
  const pageMetaList = htmlFiles.map((file) => {
    const content = fs.readFileSync(file, "utf-8");
    const lines = content.split("\n").slice(0, 10);
    const meta = {};
    lines.forEach((line) => {
      const match = line.match(/@(\w+)\s+(.+?)\s*-->/);
      if (match) {
        const [, key, value] = match;
        meta[key] = value.trim();
      }
    });

    const relative = file.replace(/\\/g, "/").replace(/^src\//, "");
    let name = relative.replace(".html", "");

    if (name.endsWith("/index")) name = name.replace("/index", "");

    return {
      path: relative,
      name,
      title: meta.pageTitle || path.basename(file, ".html"),
      note: meta.pageNote || "",
      created: meta.pageCreated || "",
      updated: meta.pageUpdated || "",
    };
  });

  // 📌 entry (HTML 기준)
  const inputEntries = Object.fromEntries(
    pageMetaList.map((p) => [p.name, path.resolve(__dirname, `src/${p.path}`)])
  );

  return {
    root: "src",
    base: basePath,
    publicDir: path.resolve(__dirname, "public"),

    css: {
      preprocessorOptions: { scss: {} },
    },

    build: {
      outDir: path.resolve(__dirname, "dist"),
      emptyOutDir: true,
      cssCodeSplit: true,
      minify: false,
      assetsInlineLimit: 0,

      rollupOptions: {
        input: inputEntries,

        output: {
          entryFileNames: `assets/js/[name].js`,
          chunkFileNames: `assets/js/[name].js`,
          // 그룹 구분 모두 제거 → 단일 구조
          assetFileNames: `assets/[ext]/[name][extname]`,
        },
      },
    },

    resolve: {
      alias: { "@": path.resolve(__dirname, "src") },
    },

    plugins: [
      handlebars({
        partialDirectory: [
          path.resolve(__dirname, "src/partials"),
          path.resolve(__dirname, "src/components"),
          path.resolve(__dirname, "src/layout"),
        ],
        context(pagePath) {
          const relativePath = pagePath
            .replace(/\\/g, "/")
            .replace(/^src\//, "");

          const current = pageMetaList.find((p) => p.path === relativePath);

          return {
            pages: pageMetaList,
            page: current || {},
          };
        },
      }),

      // HTML cleanup 플러그인 유지
      {
        name: "cleanup-html",
        enforce: "post",
        generateBundle(_, bundle) {
          for (const [fileName, file] of Object.entries(bundle)) {
            if (fileName.endsWith(".html") && file.type === "asset") {
              let html = file.source.toString();

              html = html
                .replace(/<link[\s\S]*?rel=["']modulepreload["'][\s\S]*?>/gi, "")
                .replace(/\s*type=["']module["']/gi, "")
                .replace(/[ \t]+\n/g, "\n")
                .replace(/\n{2,}/g, "\n");

              file.source = html;
            }
          }
          console.log(
            '✅ [cleanup-html] modulepreload / type="module" 제거 완료'
          );
        },
      },
    ],
  };
});
