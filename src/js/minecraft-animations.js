// Minecraft animations and effects

document.addEventListener('DOMContentLoaded', function() {
  // Add day-night cycle overlay
  const overlay = document.createElement('div');
  overlay.classList.add('day-night-overlay');
  document.body.appendChild(overlay);
  
  // Add Minecraft cursor to body
  document.body.classList.add('minecraft-cursor');
  
  // Make certain elements float
  const elementsToFloat = document.querySelectorAll('.avatar img, .footer img');
  elementsToFloat.forEach(el => {
    el.classList.add('minecraft-float');
  });
  
  // Block breaking animation on click
  document.addEventListener('click', function(e) {
    // Create block breaking effect at click position
    const breakingEffect = document.createElement('div');
    breakingEffect.classList.add('block-breaking');
    breakingEffect.style.left = (e.pageX - 8) + 'px';
    breakingEffect.style.top = (e.pageY - 8) + 'px';
    document.body.appendChild(breakingEffect);
    
    // Remove after animation completes
    setTimeout(() => {
      if (breakingEffect.parentNode) {
        breakingEffect.parentNode.removeChild(breakingEffect);
      }
    }, 1000);
  });
  
  // Add random falling blocks (like Minecraft particles)
  function createFallingBlock() {
    const block = document.createElement('div');
    block.style.position = 'fixed';
    block.style.left = Math.random() * 100 + 'vw';
    block.style.top = '-20px';
    block.style.width = '16px';
    block.style.height = '16px';
    block.style.imageRendering = 'pixelated';
    block.style.pointerEvents = 'none';
    block.style.zIndex = '999';
    
    // Random block type
    const blockTypes = [
      'https://i.imgur.com/P7sDFp7.png', // dirt
      'https://i.imgur.com/PDZToRK.png', // stone
      'https://i.imgur.com/P36PI0p.png', // diamond
      'https://i.imgur.com/yBN4aHg.png'  // emerald
    ];
    
    block.style.backgroundImage = `url(${blockTypes[Math.floor(Math.random() * blockTypes.length)]})`;
    block.style.backgroundSize = 'contain';
    
    document.body.appendChild(block);
    
    // Animate the fall
    const fallSpeed = 2 + Math.random() * 3;
    const rotationSpeed = (Math.random() - 0.5) * 2;
    let rotation = 0;
    let yPos = -20;
    
    function fall() {
      yPos += fallSpeed;
      rotation += rotationSpeed;
      block.style.top = yPos + 'px';
      block.style.transform = `rotate(${rotation}deg)`;
      
      if (yPos < window.innerHeight + 50) {
        requestAnimationFrame(fall);
      } else {
        block.remove();
      }
    }
    
    fall();
  }
  
  // Create a falling block every 10 seconds
  setInterval(createFallingBlock, 10000);
  
  // Create initial blocks
  for (let i = 0; i < 3; i++) {
    setTimeout(createFallingBlock, i * 1500);
  }
});
