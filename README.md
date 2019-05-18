# 60 seconds news addon for Stremio


<img src="https://i.giphy.com/media/SGGHF3IeEhdDsZgY4e/source.gif" />


### Production server
**https://60secondsnews.xyz:43000/manifest.json**

### Updates

##### Release 18/05/2019
- Small fixes to support production release, mostly HTTPS support.


##### Release 17/05/2019
- Huge refactory made for the streams management. All is now handle in configuration rather than code, check config.js.

- Caching was added to video rendering, now when the remote api data is the same, the video is not re rendered.

- Added Japan, Cina, Argentina, Venezuela and Mexico.

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

### How to use it locally

1. Clone the repo
2. `npm install`
3. Open .env and change FFMPEG_LOCATION with the location of your FFMPEG binary. (https://ffmpeg.org/)
   * If you have FFMPEG installed globally (`sudo apt install ffmpeg`   on linux), use `FFMPEG_LOCATION=ffmpeg`
   * If you have an static binary, copy the location of it, for example if it is located in the project root: `FFMPEG_LOCATION=./ffmpeg` (*)
4. Run `node index.js`
5. Wait for all 3 videos to render, depending on your system and the framerate selected, this step could take anything from a few
seconds to several minutes. Wait for this log line to appear for each video: `node(25064) [INFO - http://127.0.0.1:4986/news.html#?country=us] : New video generated {"id":"28a643e48623e86130e39745ef16f186f8fdb406"}`

6. Install the addon on Stremio by using `http://127.0.0.1:43000/manifest.json`
7. Enjoy your new TV feeds


(*) *Note for Windows users: This package does not support Windows, BUT, if you insist you can use it by using a full path to FFMPEG. The code wont be
able to clean the screenshots since the clean commands are Linux commands.*

### Video demostration + fast code overview

<a href="http://www.youtube.com/watch?feature=player_embedded&v=tPwa-Rtl44o" target="_blank">
    <img src="http://img.youtube.com/vi/tPwa-Rtl44o/0.jpg?r=123" alt="Video screen" width="520" height="400" border="10"/>
</a>

**Due to recent big updates, some parts of the video related to the code walkthrough may not coincide with the recent state of the repo**

### TODO

- [x] Add HTTPS support for production release (or maybe use Nginx as proxy)

- [ ] Improve rendering speed by using async statements were possible.

- [x] Add API payload cache/sign to prevent video rendering when the content did not changed.