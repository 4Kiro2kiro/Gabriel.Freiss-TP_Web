// Constante contenant les questions et réponses
const questionnaire = [
  {
    label: "Quelle est la principale technologie utilisée pour structurer une page web?",
    qid: 1,
    reponses: [
      { label: "HTML", rid: 1 },
      { label: "CSS", rid: 2 },
      { label: "JavaScript", rid: 3 }
    ]
  },
  {
    label: "Quelle propriété CSS permet de créer un site responsive?",
    qid: 2,
    reponses: [
      { label: "color", rid: 1 },
      { label: "media query", rid: 2 },
      { label: "font-size", rid: 3 }
    ]
  },
  {
    label: "À quoi sert principalement JavaScript?",
    qid: 3,
    reponses: [
      { label: "Structurer le contenu", rid: 1 },
      { label: "Styliser la page", rid: 2 },
      { label: "Ajouter de l'interactivité", rid: 3 }
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

// Fonction pour charger le questionnaire
function loadQuestionnaire() {
  const questionContainer = document.getElementById('questionnaire');
  questionContainer.innerHTML = '';
  
  questionnaire.forEach(question => {
    const questionDiv = document.createElement('div');
    questionDiv.className = 'mb-6 p-4 bg-base-200 rounded-lg';
    
    // Titre de la question
    const questionTitle = document.createElement('h3');
    questionTitle.className = 'text-lg font-bold mb-3';
    questionTitle.textContent = question.label;
    questionDiv.appendChild(questionTitle);
    
    // Réponses
    const reponsesList = document.createElement('div');
    reponsesList.className = 'flex flex-col gap-2';
    
    question.reponses.forEach(reponse => {
      const btn = document.createElement('button');
      btn.className = 'btn btn-outline';
      btn.textContent = reponse.label;
      btn.setAttribute('data-qid', question.qid);
      btn.setAttribute('data-rid', reponse.rid);
      
      btn.addEventListener('click', function(event) {
        // Désactive tous les boutons de cette question
        const questionBtns = reponsesList.querySelectorAll('button');
        questionBtns.forEach(qBtn => qBtn.classList.remove('btn-primary'));
        
        // Active ce bouton
        btn.classList.add('btn-primary');
        
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
