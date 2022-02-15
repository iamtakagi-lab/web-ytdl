import ytdl from "ytdl-core";
import path from "path";
import fs from "fs";
import Koa from "koa";
import Router from "@koa/router";
import serve from "koa-static";

const app = new Koa();
const router = new Router();

type Quality = 'lowest' | 'highest' | 'highestaudio' | 'lowestaudio' | 'highestvideo' | 'lowestvideo' | string | number | string[] | number[];

const getYtdlStream = (url: string, quality: Quality) => {
  return ytdl(url, {quality});
};

router.get("/download", async (ctx, next) => {
  const url = ctx.query.url;
  const quality = ctx.query.quality;
  if (!url || typeof url != "string") return next();
  if (!quality || typeof quality != "string") return next();
  const id = new URL(url).searchParams.get("v") 
  if (!id || typeof id != "string") return next();
  ctx.type = "video/mp4";
  ctx.attachment(`${id}.mp4`);
  const destFilePath = path.resolve(__dirname, "..", "tmp", `${id}.mp4`);
  ctx.body = await new Promise<fs.ReadStream>((resolve) => {
    const stream = getYtdlStream(url, quality);
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
