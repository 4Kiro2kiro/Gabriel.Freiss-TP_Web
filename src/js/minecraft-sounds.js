// Minecraft sound effects
const minecraftSounds = {
  click: 'https://www.myinstants.com/media/sounds/minecraft-click.mp3',
  levelUp: 'https://www.myinstants.com/media/sounds/minecraft-levelup.mp3',
  pop: 'https://www.myinstants.com/media/sounds/minecraft_pop.mp3',
  door: 'https://www.myinstants.com/media/sounds/minecraft-door-opening.mp3',
  breaking: 'https://www.myinstants.com/media/sounds/block-break-1.mp3'
};

// Function to play a sound with optional volume setting
function playMinecraftSound(soundName, volume = 0.5) {
  const sound = new Audio(minecraftSounds[soundName]);
  sound.volume = volume;
  sound.play().catch(error => {
    console.error('Audio playback failed:', error);
  });
}

// Add sounds to tab switching
document.addEventListener('DOMContentLoaded', function() {
  const tabs = document.querySelectorAll('.tab');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      playMinecraftSound('click');
    });
  });
  
  // Add sounds to calculator buttons
  const calcButtons = document.querySelectorAll('.calc-btn');
  calcButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (button.textContent === '=') {
        playMinecraftSound('levelUp', 0.3);
      } else if (button.textContent === 'C') {
        playMinecraftSound('breaking', 0.3);
      } else {
        playMinecraftSound('pop', 0.2);
      }
    });
  });
  
  // Easter egg: brute force button sound
  const bruteForceBtn = document.getElementById('bruteForceBtn');
  if (bruteForceBtn) {
    bruteForceBtn.addEventListener('click', () => {
      playMinecraftSound('levelUp', 0.8);
    });
  }
});
