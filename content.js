(function() {
  'use strict';
  
  let audioContext = null;
  let gainNode = null;
  let currentVolume = 1.0;
  let processedElements = new WeakSet();
  let isEnabled = false;
  
  function initAudioContext() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      gainNode = audioContext.createGain();
      gainNode.connect(audioContext.destination);
    }
  }
  
  function processAudioElement(element) {
    if (processedElements.has(element) || !isEnabled) return;
    
    try {
      initAudioContext();
      
      const source = audioContext.createMediaElementSource(element);
      source.connect(gainNode);
      
      processedElements.add(element);
      
      element.addEventListener('volumechange', () => {
        if (gainNode && isEnabled) {
          gainNode.gain.value = element.volume * currentVolume;
        }
      });
      
      if (gainNode && isEnabled) {
        gainNode.gain.value = element.volume * currentVolume;
      }
      
    } catch (error) {
      console.log('Volume booster: Could not process audio element:', error);
    }
  }
  
  function findAndProcessAudioElements() {
    const audioElements = document.querySelectorAll('audio, video');
    audioElements.forEach(processAudioElement);
  }
  
  function setVolumeBoost(multiplier) {
    currentVolume = Math.max(0.1, Math.min(12.0, multiplier));
    
    if (gainNode && isEnabled) {
      gainNode.gain.value = currentVolume;
    }
    
    const audioElements = document.querySelectorAll('audio, video');
    audioElements.forEach(element => {
      if (processedElements.has(element) && gainNode && isEnabled) {
        gainNode.gain.value = element.volume * currentVolume;
      }
    });
    
    localStorage.setItem('volumeBooster_level', currentVolume.toString());
  }
  
  function setEnabled(enabled) {
    isEnabled = enabled;
    browser.storage.local.set({ volumeBoosterEnabled: enabled });
    
    if (enabled) {
      findAndProcessAudioElements();
      if (gainNode) {
        gainNode.gain.value = currentVolume;
      }
    } else {
      // Reset volume to normal when disabled
      if (gainNode) {
        gainNode.gain.value = 1.0;
      }
    }
  }
  
  function loadSavedVolume() {
    const saved = localStorage.getItem('volumeBooster_level');
    if (saved) {
      currentVolume = parseFloat(saved);
    }
  }
  
  function loadSavedEnabled() {
    browser.storage.local.get(['volumeBoosterEnabled'], function(result) {
      isEnabled = result.volumeBoosterEnabled || false;
      if (isEnabled) {
        findAndProcessAudioElements();
      }
    });
  }
  
  loadSavedVolume();
  loadSavedEnabled();
  
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.tagName === 'AUDIO' || node.tagName === 'VIDEO') {
            processAudioElement(node);
          }
          const audioElements = node.querySelectorAll && node.querySelectorAll('audio, video');
          if (audioElements) {
            audioElements.forEach(processAudioElement);
          }
        }
      });
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'setVolume') {
      setVolumeBoost(message.volume);
      sendResponse({ success: true, volume: currentVolume });
    } else if (message.action === 'getVolume') {
      sendResponse({ volume: currentVolume });
    } else if (message.action === 'setEnabled') {
      setEnabled(message.enabled);
      sendResponse({ success: true, enabled: isEnabled });
    }
  });
  
})();