const server = 'https://home.amcolash.com:9090/remote';
const ledSpectrum = 'https://home.amcolash.com:9090/spectrum';

const container = document.getElementsByClassName('container')[0];
const modal = document.getElementById('inputModal');

let onlineState = false;
let computerState = false;
let spectrumState = false;
let spectrumBrightnessState = -1;
let timeout;
let holdTimer;
let holdCB;

// When things load, set things up
window.onload = init;

function init() {
  // Setup service worker
  if (navigator.serviceWorker) {
    navigator.serviceWorker.register('service-worker.js', {
      scope: window.location.pathname,
    });
  }

  // Stop the script kiddies - hopefully, since I really don't care all that much...
  const password = 'YmF0bWFu';
  if (localStorage.getItem('password') === atob(password)) {
    container.style.display = 'flex';
  } else {
    const pass = prompt('Password?');
    if (pass === atob(password)) {
      container.style.display = 'flex';
      localStorage.setItem('password', atob(password));
    }
  }

  // Setup click handlers
  projectorOn.addEventListener('click', () => {
    request('/projector_on', projectorOn);
  });
  projectorOff.addEventListener('click', () => {
    request('/projector_off', projectorOff);
  });
  stereoOn.addEventListener('click', () => {
    request('/stereo_on', stereoOn);
  });
  stereoOff.addEventListener('click', () => {
    request('/stereo_off', stereoOff);
  });
  stereoVolumeDown.addEventListener('click', () => {
    request('/stereo_down?volume=-2', stereoVolumeDown);
  });
  stereoVolumeUp.addEventListener('click', () => {
    request('/stereo_up?volume=2', stereoVolumeUp);
  });
  hdmiDown.addEventListener('click', () => {
    request('/hdmi_down', hdmiDown);
  });
  hdmiUp.addEventListener('click', () => {
    request('/hdmi_up', hdmiUp);
  });
  computerPower.addEventListener('click', () => {
    request(computerState ? '/off' : '/on', computerPower);
  });
  spectrumPower.addEventListener('click', () => {
    if (spectrumBrightnessState === -1) {
      requestPost('/brightness?brightness=1', spectrumPower);
    } else {
      requestPost('/brightness?brightness=-1', spectrumPower);
    }
  });
  spectrumBrightness.addEventListener('click', handleSpectrumBirghtness);
  spectrumMusic.addEventListener('click', () => {
    requestPost(spectrumState ? '/song?enabled=false' : '/song?enabled=true', spectrumMusic);
  });
  refresh.addEventListener('click', getStatus);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('visible');
  });
  modalButton.addEventListener('click', () => {
    if (holdCB) {
      holdCB();
      modal.classList.remove('visible');
    }
  });

  // Add a hold down timer
  addHoldListener(stereoVolumeUp, () => handleVolumeHold(stereoVolumeUp));
  addHoldListener(stereoVolumeDown, () => handleVolumeHold(stereoVolumeDown));
  addHoldListener(hdmiDown, () => handleHDMIHold(hdmiDown));
  addHoldListener(hdmiUp, () => handleHDMIHold(hdmiUp));

  // Orientation change handling
  window.onorientationchange = (e) => {
    if (window.orientation === -90) {
      container.classList.add('oppositeLandscape');
    } else {
      container.classList.remove('oppositeLandscape');
    }
  };

  // Refresh on focus (i.e. switch back from another app)
  window.addEventListener('visibilitychange', (e) => {
    if (!document.hidden) updateData();
  });

  // Render SVG
  feather.replace();

  // Update all status data
  updateData();
}

async function updateData() {
  // Wait for the each status request before asking for more data to prevent bottlenecks
  await getStatus();
  await getSpectrumBrightness();
  await getSpectrumMusic();
}

