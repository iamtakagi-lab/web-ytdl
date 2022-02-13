import ytdl from "ytdl-core";
import path from "path";
import fs from "fs";
import { renderIndex } from "./page";
import $ from "transform-ts";
import Koa from "koa";
import Router from "@koa/router";

const app = new Koa();
const router = new Router();

const getYtdlStream = (url: string) => {
  return ytdl(url);
};

try {
  const STATIC_DIR = __dirname + "/../static";
  const allowedFiles = fs.readdirSync(STATIC_DIR);

  if (allowedFiles.length)
    router.get("/static/:filename", async (ctx, next) => {
      const filename = $.string.transformOrThrow(ctx.params.filename);
      if (!allowedFiles.includes(filename)) return next();
      const ext = filename.split(".");
      ctx.type =
        (
          {
            js: "application/javascript",
            css: "text/css",
          } as { [key: string]: string }
        )[ext.slice(-1)[0]] ?? "application/octet-stream";
      ctx.body = fs.createReadStream(STATIC_DIR + "/" + filename);
    });
} catch (e) {}

router.get("/", (ctx) => {
  ctx.body = renderIndex();
});

router.get("/download", async (ctx, next) => {
  const url = ctx.query.url;
  if(!url || typeof url != "string") return next()
  const id = new URL(url).searchParams.get("v") 
  ctx.type = "video/mp4";
  ctx.attachment(`${id}.mp4`);
  const destFilePath = path.resolve(__dirname, "..", "tmp", `${id}.mp4`);
  ctx.body = await new Promise<fs.ReadStream>((resolve) => {
    const stream = getYtdlStream(url);
    stream.pipe(fs.createWriteStream(destFilePath));
    stream.on("end", () => {
      return resolve(fs.createReadStream(destFilePath))
    });
    stream.on("error", (err: Error) => {
      console.error(err);
    });
  })
  fs.unlinkSync(destFilePath)
});

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(process.env.PORT || 8080);
