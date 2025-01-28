const NUM_BUBBLES = 6;
const BETWEEN_BUBBLE_DELAY = 30 / NUM_BUBBLES;

let current_profile_name = "";

const profiles = {
  "all": {
    "data": [ "yl3", "yl4", "yl5", "ylpop", "finearts", "science", "education" ],
  },
  "young": {
    "data": [ "yl3", "yl4", "yl5", "ylpop" ],
  },
  "ylpop": {
    "data": [ "ylpop" ],
  },
  "finearts": {
    "data": [ "finearts" ],
  },
  "science": {
    "data": [ "science" ],
  },
  "education": {
    "data": [ "education" ],
  },
};

const data = {};

setInterval( showBubble, BETWEEN_BUBBLE_DELAY * 1000 );
setInterval( fetch_curent, 1000 * 60 * 60 * 24 );
set_profile( (new URL(window.location)).searchParams.get("loc") || "all");

async function fetch_one(data_name, version) {
  const response = await fetch(`data/${data_name}.txt?v=${version}`);
  const text = await response.text();
  data[data_name].splice(0,data[data_name].length,...text.split(/[\n\r]+/g));
  data[data_name].version = version;
}

function do_fetch(profile_name) {
  const month = (new Date()).toISOString().substring(0,7);
  if (profile_name in profiles) {
    const profile = profiles[profile_name];
    for (const data_name of profile.data) {
      if (!(data_name in data)) {
        data[data_name] = [];
        data[data_name].version = "1970-01";
      }
      if (data[data_name].version < month) {
        fetch_one(data_name, month);
      }
    }
  }
}

function fetch_curent() {
  do_fetch(current_profile_name);
}

function random_title() {
  const profile = profiles[current_profile_name];
  const total = profile.data.reduce( (acc,v) => acc + data[v].length, 0 );
  let index = Math.floor( Math.random() * total );
  for (const data_name of profile.data) {
    const length = data[data_name].length;
    if (index < length) return data[data_name][index];
    index -= length;
  }
  return "Holes";
}

let Grid_i = 0;
function random_grid() {
  const dx = 0.7548776662466927;
  const dy = 0.5698402909980532;
  Grid_i ++;
  const x = ( dx * Grid_i) % 1.0;
  const y = ( dy * Grid_i) % 1.0;
  return [x,y];
}

function showBubble() {
  const container = document.getElementById("container");
  const line = random_title();
  const bubble = container.children.length >= NUM_BUBBLES ? container.firstElementChild : container.appendChild( document.createElement("div") );
  while(bubble.firstChild) bubble.removeChild(bubble.firstChild);
  bubble.appendChild( document.createTextNode(line) );
  bubble.classList.add("bubble");
  const [x,y] = random_grid();
  bubble.style.left = Math.floor(x*70) + "%";
  bubble.style.top = Math.floor(y*90) + "%";
  container.removeChild(bubble);
  container.appendChild(bubble);
}

function set_profile(profile_name) {
  if (!(profile_name in profiles)) {
    profile_name = Object.keys(profiles)[0];
  }
  if (current_profile_name != profile_name) {
    if (current_profile_name) document.documentElement.classList.remove(current_profile_name);
    current_profile_name = profile_name;
    document.documentElement.classList.add(current_profile_name);
    fetch_curent();
  }
}
