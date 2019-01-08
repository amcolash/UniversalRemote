const server = "http://home.amcolash.com:3000";

const projectorOn = document.getElementById("projectorOn");
const projectorOff = document.getElementById("projectorOff");
const stereoPower = document.getElementById("streroPower");
const stereoVolumeDown = document.getElementById("stereoVolumeDown");
const stereoVolumeUp = document.getElementById("stereoVolumeUp");
const computerPower = document.getElementById("computerPower");

const onlineEl = document.getElementById("online");
const offlineEl = document.getElementById("offline");
const refresh = document.getElementById("refresh");

var onlineState = false;
var computerState = false;
var timeout;
var timer;

// When things load, set things up
window.onload = init;

function init() {
    // Setup service worker
    // if (navigator.serviceWorker) {
    //     navigator.serviceWorker.register('service-worker.js', {
    //         scope: '/'
    //     });
    // }

    // Setup click handlers
    projectorOn.addEventListener("click", () => { request("/projector_on", projectorOn); });
    projectorOff.addEventListener("click", () => { request("/projector_off", projectorOff); });
    stereoPower.addEventListener("click", () => { request("/stereo", stereoPower); });
    stereoVolumeDown.addEventListener("click", () => { request("/stereo_down?volume=-2", stereoVolumeDown); });
    stereoVolumeUp.addEventListener("click", () => { request("/stereo_up?volume=2", stereoVolumeUp); });
    computerPower.addEventListener("click", () => { request(computerState ? "/off" : "/on", computerPower); });
    refresh.addEventListener('click', getStatus);

    // Add a hold down timer
    stereoVolumeUp.addEventListener("mousedown", onDown);
    stereoVolumeDown.addEventListener("mousedown", onDown);
    stereoVolumeUp.addEventListener("touchstart", onDown);
    stereoVolumeDown.addEventListener("touchstart", onDown);
    stereoVolumeUp.addEventListener("mouseup", onUp);
    stereoVolumeDown.addEventListener("mouseup", onUp);
    stereoVolumeUp.addEventListener("touchend", onUp);
    stereoVolumeDown.addEventListener("touchend", onUp);

    // Render SVG
    feather.replace();

    // Poll for status
    getStatus();
}

function onDown() {
    setTimeout(() => handleVolumeHold(stereoVolumeUp), 500);
}

function onUp() {
    if (timer) clearTimeout(timer);
}

function handleVolumeHold(button) {
    var volume = prompt("Enter a volume level");
    if (volume) request("/stereo_volume?volume=" + volume, button);
}

function request(url, button) {
    // Only do the request if there are no active requests
    if (document.getElementsByClassName("spin").length > 0) return;

    button.classList.add("spin");
    axios.get(server + url).then(response => {
        button.classList.remove("spin");

        if (button === computerPower) getStatus();
    }).catch(error => {
        button.classList.remove("spin");
    });
}

function getStatus() {
    if (timeout) clearTimeout(timeout);

    refresh.classList.add("spin");

    axios.get(server).then(response => {
        computerState = response.data.trim() === "Current Status: 1";
        computerPower.getElementsByTagName("svg")[0].classList = computerState ? "green" : "red";
        setOnline(true);

        timeout = setTimeout(getStatus, 15000);
    }).catch(error => {
        console.error(error);
        setOnline(false);

        timeout = setTimeout(getStatus, 15000);
    });
}

function setOnline(online) {
    onlineState = online;
    onlineEl.style.display = online ? "block" : "none";
    offlineEl.style.display = online ? "none" : "block";
    refresh.classList.remove("spin");
}