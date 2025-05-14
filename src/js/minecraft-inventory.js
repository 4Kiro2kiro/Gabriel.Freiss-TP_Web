// Minecraft inventory system

document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on the CV page
  const cvSection = document.getElementById('cv-section');
  if (!cvSection) return;
  
  // Find where to insert the inventory
  const divider = cvSection.querySelector('.divider');
  if (!divider) return;
  
  // Create an inventory showcasing Steve's skills
  const inventorySection = document.createElement('div');
  inventorySection.className = 'mt-8';
  
  // Skills inventory title
  const inventoryTitle = document.createElement('h3');
  inventoryTitle.className = 'text-xl font-bold mb-4';
  inventoryTitle.style.fontFamily = "'VT323', monospace";
  inventoryTitle.style.color = "white";
  inventoryTitle.style.textShadow = "2px 2px #000";
  inventoryTitle.textContent = 'INVENTAIRE DE STEVE';
  inventorySection.appendChild(inventoryTitle);
  
  // Create the inventory container
  const inventoryContainer = document.createElement('div');
  inventoryContainer.className = 'inventory-container';
  
  // Inventory title
  const inventoryHeading = document.createElement('div');
  inventoryHeading.className = 'inventory-title';
  inventoryHeading.textContent = 'Équipement';
  inventoryContainer.appendChild(inventoryHeading);
  
  // Inventory grid
  const inventoryGrid = document.createElement('div');
  inventoryGrid.className = 'inventory-grid';
  
  // Steve's equipment and items
  const items = [
    { name: "Casque en Diamant", image: "https://i.imgur.com/ZDvxu2y.png", count: 1 },
    { name: "Plastron en Diamant", image: "https://i.imgur.com/u0f0n1F.png", count: 1 },
    { name: "Jambières en Diamant", image: "https://i.imgur.com/OvG5mr5.png", count: 1 },
    { name: "Bottes en Diamant", image: "https://i.imgur.com/NHWHRUx.png", count: 1 },
    { name: "Épée en Diamant", image: "https://i.imgur.com/HngHd0h.png", count: 1 },
    { name: "Pioche en Diamant", image: "https://i.imgur.com/si7LQAl.png", count: 1 },
    { name: "Hache en Diamant", image: "https://i.imgur.com/eTlhYrl.png", count: 1 },
    { name: "Pelle en Diamant", image: "https://i.imgur.com/5Vk0fLU.png", count: 1 },
    { name: "Arc Enchanté", image: "https://i.imgur.com/1AGd2fh.png", count: 1 },
    { name: "Pommes d'Or", image: "https://i.imgur.com/yRJdJkr.png", count: 64 },
    { name: "Blocs de Diamant", image: "https://i.imgur.com/P36PI0p.png", count: 32 },
    { name: "Émeraudes", image: "https://i.imgur.com/yBN4aHg.png", count: 48 },
    { name: "Lingots d'or", image: "https://i.imgur.com/0grodim.png", count: 16 },
    { name: "Enderpearls", image: "https://i.imgur.com/DJCbS1v.png", count: 7 },
    { name: "Pommes Dorées", image: "https://i.imgur.com/yRJdJkr.png", count: 3 },
    { name: "Potions de Force", image: "https://i.imgur.com/kZvnDlp.png", count: 4 },
    { name: "Lits", image: "https://i.imgur.com/oY8lusA.png", count: 1 },
    { name: "Commandes de Redstone", image: "https://i.imgur.com/O4UbABV.png", count: 12 }
  ];
  
  // Fill inventory grid with items and some empty slots
  for (let i = 0; i < 27; i++) {
    const slot = document.createElement('div');
    slot.className = 'inventory-slot';
    
    if (i < items.length) {
      const item = items[i];
      
      const img = document.createElement('img');
      img.src = item.image;
      img.alt = item.name;
      slot.appendChild(img);
      
      if (item.count > 1) {
        const count = document.createElement('div');
        count.className = 'count';
        count.textContent = item.count;
        slot.appendChild(count);
      }
      
      const itemName = document.createElement('div');
      itemName.className = 'item-name';
      itemName.textContent = item.name;
      slot.appendChild(itemName);
    }
    
    inventoryGrid.appendChild(slot);
  }
  
  inventoryContainer.appendChild(inventoryGrid);
  
  // Create player hotbar
  const hotbar = document.createElement('div');
  hotbar.className = 'player-hotbar';
  
  // Fill hotbar with items
  const hotbarItems = [
    { name: "Épée en Diamant", image: "https://i.imgur.com/HngHd0h.png" },
    { name: "Pioche en Diamant", image: "https://i.imgur.com/si7LQAl.png" },
    { name: "Hache en Diamant", image: "https://i.imgur.com/eTlhYrl.png" },
    { name: "Pelle en Diamant", image: "https://i.imgur.com/5Vk0fLU.png" },
    { name: "Blocs de Pierre", image: "https://i.imgur.com/PDZToRK.png", count: 64 },
    { name: "Steak", image: "https://i.imgur.com/Wp1G13M.png", count: 16 },
    { name: "Torches", image: "https://i.imgur.com/tZHzrYZ.png", count: 64 },
    { name: "Seaux d'Eau", image: "https://i.imgur.com/xtsjuZy.png", count: 1 },
    { name: "Feux d'Artifice", image: "https://i.imgur.com/ytXnT4Q.png", count: 32 }
  ];
  
  // Add items to hotbar
  for (let i = 0; i < 9; i++) {
    const slot = document.createElement('div');
    slot.className = i === 0 ? 'hotbar-slot selected' : 'hotbar-slot';
    
    if (i < hotbarItems.length) {
      const item = hotbarItems[i];
      
      const img = document.createElement('img');
      img.src = item.image;
      img.alt = item.name;
      slot.appendChild(img);
      
      if (item.count && item.count > 1) {
        const count = document.createElement('div');
        count.className = 'count';
        count.textContent = item.count;
        slot.appendChild(count);
      }
      
      const itemName = document.createElement('div');
      itemName.className = 'item-name';
      itemName.textContent = item.name;
      slot.appendChild(itemName);
    }
    
    hotbar.appendChild(slot);
  }
  
  inventoryContainer.appendChild(hotbar);
  inventorySection.appendChild(inventoryContainer);
  
  // Insert inventory after the first divider
  divider.parentNode.insertBefore(inventorySection, divider.nextSibling);
  
  // Add event listener to hotbar slots
  const hotbarSlots = document.querySelectorAll('.hotbar-slot');
  hotbarSlots.forEach((slot, index) => {
    slot.addEventListener('click', () => {
      // Play sound
      playMinecraftSound('click');
      
      // Update selected slot
      document.querySelector('.hotbar-slot.selected').classList.remove('selected');
      slot.classList.add('selected');
    });
  });
});