function addHoldListener(button, cb) {
  button.addEventListener('mousedown', () => (holdTimer = setTimeout(cb, 500)));
  button.addEventListener('touchstart', () => (holdTimer = setTimeout(cb, 500)));
  button.addEventListener('mouseup', () => {
    if (holdTimer) clearTimeout(holdTimer);
  });
  button.addEventListener('touchend', () => {
    if (holdTimer) clearTimeout(holdTimer);
  });
}

function handleVolumeHold(button) {
  showModal('Choose a volume level', 0, 30, 15, () => request('/stereo_volume?volume=' + modalValue.value, button));
}

function handleHDMIHold(button) {
  showModal('Choose an HDMI channel', 1, 4, 4, () => request('/hdmi?channel=' + modalValue.value, button));
}

function handleSpectrumBirghtness() {
  showModal('Choose Brightness Level', -1, 255, spectrumBrightnessState, () => {
    requestPost('/brightness?brightness=' + modalValue.value, spectrumBrightness);
  });
}

function showModal(message, min, max, current, cb) {
  modal.classList.add('visible');
  modalMessage.innerHTML = message;
  modalValue.min = min;
  modalValue.max = max;
  modalValue.value = current;
  modalDisplay.innerHTML = current;
  holdCB = cb;
}

function request(url, button) {
  // Only do the request if there are no active requests
  if (document.getElementsByClassName('spin').length > 0) return;

  button.classList.add('spin');
  axios
    .get(server + url)
    .then((response) => {
      button.classList.remove('spin');

      if (button === computerPower) getStatus();
    })
    .catch((error) => {
      button.classList.remove('spin');
    });
}

function requestPost(url, button) {
  // Only do the request if there are no active requests
  if (document.getElementsByClassName('spin').length > 0) return;

  button.classList.add('spin');
  axios
    .post(ledSpectrum + url)
    .then((response) => {
      if (button === spectrumMusic) getSpectrumMusic(button);
      if (button === spectrumBrightness) getSpectrumBrightness(button);
      if (button === spectrumPower) getSpectrumBrightness(button);
    })
    .catch((error) => {
      button.classList.remove('spin');
    });
}

function getStatus() {
  if (timeout) clearTimeout(timeout);

  refresh.classList.add('spin');

  return axios
    .get(server)
    .then((response) => {
      computerState = response.data.trim() === 'Current Status: 1';
      const classList = computerPower.getElementsByTagName('svg')[0].classList;
      classList.remove('red');
      classList.remove('green');
      classList.add(computerState ? 'green' : 'red');
      setOnline(true);

      timeout = setTimeout(getStatus, 15000);
    })
    .catch((error) => {
      console.error(error);
      setOnline(false);

      timeout = setTimeout(getStatus, 15000);
    });
}

function getSpectrumBrightness(button) {
  return axios
    .get(ledSpectrum + '/brightness')
    .then((response) => {
      spectrumBrightnessState = response.data;

      const classList = spectrumPower.getElementsByTagName('svg')[0].classList;
      classList.remove('red');
      classList.remove('green');
      classList.add(spectrumBrightnessState === -1 || spectrumBrightnessState > 1 ? 'green' : 'red');

      if (button) button.classList.remove('spin');
    })
    .catch((err) => {
      if (button) button.classList.remove('spin');
    });
}

function getSpectrumMusic(button) {
  return axios
    .get(ledSpectrum + '/song')
    .then((response) => {
      spectrumState = response.data.trim() === 'songEnabled: 1';
      const classList = spectrumMusic.getElementsByTagName('svg')[0].classList;
      classList.remove('red');
      classList.remove('green');
      classList.add(spectrumState ? 'green' : 'red');
      if (button) button.classList.remove('spin');
    })
    .catch((err) => {
      if (button) button.classList.remove('spin');
    });
}

function setOnline(newState) {
  onlineState = newState;
  online.style.display = newState ? 'block' : 'none';
  offline.style.display = newState ? 'none' : 'block';
  refresh.classList.remove('spin');
  if (initialLoad) {
    initialLoad.parentNode.removeChild(initialLoad);
    initialLoad = undefined;
  }
}
