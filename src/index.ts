import ytdl from "ytdl-core";
import path from "path";
import express from "express";
import { spawn } from "child_process";
import stream from "stream";
const app = express();

app.get("/download", async (req, res, next) => {
  const url = req.query.url;
  if (!url || typeof url != "string") return next();
  const info = await ytdl.getInfo(url);
  const audioStream = ytdl.downloadFromInfo(info, { quality: 'highestaudio' });
  const videoStream = ytdl.downloadFromInfo(info, { quality: 'highestvideo' });
  //映像と音声を結合するエンコード処理
  const ffmpeg = spawn("ffmpeg", [
      '-loglevel', '8', '-hide_banner',
      '-i', 'pipe:3', '-i', 'pipe:4',
      '-map', '0:a', '-map', '1:v',
      '-c', 'copy',
      '-f', 'matroska', 'pipe:5'
  ], {
      // Windowsの場合、ポップアップが出ないようにする
      windowsHide: true,
      stdio: [
          'inherit', 'inherit', 'inherit',
          'pipe', 'pipe', 'pipe'
      ]
  }) as any
  //用意したパイプに流し込む
  audioStream.pipe(ffmpeg.stdio[3]);
  videoStream.pipe(ffmpeg.stdio[4]);
  //エンコード結果をストリーム化
  const resultStream = ffmpeg.stdio[5].pipe(new stream.PassThrough({highWaterMark: 1920 * 1080}))
  res.contentType("video/mp4");
  res.attachment(`${info.videoDetails.title}.mp4`);
  resultStream.pipe(res, {end: true})
  res.on("close", () => ffmpeg.kill())
});

app.use(express.static(path.resolve(__dirname, "..", "public")));
app.listen(process.env.PORT || 8080);