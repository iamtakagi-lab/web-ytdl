import ytdl from "ytdl-core";
import path from "path";
import fs from "fs";
import Koa from "koa";
import Router from "@koa/router";
import serve from "koa-static";

const app = new Koa();
const router = new Router();

const getYtdlStream = (url: string) => {
  return ytdl(url);
};

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

app.use(serve("./public"));
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(process.env.PORT || 8080);
