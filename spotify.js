let currentSong = new Audio();
const previous = document.querySelector("#previous");
const next = document.querySelector("#next");
const loop = document.querySelector("#loop");
const shuffle = document.querySelector("#shuffle");
let songs;
let isloop = false;
function secondsToMinutesAndSeconds(seconds) {
  // Ensure the input is a non-negative number
  seconds = Math.max(0, seconds);

  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = Math.floor(seconds % 60);

  let formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  let formattedSeconds =
    remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;

  return formattedMinutes + ":" + formattedSeconds;
}

async function getSongs() {
  let a = await fetch("http://127.0.0.1:5500/songs/");
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");

  let songs = [];
  for (let i = 0; i < anchors.length; i++) {
    const element = anchors[i];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("songs/")[1]);
    }
  }
  return songs;
}

function playMusic(track, pause = false) {
  // let audio = new Audio("/spotify%20project/songs/" + track);
  currentSong.src = "songs/" + track;

  if (!pause) {
    currentSong.play();
    play.src = "./svgss/pause.svg";
  }
  document.querySelector(".songInfo").innerHTML = decodeURI(track);
  document.querySelector(".songTime").innerHTML = "00:00 / 00:00";
}
async function main() {
  // get the list of all the songs
  songs = await getSongs("/spotify/songs/");
  playMusic(songs[0], true);

  // Show all the songs in the playlist
  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li>
    <img src="svgss/musicicon.svg" class="invert musicicon">
    <div class="info">
      <div>${song.replaceAll("%20", " ")}</div>
      <div>Swastik</div>
    </div>
    <div class="playNow">
      <div class="pl">Play</div>
      <div class=pl2>Now</div>
      <img src="svgss/play.svg" class="invert">
    </div>
    </li>`;
  }

  // // play the first song
  // let audio = new Audio(songs[2]);
  // // audio.play();

  // Attach an event listener to each song

  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim()); //trim removes all the spaces
    });
  });

  // Attach an event listener to prev/play/next

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "svgss/pause.svg";
    } else {
      currentSong.pause();
      play.src = "svgss/play.svg";
    }
  });

  //listen for timeupdate event

  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songTime").innerHTML = `
    ${secondsToMinutesAndSeconds(
      currentSong.currentTime
    )} / ${secondsToMinutesAndSeconds(currentSong.duration)}`;

    //dynamically changing the seekbar circle's position.
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  // Add an event listener to seekbar

  // over here we're trying to change the "left" attribute of the circle on the seekbar as a response to the location
  // of our click event on the seekbar.
  // the offset.X gives the horizontal position of our pointer on the element, whereas the getBoundingClientRect().width
  // tells us the total of what we could have clicked if we wanted to. (basically the width of the entire target element);

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  // Add an event listener for hamburger

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = 0;
  });
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = -120 + "%";
  });

  // adding event listeners to prev and next

  previous.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });
  next.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });

  //add an event to volume
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      currentSong.volume = parseInt(e.target.value) / 100;
    });

  // adding functionality to the loop button
  loop.addEventListener("click", () => {
    if (!loop.classList.contains("clicked")) {
      loop.classList.add("clicked");
      loop.classList.remove("invert");
      loop.src = "svgss/loop-colored.svg";
    } else {
      loop.classList.remove("clicked");
      loop.classList.add("invert");
      loop.src = "svgss/arrow-reload-horizontal.svg";
    }
    if (isloop == false) {
      isloop = true;
      currentSong.loop = isloop;
    } else {
      isloop = false;
      currentSong.loop = isloop;
    }
  });

  //adding autoplaying function to the app
}
main();
