# web-ytdl

## Install
`docker-compose.yml`
```yml
version: '3.9'
services:
  app:
    container_name: web-ytdl
    image: ghcr.io/iamtakagi/web-ytdl:latest
    environment:
      - TZ=Asia/Tokyo
      - PORT=4200
    restart: unless-stopped
```

## LICENSE
undecided.
