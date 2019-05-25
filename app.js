const server = "https://home.amcolash.com:9000/remote";

const container = document.getElementsByClassName("container")[0];
const modal = document.getElementById("inputModal");

var onlineState = false;
var computerState = false;
var timeout;
var holdTimer;
var holdCB;

// When things load, set things up
window.onload = init;

function init() {
    // Setup service worker
    if (navigator.serviceWorker) {
        navigator.serviceWorker.register('service-worker.js', {
            scope: '/'
        });
    }

    // Stop the script kiddies - hopefully, since I really don't care all that much...
    const password = "YmF0bWFu";
    if (localStorage.getItem("password") === atob(password)) {
        container.style.display = "flex";
    } else {
        var pass = prompt("Password?");
        if (pass === atob(password)) {
            container.style.display = "flex";
            localStorage.setItem("password", atob(password));
        }
    }

    // Setup click handlers
    projectorOn.addEventListener("click", () => { request("/projector_on", projectorOn); });
    projectorOff.addEventListener("click", () => { request("/projector_off", projectorOff); });
    stereoPower.addEventListener("click", () => { request("/stereo", stereoPower); });
    stereoVolumeDown.addEventListener("click", () => { request("/stereo_down?volume=-2", stereoVolumeDown); });
    stereoVolumeUp.addEventListener("click", () => { request("/stereo_up?volume=2", stereoVolumeUp); });
    hdmiDown.addEventListener("click", () => { request("/hdmi_down", hdmiDown); });
    hdmiUp.addEventListener("click", () => { request("/hdmi_up", hdmiUp); });
    computerPower.addEventListener("click", () => { request(computerState ? "/off" : "/on", computerPower); });
    refresh.addEventListener("click", getStatus);
    modal.addEventListener("click", (e) => { if (e.target === modal) modal.classList.remove("visible"); });
    modalButton.addEventListener("click", () => {
        if (holdCB) {
            holdCB();
            modal.classList.remove("visible");
        }
    });

    // Add a hold down timer
    addHoldListener(stereoVolumeUp, () => handleVolumeHold(stereoVolumeUp));
    addHoldListener(stereoVolumeDown, () => handleVolumeHold(stereoVolumeDown));
    addHoldListener(hdmiDown, () => handleHDMIHold(hdmiDown));
    addHoldListener(hdmiUp, () => handleHDMIHold(hdmiUp));

    // Orientation change handling
    window.onorientationchange = e => {
        if (window.orientation === -90) {
            container.classList.add("oppositeLandscape");
        } else {
            container.classList.remove("oppositeLandscape");
        }
    };

    // Refresh on focus (i.e. switch back from another app)
    window.addEventListener("focus", e => getStatus());

    // Render SVG
    feather.replace();

    // Poll for status
    getStatus();
}

function addHoldListener(button, cb) {
    button.addEventListener("mousedown", () => holdTimer = setTimeout(cb, 500));
    button.addEventListener("touchstart", () => holdTimer = setTimeout(cb, 500));
    button.addEventListener("mouseup", () => { if (holdTimer) clearTimeout(holdTimer); });
    button.addEventListener("touchend", () => { if (holdTimer) clearTimeout(holdTimer); });
}

function handleVolumeHold(button) {
    showModal("Choose a volume level", 0, 30, 15, () => request("/stereo_volume?volume=" + modalValue.value, button));
}

function handleHDMIHold(button) {
    showModal("Choose an HDMI channel", 1, 4, 4, () => request("/hdmi?channel=" + modalValue.value, button));
}

function showModal(message, min, max, current, cb) {
    modal.classList.add("visible");
    modalMessage.innerHTML = message;
    modalValue.min = min;
    modalValue.max = max;
    modalValue.value = current;
    modalDisplay.innerHTML = current;
    holdCB = cb;
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
        var classList = computerPower.getElementsByTagName("svg")[0].classList;
        classList.remove("red");
        classList.remove("green");
        classList.add(computerState ? "green" : "red");
        setOnline(true);

        timeout = setTimeout(getStatus, 15000);
    }).catch(error => {
        console.error(error);
        setOnline(false);

        timeout = setTimeout(getStatus, 15000);
    });
}

function setOnline(onlineState) {
    onlineState = onlineState;
    online.style.display = online ? "block" : "none";
    offline.style.display = online ? "none" : "block";
    refresh.classList.remove("spin");
}