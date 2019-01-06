const server = "http://home.amcolash.com:3000";

const projectorOn = document.getElementById("projectorOn");
const projectorOff = document.getElementById("projectorOff");
const stereoPower = document.getElementById("streroPower");
const stereoVolumeDown = document.getElementById("stereoVolumeDown");
const stereoVolumeUp = document.getElementById("stereoVolumeUp");
const computerPower = document.getElementById("computerPower");

const onlineEl = document.getElementById("online");
const offlineEl = document.getElementById("offline");

var onlineState = false;
var computerState = false;

// When things load, set things up
window.onload = init;

function init() {
    // Setup service worker
    navigator.serviceWorker.register('service-worker.js', {
        scope: '/'
    });

    // Setup click handlers
    projectorOn.addEventListener("click", () => { axios.get(server + "/projector_on"); });
    projectorOff.addEventListener("click", () => { axios.get(server + "/projector_off"); });
    stereoPower.addEventListener("click", () => { axios.get(server + "/stereo"); });
    stereoVolumeDown.addEventListener("click", () => { axios.get(server + "/stereo_down"); });
    stereoVolumeUp.addEventListener("click", () => { axios.get(server + "/stereo_up"); });
    computerPower.addEventListener("click", () => { axios.get(server + (computerState ? "/off" : "/on")); });

    // Render SVG
    feather.replace();

    // Poll for status
    getStatus();
    setInterval(getStatus, 5000);
}

function getStatus() {
    axios.get(server).then(response => {
        computerState = response.data.trim() === "Current Status: 1";
        computerPower.getElementsByTagName("svg")[0].classList = computerState ? "green" : "red";
        setOnline(true);
    }).catch(error => {
        console.error(error);
        setOnline(false);
    });
}

function setOnline(online) {
    onlineState = online;
    onlineEl.style.display = online ? "block" : "none";
    offlineEl.style.display = online ? "none" : "block";
}