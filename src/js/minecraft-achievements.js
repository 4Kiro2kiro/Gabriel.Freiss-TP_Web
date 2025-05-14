// Minecraft achievements system

document.addEventListener('DOMContentLoaded', function() {
  // List of possible achievements
  const achievements = [
    {
      id: 'first_visit',
      title: 'Premier Pas',
      description: 'Visiter le CV de Steve pour la première fois',
      icon: 'https://i.imgur.com/bKw0hi7.png' // Map icon
    },
    {
      id: 'view_inventory',
      title: 'Chercheur de Trésors',
      description: 'Examiner l\'inventaire de Steve',
      icon: 'https://i.imgur.com/P36PI0p.png' // Diamond block
    },
    {
      id: 'click_contact',
      title: 'Communication',
      description: 'Essayer de contacter Steve',
      icon: 'https://i.imgur.com/kX5YuWw.png' // Book
    },
    {
      id: 'use_calculator',
      title: 'Artisan',
      description: 'Utiliser la table de crafting',
      icon: 'https://i.imgur.com/k3kjmbB.png' // Crafting table
    },
    {
      id: 'spend_time',
      title: 'Explorateur Dévoué',
      description: 'Passer du temps à explorer le CV',
      icon: 'https://i.imgur.com/pjetZTz.png' // Compass
    }
  ];
  
  // Function to show an achievement
  function showAchievement(achievement) {
    // Check if achievement is already earned
    if (localStorage.getItem(`achievement_${achievement.id}`)) {
      return;
    }
    
    // Mark achievement as earned
    localStorage.setItem(`achievement_${achievement.id}`, 'true');
    
    // Create achievement notification
    const achievementElement = document.createElement('div');
    achievementElement.className = 'achievement';
    
    achievementElement.innerHTML = `
      <img src="${achievement.icon}" alt="${achievement.title}" class="achievement-icon">
      <div class="achievement-content">
        <div class="achievement-title">Succès débloqué: ${achievement.title}</div>
        <div class="achievement-desc">${achievement.description}</div>
      </div>
    `;
    
    // Add to document
    document.body.appendChild(achievementElement);
    
    // Play sound
    playMinecraftSound('levelUp');
    
    // Show animation
    setTimeout(() => {
      achievementElement.classList.add('show');
    }, 100);
    
    // Remove after a delay
    setTimeout(() => {
      achievementElement.classList.remove('show');
      setTimeout(() => {
        if (achievementElement.parentNode) {
          achievementElement.parentNode.removeChild(achievementElement);
        }
      }, 500);
    }, 5000);
  }
  
  // First visit achievement
  if (!localStorage.getItem('visited_before')) {
    localStorage.setItem('visited_before', 'true');
    showAchievement(achievements.find(a => a.id === 'first_visit'));
  }
  
  // Time-based achievement
  setTimeout(() => {
    showAchievement(achievements.find(a => a.id === 'spend_time'));
  }, 60000); // After 1 minute
  
  // Add event listeners for other achievements
  document.querySelectorAll('.inventory-slot, .hotbar-slot').forEach(slot => {
    slot.addEventListener('click', () => {
      showAchievement(achievements.find(a => a.id === 'view_inventory'));
    });
  });
  
  // Contact section achievement
  const contactTab = document.querySelector('a[data-target="contact-section"]');
  if (contactTab) {
    contactTab.addEventListener('click', () => {
      showAchievement(achievements.find(a => a.id === 'click_contact'));
    });
  }
  
  // Calculator achievement
  const calcButtons = document.querySelectorAll('.calc-btn');
  calcButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      showAchievement(achievements.find(a => a.id === 'use_calculator'));
    });
  });
});
