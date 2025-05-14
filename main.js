// Gestion du menu fixe
function handleScroll() {
    const fixedMenu = document.getElementById('fixed-menu');
    const scrollPosition = window.scrollY;
    
    // Afficher le menu fixe après avoir dépassé la première section
    if (scrollPosition > window.innerHeight) {
        fixedMenu.classList.add('visible');
        fixedMenu.classList.remove('hidden');
    } else {
        fixedMenu.classList.remove('visible');
        fixedMenu.classList.add('hidden');
    }
}

// Questionnaire Minecraft
const questionnaire = [
    {
        qid: 1,
        label: "Quel bloc est le plus résistant dans Minecraft ?",
        reponses: [
            { rid: 1, label: "Obsidienne" },
            { rid: 2, label: "Diamant" },
            { rid: 3, label: "Bedrock" }
        ]
    },
    {
        qid: 2,
        label: "Quelle est la meilleure méthode de minage ?",
        reponses: [
            { rid: 1, label: "Strip Mining" },
            { rid: 2, label: "Branch Mining" },
            { rid: 3, label: "Cave Mining" }
        ]
    },
    {
        qid: 3,
        label: "Quel est le meilleur outil pour miner l'obsidienne ?",
        reponses: [
            { rid: 1, label: "Pioche en fer" },
            { rid: 2, label: "Pioche en diamant" },
            { rid: 3, label: "Pioche en netherite" }
        ]
    }
];

// Réponses correctes
const bonnesReponses = {
    1: 3, // Bedrock
    2: 2, // Branch Mining
    3: 3  // Pioche en netherite
};

let reponses = {};

// Fonction pour créer le questionnaire
function creerQuestionnaire() {
    const container = document.getElementById('questionnaire');
    questionnaire.forEach(question => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'mb-4';
        questionDiv.innerHTML = `
            <h3 class="text-xl mb-2">${question.label}</h3>
            <div class="flex flex-col gap-2">
                ${question.reponses.map(reponse => `
                    <button 
                        class="btn btn-outline" 
                        onclick="repondre(${question.qid}, ${reponse.rid})"
                        data-qid="${question.qid}"
                        data-rid="${reponse.rid}"
                    >
                        ${reponse.label}
                    </button>
                `).join('')}
            </div>
        `;
        container.appendChild(questionDiv);
    });
}

// Fonction pour gérer les réponses
function repondre(qid, rid) {
    reponses[qid] = rid;
    
    // Mettre à jour le style des boutons
    document.querySelectorAll(`button[data-qid="${qid}"]`).forEach(btn => {
        btn.classList.remove('btn-success', 'btn-error');
        if (parseInt(btn.dataset.rid) === rid) {
            btn.classList.add(rid === bonnesReponses[qid] ? 'btn-success' : 'btn-error');
        }
    });

    // Vérifier si toutes les réponses sont correctes
    const toutesLesReponsesSontCorrectes = Object.entries(reponses).every(
        ([qid, rid]) => rid === bonnesReponses[qid]
    );

    if (toutesLesReponsesSontCorrectes) {
        window.location.href = 'pagecontact.html';
    }
}

// Calculatrice Minecraft
function creerCalculatrice() {
    const container = document.querySelector('.calculator-container');
    container.innerHTML = `
        <div class="grid grid-cols-4 gap-2">
            <input type="text" class="col-span-4 input input-bordered mb-2" id="display" readonly>
            <button class="btn" onclick="appendNumber('7')">7</button>
            <button class="btn" onclick="appendNumber('8')">8</button>
            <button class="btn" onclick="appendNumber('9')">9</button>
            <button class="btn btn-primary" onclick="appendOperator('+')">+</button>
            <button class="btn" onclick="appendNumber('4')">4</button>
            <button class="btn" onclick="appendNumber('5')">5</button>
            <button class="btn" onclick="appendNumber('6')">6</button>
            <button class="btn btn-primary" onclick="appendOperator('-')">-</button>
            <button class="btn" onclick="appendNumber('1')">1</button>
            <button class="btn" onclick="appendNumber('2')">2</button>
            <button class="btn" onclick="appendNumber('3')">3</button>
            <button class="btn btn-primary" onclick="appendOperator('*')">×</button>
            <button class="btn" onclick="appendNumber('0')">0</button>
            <button class="btn btn-error" onclick="clearDisplay()">C</button>
            <button class="btn btn-success" onclick="calculate()">=</button>
            <button class="btn btn-primary" onclick="appendOperator('/')">/</button>
        </div>
    `;
}

let displayValue = '';

function appendNumber(num) {
    displayValue += num;
    updateDisplay();
}

function appendOperator(op) {
    displayValue += ` ${op} `;
    updateDisplay();
}

function clearDisplay() {
    displayValue = '';
    updateDisplay();
}

function calculate() {
    try {
        displayValue = eval(displayValue).toString();
    } catch (e) {
        displayValue = 'Error';
    }
    updateDisplay();
}

function updateDisplay() {
    document.getElementById('display').value = displayValue;
}

// Gestion du bouton bruteforce
function setupBruteforce() {
    const bruteforceBtn = document.getElementById('bruteforce');
    if (bruteforceBtn) {
        bruteforceBtn.addEventListener('click', () => {
            // Simuler les bonnes réponses automatiquement
            Object.keys(bonnesReponses).forEach(qid => {
                repondre(parseInt(qid), bonnesReponses[qid]);
            });
        });
    }
}

// Smooth scroll pour les liens du menu
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    creerQuestionnaire();
    creerCalculatrice();
    setupBruteforce();
    setupSmoothScroll();
    
    // Ajouter l'écouteur d'événement pour le défilement
    window.addEventListener('scroll', handleScroll);
}); 