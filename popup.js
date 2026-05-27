document.addEventListener('DOMContentLoaded', function () {
  const volumeSlider = document.getElementById('volumeSlider');
  const volumeValue = document.getElementById('volumeValue');
  const presetBtns = document.querySelectorAll('.preset-btn');
  const volumeToggle = document.getElementById('volumeToggle');
  let isEnabled = false;

  function updateVolumeDisplay(value) {
    volumeValue.textContent = value + '%';
    volumeSlider.value = value;

    presetBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.volume == value);
    });
  }

  function toggleControls(enabled) {
    isEnabled = enabled;
    volumeSlider.disabled = !enabled;

    presetBtns.forEach(btn => {
      btn.disabled = !enabled;
    });

    const volumeControl = document.querySelector('.volume-control');
    const presets = document.querySelector('.presets');

    if (enabled) {
      volumeControl.classList.remove('disabled');
      presets.classList.remove('disabled');
    } else {
      volumeControl.classList.add('disabled');
      presets.classList.add('disabled');
    }
  }

  function saveToggleState(enabled) {
    browser.storage.local.set({ volumeBoosterEnabled: enabled });
  }

  function loadToggleState() {
    browser.storage.local.get(['volumeBoosterEnabled'], function (result) {
      const enabled = result.volumeBoosterEnabled || false;
      volumeToggle.checked = enabled;
      toggleControls(enabled);
    });
  }

  function setVolume(volumePercent) {
    if (!isEnabled) return;

    const volumeMultiplier = volumePercent / 100;

    browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      browser.tabs.sendMessage(tabs[0].id, {
        action: 'setVolume',
        volume: volumeMultiplier,
        enabled: isEnabled
      }, function (response) {
        if (response && response.success) {
          updateVolumeDisplay(Math.round(response.volume * 100));
        }
      });
    });
  }

  function getCurrentVolume() {
    browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      browser.tabs.sendMessage(tabs[0].id, {
        action: 'getVolume'
      }, function (response) {
        if (response && response.volume !== undefined) {
          updateVolumeDisplay(Math.round(response.volume * 100));
        }
      });
    });
  }

  volumeSlider.addEventListener('input', function () {
    const value = parseInt(this.value);
    updateVolumeDisplay(value);
    setVolume(value);
  });

  presetBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const value = parseInt(this.dataset.volume);
      updateVolumeDisplay(value);
      setVolume(value);
    });
  });

  volumeToggle.addEventListener('change', function () {
    const enabled = this.checked;
    toggleControls(enabled);
    saveToggleState(enabled);

    browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      browser.tabs.sendMessage(tabs[0].id, {
        action: 'setEnabled',
        enabled: enabled
      });
    });

    if (enabled) {
      getCurrentVolume();
    }
  });

  loadToggleState();
  getCurrentVolume();
});
