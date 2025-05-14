// Constante contenant les questions et réponses sur Minecraft
const questionnaire = [
  {
    label: "Quel matériau est nécessaire pour fabriquer une pioche?",
    qid: 1,
    reponses: [
      { label: "Bâtons et planches", rid: 1 },
      { label: "Diamants uniquement", rid: 2 },
      { label: "Laine et ficelle", rid: 3 }
    ]
  },
  {
    label: "Quelle créature explose quand elle s'approche des joueurs?",
    qid: 2,
    reponses: [
      { label: "Zombie", rid: 1 },
      { label: "Creeper", rid: 2 },
      { label: "Enderman", rid: 3 }
    ]
  },
  {
    label: "Quelle dimension contient le dragon de l'End?",
    qid: 3,
    reponses: [
      { label: "Nether", rid: 1 },
      { label: "Overworld", rid: 2 },
      { label: "The End", rid: 3 }
    ]
  }
];

// Variable pour stocker les réponses de l'utilisateur
let reponses = {};

// Fonction pour initialiser la page
document.addEventListener('DOMContentLoaded', function() {
  // Initialisation des onglets DaisyUI
  initTabs();
  
  // Initialisation de la calculatrice
  initCalculator();
  
  // Initialisation du questionnaire
  loadQuestionnaire();
  
  // Bouton brute force
  document.getElementById('bruteForceBtn').addEventListener('click', function() {
    // Réponses correctes hardcodées
    reponses = { 1: 1, 2: 2, 3: 3 };
    checkAndRedirect();
  });
});

// Fonction pour initialiser les onglets
function initTabs() {
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Désactiver tous les onglets
      tabs.forEach(t => t.classList.remove('tab-active'));
      // Masquer tous les contenus
      tabContents.forEach(content => content.classList.add('hidden'));
      
      // Activer l'onglet cliqué
      tab.classList.add('tab-active');
      // Afficher le contenu correspondant
      const target = tab.getAttribute('data-target');
      document.getElementById(target).classList.remove('hidden');
    });
  });
}

// Fonction pour initialiser la calculatrice
function initCalculator() {
  const display = document.getElementById('calcDisplay');
  const buttons = document.querySelectorAll('.calc-btn');
  
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const value = button.textContent;
      
      if (value === '=') {
        try {
          display.value = eval(display.value);
        } catch (error) {
          display.value = 'Erreur';
        }
      } else if (value === 'C') {
        display.value = '';
      } else {
        display.value += value;
      }
    });
  });
}

// Fonction pour charger le questionnaire avec style Minecraft
function loadQuestionnaire() {
  const questionContainer = document.getElementById('questionnaire');
  questionContainer.innerHTML = '';
  
  questionnaire.forEach(question => {
    const questionDiv = document.createElement('div');
    questionDiv.className = 'mb-6 p-4 rounded-lg';
    questionDiv.style.backgroundImage = "url('https://i.imgur.com/P7sDFp7.png')";
    questionDiv.style.backgroundRepeat = "repeat";
    questionDiv.style.border = "4px solid #5E3B1A";
    questionDiv.style.imageRendering = "pixelated";
    
    // Titre de la question
    const questionTitle = document.createElement('h3');
    questionTitle.className = 'text-lg font-bold mb-3';
    questionTitle.style.fontFamily = "'VT323', monospace";
    questionTitle.style.color = "white";
    questionTitle.style.fontSize = "1.5rem";
    questionTitle.style.textShadow = "2px 2px #000";
    questionTitle.textContent = question.label;
    questionDiv.appendChild(questionTitle);
    
    // Image d'un item Minecraft avant la question
    const itemImg = document.createElement('img');
    itemImg.className = 'pixelated mb-2';
    itemImg.style.width = '32px';
    itemImg.style.height = '32px';
    
    // Différentes images pour différentes questions
    if (question.qid === 1) {
      itemImg.src = 'https://i.imgur.com/si7LQAl.png'; // Pickaxe
      itemImg.alt = 'Pickaxe';
    } else if (question.qid === 2) {
      itemImg.src = 'https://i.imgur.com/NnFDfMK.png'; // Creeper
      itemImg.alt = 'Creeper';
    } else {
      itemImg.src = 'https://i.imgur.com/IeGw0XQ.png'; // End portal
      itemImg.alt = 'End portal';
    }
    
    questionTitle.prepend(itemImg);
    
    // Réponses
    const reponsesList = document.createElement('div');
    reponsesList.className = 'flex flex-col gap-2';
    
    question.reponses.forEach(reponse => {
      const btn = document.createElement('button');
      btn.className = 'minecraft-btn';
      btn.textContent = reponse.label;
      btn.setAttribute('data-qid', question.qid);
      btn.setAttribute('data-rid', reponse.rid);
      
      btn.addEventListener('click', function(event) {
        // Son de clic Minecraft
        const clickSound = new Audio('https://www.myinstants.com/media/sounds/minecraft-click.mp3');
        clickSound.volume = 0.5;
        clickSound.play();
        
        // Désactive tous les boutons de cette question
        const questionBtns = reponsesList.querySelectorAll('button');
        questionBtns.forEach(qBtn => {
          qBtn.style.backgroundColor = '#727272';
          qBtn.style.color = 'white';
        });
        
        // Active ce bouton
        btn.style.backgroundColor = '#5D8C2D';
        
        // Enregistre la réponse
        reponses[question.qid] = reponse.rid;
        
        // Vérifie si toutes les questions ont été répondues
        checkAndRedirect();
      });
      
      reponsesList.appendChild(btn);
    });
    
    questionDiv.appendChild(reponsesList);
    questionContainer.appendChild(questionDiv);
  });
}

// Fonction pour vérifier si toutes les réponses sont correctes et rediriger
function checkAndRedirect() {
  const correctAnswers = { 1: 1, 2: 2, 3: 3 };
  let allCorrect = true;
  let allAnswered = true;
  
  // Vérifie si toutes les questions ont été répondues
  for (let i = 1; i <= questionnaire.length; i++) {
    if (!reponses[i]) {
      allAnswered = false;
      break;
    }
  }
  
  // Vérifie si toutes les réponses sont correctes
  if (allAnswered) {
    for (let qid in correctAnswers) {
      if (reponses[qid] !== correctAnswers[qid]) {
        allCorrect = false;
        break;
      }
    }
  } else {
    allCorrect = false;
  }
  
  // Redirection si toutes les réponses sont correctes
  if (allCorrect) {
    // Vérifie si la page des réponses existe déjà
    fetch('A111_B222_C333.html')
      .then(response => {
        if (response.ok) {
          window.location.href = 'A111_B222_C333.html';
        } else {
          alert('Suite à vos réponses, vous ne souhaitez pas être contacté.');
        }
      })
      .catch(() => {
        alert('Suite à vos réponses, vous ne souhaitez pas être contacté.');
      });
  }
}
