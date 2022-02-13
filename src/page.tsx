import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

const Index = () => {
  return (
    <html>
      <head>
        <title>web-ytdl</title>
        <link rel="stylesheet" href="/static/style.css" />
        <script src="/static/script.js" defer />
        <meta name="twitter:card" content="summary" />
        <meta property="og:title" content="web-ytdl" />
        <meta property="og:description" content="web-ytdl" />
      </head>
      <body>
        <div id="app">
          <main>
            <section>
              <h1>web-ytdl</h1>
              <p>
                YouTubeの動画をダウンロードするための実験的なツール
              </p>
              <div>
                <label htmlFor="url">動画のURL</label>
                <input
                  id="url"
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=???"
                />
                <button id="download">ダウンロード</button>
              </div>
            </section>
          </main>
          <footer>
            <hr />
            <p>
              GitHub: <a href="https://github.com/iamtakagi/web-ytdl">https://github.com/iamtakagi/web-ytdl</a>
            </p>
            <p>
              Author: <a href="https://github.com/iamtakagi">iamtakagi</a>
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
};

const renderIndex = () => renderToStaticMarkup(<Index />);

export { renderIndex };
