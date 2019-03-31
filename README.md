# 60 seconds news addon for Stremio

### What it is
An addon for Stremio.io that provides streams of live breaking news from all around the world condensed in 60 seconds
by country (At the moment US, Russia and Germany, more to come).

The streams are **created/rendered** and serve by the addon.

### How it works
It consumes a news API (newsapi.org) and renders the payload using a headless browser (PhantomJS), displaying the news title
, a short description, an image and a dynamically generated QR code for easy access to the news source when displaying
it on a TV. Then, it takes screenshots at a predefined frame rate of the rendered result, creating a 60 seconds
video using the images (FFMPEG) and it adds audio background for cinematic reasons. When the videos are ready, it uses
them as source for a stream server and it populates a memory based database that serves as a catalog for Stremio.io.

### How to use it locally (remote test server soon)

- Clone the repo
- `npm install`
- Open .env and change FFMPEG_LOCATION for the location of your FFMPEG binary. (https://ffmpeg.org/)
- Run `node index.js`
- Wait for all 3 videos to render
- Install the addon on Stremio by using `http://127.0.0.1:43000/manifest.json`
- Enjoy your new TV feeds

### Video demostration + fast code overview

<a href="http://www.youtube.com/watch?feature=player_embedded&v=tPwa-Rtl44o" target="_blank">
    <img src="http://img.youtube.com/vi/tPwa-Rtl44o/0.jpg" alt="Video screen" width="520" height="280" border="10"/>
</a>
