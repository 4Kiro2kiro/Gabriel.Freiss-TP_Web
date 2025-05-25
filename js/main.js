// CV de Steve - Minecraft Edition
document.addEventListener('DOMContentLoaded', function() {
    console.log("Initialisation du CV de Steve...");
    
    // Initialiser tous les composants
    setupQuestionnaire();
    setupCraftingCalculator();
    setupBruteforce();
    setupSectionIndicators();
    setupSmoothScrolling();
    
    // Forcer l'affichage des éléments
    forceAllElementsVisible();
    
    // Message de démarrage
    showStartupMessage("CV de Steve chargé !", 1500);
});

// Système de défilement fluide
function setupSmoothScrolling() {
    const sections = document.querySelectorAll('.minecraft-section');
    const sectionIds = Array.from(sections).map(section => section.id);
    let currentSectionIndex = 0;
    let isScrolling = false; // Pour éviter les scrolls multiples trop rapides
    let lastActiveSectionId = null; // Pour éviter les mises à jour d'indicateurs inutiles
    
    console.log("Initialisation du défilement fluide avec", sections.length, "sections");
    
    // Fonction pour défiler vers une section
    function scrollToSection(index) {
        if (index < 0 || index >= sections.length) return;
        if (isScrolling) return; // Éviter le défilement pendant une transition
        
        // Marquer comme en transition
        isScrolling = true;
        
        // Sauvegarder la section cible
        const targetSectionId = sectionIds[index];
        console.log("Défilement vers la section:", targetSectionId);
        
        // Mettre à jour l'index
        currentSectionIndex = index;
        
        // Mettre à jour l'indicateur actif immédiatement
        // mais seulement pour la section cible (pas de transitions intermédiaires)
        lastActiveSectionId = targetSectionId;
        updateActiveIndicator(targetSectionId);
        
        // Jouer un son
        try {
            const sound = new Audio('static/minecraft-stone.mp3');
            sound.volume = 0.2;
            sound.play().catch(err => console.log('Impossible de jouer le son:', err));
        } catch (e) {
            console.log('Erreur audio:', e);
        }
        
        // Défiler vers la section - utiliser scrollTo pour plus de fiabilité
        window.scrollTo({
            top: sections[index].offsetTop,
            behavior: 'smooth'
        });
        
        // Déverrouiller l'achievement pour cette section
        unlockAchievementForSection(sectionIds[index]);
        
        // Réinitialiser l'état de défilement après la transition
        setTimeout(() => {
            isScrolling = false;
            // Vérifier à nouveau la section visible après la fin du scrolling,
            // mais seulement si nécessaire
            if (lastActiveSectionId !== targetSectionId) {
                updateActiveIndicator(targetSectionId);
            }
        }, 800); // Temps suffisant pour que la transition se termine
    }
    
    // Initialiser l'index de section actuelle en fonction de la position de défilement actuelle
    function initCurrentSectionIndex() {
        const activeSection = checkVisibleSectionWithoutUpdate();
        
        if (activeSection) {
            const index = sectionIds.indexOf(activeSection);
            if (index !== -1) {
                currentSectionIndex = index;
                // Seulement mettre à jour si différent de la dernière section active
                if (lastActiveSectionId !== activeSection) {
                    lastActiveSectionId = activeSection;
                    updateActiveIndicator(activeSection);
                }
            }
        } else {
            // Fallback à la méthode précédente
            let minDistance = Infinity;
            let index = 0;
            
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            
            sections.forEach((section, i) => {
                const distance = Math.abs(section.offsetTop - scrollTop);
                if (distance < minDistance) {
                    minDistance = distance;
                    index = i;
                }
            });
            
            currentSectionIndex = index;
            const newActiveSectionId = sectionIds[index];
            if (lastActiveSectionId !== newActiveSectionId) {
                lastActiveSectionId = newActiveSectionId;
                updateActiveIndicator(newActiveSectionId);
            }
        }
    }
    
    // Fonction pour vérifier la section visible sans mettre à jour les indicateurs
    function checkVisibleSectionWithoutUpdate() {
        const scrollPosition = window.scrollY || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const halfWindowHeight = windowHeight / 2;
        
        // Trouver la section qui occupe le centre de l'écran
        let activeSection = null;
        
        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionBottom = sectionTop + sectionHeight;
            
            // Si le centre de la fenêtre est dans cette section
            if (scrollPosition + halfWindowHeight >= sectionTop && 
                scrollPosition + halfWindowHeight < sectionBottom) {
                activeSection = section;
            }
        });
        
        return activeSection ? activeSection.id : null;
    }
    
    // Initialiser la section actuelle au chargement
    initCurrentSectionIndex();
    
    // Navigation par les liens du menu
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetIndex = sectionIds.indexOf(targetId);
            
            if (targetIndex !== -1) {
                scrollToSection(targetIndex);
            }
        });
    });
    
    // Navigation par les indicateurs
    document.querySelectorAll('.section-indicator').forEach(indicator => {
        indicator.addEventListener('click', function() {
            const targetId = this.getAttribute('data-section');
            const targetIndex = sectionIds.indexOf(targetId);
            
            if (targetIndex !== -1) {
                scrollToSection(targetIndex);
            }
        });
    });
    
    // Navigation au clavier
    document.addEventListener('keydown', function(e) {
        let newIndex = currentSectionIndex;
        
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            newIndex = Math.min(sectionIds.length - 1, currentSectionIndex + 1);
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            newIndex = Math.max(0, currentSectionIndex - 1);
        } else {
            return; // Si ce n'est pas une touche de navigation, ne rien faire
        }
        
        // Si on est déjà sur cette section, ne rien faire
        if (newIndex === currentSectionIndex) return;
        
        // Défiler vers la nouvelle section
        scrollToSection(newIndex);
    });
    
    // Gestion du défilement de la molette pour aller d'une section à l'autre
    document.addEventListener('wheel', function(e) {
        // Empêcher le défilement natif seulement si nous ne sommes pas déjà en transition
        if (!isScrolling) {
            e.preventDefault();
        } else {
            // Si nous sommes en transition, laisser l'événement se propager
            return;
        }
        
        // Si déjà en train de scroller, ignorer
        if (isScrolling) return;
        
        // Vérifier d'abord quelle section est visible
        initCurrentSectionIndex();
        
        // Déterminer la direction du défilement
        const direction = e.deltaY > 0 ? 1 : -1;
        
        // Calculer le nouvel index
        const newIndex = Math.max(0, Math.min(sections.length - 1, currentSectionIndex + direction));
        
        // Si on est déjà sur cette section, ne rien faire
        if (newIndex === currentSectionIndex) return;
        
        // Défiler vers la nouvelle section
        scrollToSection(newIndex);
    }, { passive: false }); // passive: false pour pouvoir utiliser preventDefault()
    
    // Gestion du scroll tactile
    let touchStartY = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    document.addEventListener('touchmove', function(e) {
        if (isScrolling) return;
        
        // Vérifier d'abord quelle section est visible
        initCurrentSectionIndex();
        
        const touchY = e.touches[0].clientY;
        const diff = touchStartY - touchY;
        
        // Si le mouvement est significatif
        if (Math.abs(diff) > 20) {
            // Déterminer la direction
            const direction = diff > 0 ? 1 : -1;
            
            // Calculer le nouvel index
            const newIndex = Math.max(0, Math.min(sections.length - 1, currentSectionIndex + direction));
            
            // Si on est déjà sur cette section, ne rien faire
            if (newIndex === currentSectionIndex) return;
            
            // Empêcher le défilement par défaut
            e.preventDefault();
            
            // Défiler vers la nouvelle section
            scrollToSection(newIndex);
            
            // Réinitialiser la position de départ
            touchStartY = touchY;
        }
    }, { passive: false });
    
    // Détecter la section active pendant le défilement standard
    window.addEventListener('scroll', function() {
        if (isScrolling) return; // Ne pas interférer pendant une transition programmée
        
        // Nous ne vérifions la section visible que si nous ne sommes pas en transition
        initCurrentSectionIndex();
    }, { passive: true });
    
    console.log("Système de défilement fluide initialisé avec succès!");
}

// Configuration des indicateurs de section
function setupSectionIndicators() {
    const indicators = document.querySelectorAll('.section-indicator');
    
    indicators.forEach((indicator, index) => {
        // Ajouter l'attribut data-index pour faciliter la navigation
        indicator.setAttribute('data-index', index);
    });
    
    // Activer l'indicateur pour la section active au chargement
    updateActiveIndicator('hero');
}

// Mettre à jour l'indicateur actif
function updateActiveIndicator(sectionId) {
    const indicators = document.querySelectorAll('.section-indicator');
    
    // S'assurer que nous avons un ID de section valide
    if (!sectionId) return;
    
    // Désactiver tous les indicateurs d'abord
    indicators.forEach(indicator => {
        indicator.classList.remove('active');
    });
    
    // Activer uniquement l'indicateur correspondant
    const targetIndicator = document.querySelector(`.section-indicator[data-section="${sectionId}"]`);
    if (targetIndicator) {
        targetIndicator.classList.add('active');
        console.log("Activating indicator for section:", sectionId);
    }
}

// Fonction pour vérifier quelle section est actuellement visible
function checkVisibleSection() {
    const sections = document.querySelectorAll('.minecraft-section');
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const halfWindowHeight = windowHeight / 2;
    
    // Trouver la section qui occupe le centre de l'écran
    let activeSection = null;
    
    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionBottom = sectionTop + sectionHeight;
        
        // Si le centre de la fenêtre est dans cette section
        if (scrollPosition + halfWindowHeight >= sectionTop && 
            scrollPosition + halfWindowHeight < sectionBottom) {
            activeSection = section;
        }
    });
    
    if (activeSection) {
        updateActiveIndicator(activeSection.id);
        return activeSection.id;
    }
    
    return null;
}

// Forcer l'affichage de tous les éléments
function forceAllElementsVisible() {
    // Rendre tous les éléments visibles
    document.querySelectorAll('.minecraft-section, .minecraft-section *').forEach(element => {
        element.style.visibility = 'visible';
        element.style.opacity = '1';
    });
    
    console.log("Visibilité forcée pour tous les éléments");
}

// Jouer un son lors du défilement
function playScrollSound() {
    try {
        const sound = new Audio('static/minecraft-stone.mp3');
        sound.volume = 0.2;
        sound.play().catch(err => console.log('Impossible de jouer le son:', err));
    } catch (e) {
        console.log('Erreur audio:', e);
    }
}

// Afficher un message de démarrage
function showStartupMessage(message, duration) {
    console.log("Affichage du message de démarrage:", message);
    
    // Créer un élément pour le message
    const messageEl = document.createElement('div');
    messageEl.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 20px;
        border-radius: 8px;
        font-size: 18px;
        font-weight: bold;
        z-index: 9999;
        text-align: center;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
        border: 2px solid #4facfe;
    `;
    messageEl.textContent = message;
    
    // Ajouter au document
    document.body.appendChild(messageEl);
    
    // Supprimer après la durée spécifiée
    setTimeout(() => {
        messageEl.style.opacity = '0';
        messageEl.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            messageEl.remove();
        }, 500);
    }, duration);
}

// Variables globales
let reponses = {};
const bonnesReponses = {
    1: 3, // Bedrock
    2: 2, // Branch Mining
    3: 3  // Pioche en netherite
};
let achievementsUnlocked = {}; // Pour suivre les achievements déjà déverrouillés

// Fonction pour configurer le questionnaire
function setupQuestionnaire() {
    console.log("Configuration du questionnaire...");
    const container = document.getElementById('questionnaire');
    if (!container) {
        console.log("Conteneur de questionnaire non trouvé");
        return;
    }
    
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
    
    container.innerHTML = ''; // Vider le conteneur avant d'ajouter les questions
    
    questionnaire.forEach(question => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'mb-4 text-center';
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
    
    console.log("Questionnaire configuré avec succès!");
}

// Fonction pour gérer les réponses
window.repondre = function(qid, rid) {
    reponses[qid] = rid;
    
    // Mettre à jour le style des boutons
    document.querySelectorAll(`button[data-qid="${qid}"]`).forEach(btn => {
        btn.classList.remove('btn-success', 'btn-error');
        if (parseInt(btn.dataset.rid) === rid) {
            btn.classList.add(rid === bonnesReponses[qid] ? 'btn-success' : 'btn-error');
        }
    });

    // Vérifier si toutes les questions sont répondues
    if (Object.keys(reponses).length === Object.keys(bonnesReponses).length) {
        // Vérifier si toutes les réponses sont correctes
        const toutesLesReponsesSontCorrectes = Object.entries(reponses).every(
            ([qid, rid]) => rid === bonnesReponses[qid]
        );

        if (toutesLesReponsesSontCorrectes) {
            showAchievement("Félicitations !", "Vous avez répondu correctement à toutes les questions !");
            
            // Log pour déboguer
            console.log("Toutes les réponses sont correctes! Redirection vers pagecontact.html dans 2 secondes...");
            
            // Redirection avec délai
            setTimeout(() => {
                try {
                    // Redirection avec le chemin absolu
                    const baseUrl = window.location.href.split('?')[0].split('#')[0];
                    const baseDir = baseUrl.substring(0, baseUrl.lastIndexOf('/') + 1);
                    window.location.href = baseDir + 'pagecontact.html';
                    console.log("Redirection vers:", baseDir + 'pagecontact.html');
                } catch (e) {
                    console.error("Erreur lors de la redirection:", e);
                    // Fallback
                    window.location.href = 'pagecontact.html';
                }
            }, 2000);
        }
    }
}

// Gestion du bouton bruteforce
function setupBruteforce() {
    const bruteforceBtn = document.getElementById('bruteforce-btn');
    if (bruteforceBtn) {
        bruteforceBtn.addEventListener('click', () => {
            // Simuler les bonnes réponses automatiquement
            Object.keys(bonnesReponses).forEach(qid => {
                repondre(parseInt(qid), bonnesReponses[qid]);
            });
            
            showAchievement("Hacker Minecraft", "Vous avez utilisé le bruteforce pour passer le questionnaire !");
            
            // Log pour déboguer
            console.log("Bruteforce activé! Redirection vers pagecontact.html dans 2 secondes...");
            
            // Redirection avec délai
            setTimeout(() => {
                try {
                    // Redirection avec le chemin absolu
                    const baseUrl = window.location.href.split('?')[0].split('#')[0];
                    const baseDir = baseUrl.substring(0, baseUrl.lastIndexOf('/') + 1);
                    window.location.href = baseDir + 'pagecontact.html';
                    console.log("Redirection vers:", baseDir + 'pagecontact.html');
                } catch (e) {
                    console.error("Erreur lors de la redirection:", e);
                    // Fallback
                    window.location.href = 'pagecontact.html';
                }
            }, 2000);
        });
    }
}

// Système d'achievements
function unlockAchievementForSection(sectionId) {
    // Vérifier si nous avons déjà débloqué cet achievement
    if (window.achievementsUnlocked && window.achievementsUnlocked[sectionId]) {
        return;
    }
    
    // Initialiser l'objet s'il n'existe pas
    if (!window.achievementsUnlocked) {
        window.achievementsUnlocked = {};
    }
    
    // Marquer l'achievement comme débloqué
    window.achievementsUnlocked[sectionId] = true;
    
    // Configuration des achievements pour chaque section
    const achievements = {
        'hero': {
            title: 'Premier pas',
            description: 'Vous avez découvert la page d\'accueil'
        },
        'about': {
            title: 'Qui est Steve ?',
            description: 'Vous en savez maintenant plus sur Steve'
        },
        'skills': {
            title: 'Compétences débloquées',
            description: 'Vous avez découvert les compétences de Steve'
        },
        'crafting': {
            title: 'Crafteur expert',
            description: 'Vous pouvez maintenant utiliser la table de craft'
        },
        'contact': {
            title: 'Prêt à contacter',
            description: 'Vous êtes arrivé à la dernière étape'
        }
    };
    
    // Afficher l'achievement
    if (achievements[sectionId]) {
        showAchievement(achievements[sectionId].title, achievements[sectionId].description);
    }
}

// Afficher une notification d'achievement
function showAchievement(title, description) {
    console.log("Achievement débloqué:", title);
    
    // Créer un conteneur d'achievements s'il n'existe pas
    let container = document.getElementById('achievement-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'achievement-container';
        container.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            pointer-events: none;
        `;
        document.body.appendChild(container);
    }
    
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.style.cssText = `
        background-color: rgba(0, 0, 0, 0.8);
        border: 2px solid #4facfe;
        border-radius: 8px;
        padding: 10px 15px;
        color: white;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 10px;
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.5s ease, transform 0.5s ease;
        margin-bottom: 10px;
        max-width: 300px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    `;
    
    // Ajouter le contenu
    notification.innerHTML = `
        <div style="width: 32px; height: 32px; background-image: url('static/icons/diamond.png'); background-size: contain; background-repeat: no-repeat;"></div>
        <div>
            <div style="font-weight: bold; color: #4facfe; margin-bottom: 2px;">Achievement débloqué : ${title}</div>
            <div style="font-size: 12px; opacity: 0.9;">${description}</div>
        </div>
    `;
    
    // Ajouter la notification au conteneur
    container.appendChild(notification);
    
    // Afficher la notification avec un petit délai
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
        
        // Jouer un son (si possible)
        try {
            const sound = new Audio('static/minecraft-levelup.mp3');
            sound.volume = 0.2;
            sound.play().catch(err => console.log('Impossible de jouer le son:', err));
        } catch (e) {
            console.log('Erreur audio:', e);
        }
    }, 100);
    
    // Masquer et supprimer la notification après 4 secondes
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        
        // Supprimer complètement après la fin de l'animation
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 4000);
}

// Items Minecraft pour la calculatrice
const calcItems = [
    { id: 'diamond', name: 'Diamant', value: '1', img: 'static/icons/diamond.png' },
    { id: 'iron_ingot', name: 'Lingot de Fer', value: '2', img: 'static/icons/iron_ingot.png' },
    { id: 'gold_ingot', name: 'Lingot d\'Or', value: '3', img: 'static/icons/diamond_sword.png' },
    { id: 'redstone', name: 'Redstone', value: '4', img: 'static/icons/diamond_pickaxe.png' },
    { id: 'lapis', name: 'Lapis Lazuli', value: '5', img: 'static/icons/diamond.png' },
    { id: 'emerald', name: 'Émeraude', value: '6', img: 'static/icons/diamond_sword.png' },
    { id: 'coal', name: 'Charbon', value: '7', img: 'static/icons/iron_ingot.png' },
    { id: 'quartz', name: 'Quartz du Nether', value: '8', img: 'static/icons/diamond_pickaxe.png' },
    { id: 'obsidian', name: 'Obsidienne', value: '9', img: 'static/icons/iron_ingot.png' },
    { id: 'cobblestone', name: 'Pierre', value: '0', img: 'static/icons/diamond.png' },
    { id: 'plus', name: 'Addition', value: '+', img: 'static/icons/diamond_pickaxe.png' },
    { id: 'minus', name: 'Soustraction', value: '-', img: 'static/icons/diamond_sword.png' },
    { id: 'multiply', name: 'Multiplication', value: '*', img: 'static/icons/diamond.png' },
    { id: 'divide', name: 'Division', value: '/', img: 'static/icons/diamond_sword.png' },
    { id: 'equals', name: 'Égal', value: '=', img: 'static/icons/diamond_pickaxe.png' },
    { id: 'clear', name: 'Effacer', value: 'C', img: 'static/icons/iron_ingot.png' }
];

let craftingExpression = '';

// Configurer la calculatrice
function setupCraftingCalculator() {
    const craftingContainer = document.querySelector('.crafting-container');
    if (!craftingContainer) return;

    // Créer l'affichage avec une interface style Minecraft mais avec layout de calculatrice
    let calculatorHTML = `
        <div class="calculator-container">
            <div class="calculator-display">
                <input type="text" id="craft-display" class="minecraft-display" readonly value="0">
            </div>
            <div class="calculator-grid">
                <div class="calculator-row">
                    <div class="calc-btn" onclick="clearCalculation()">C</div>
                    <div class="calc-btn operator" onclick="addToCalculation('/')">÷</div>
                    <div class="calc-btn operator" onclick="addToCalculation('*')">×</div>
                    <div class="calc-btn operator" onclick="addToCalculation('-')">-</div>
                </div>
                <div class="calculator-row">
                    <div class="calc-btn number" onclick="addToCalculation('7')">7</div>
                    <div class="calc-btn number" onclick="addToCalculation('8')">8</div>
                    <div class="calc-btn number" onclick="addToCalculation('9')">9</div>
                    <div class="calc-btn operator" onclick="addToCalculation('+')">+</div>
                </div>
                <div class="calculator-row">
                    <div class="calc-btn number" onclick="addToCalculation('4')">4</div>
                    <div class="calc-btn number" onclick="addToCalculation('5')">5</div>
                    <div class="calc-btn number" onclick="addToCalculation('6')">6</div>
                    <div class="calc-btn" onclick="calculateResult()">=</div>
                </div>
                <div class="calculator-row">
                    <div class="calc-btn number" onclick="addToCalculation('1')">1</div>
                    <div class="calc-btn number" onclick="addToCalculation('2')">2</div>
                    <div class="calc-btn number" onclick="addToCalculation('3')">3</div>
                    <div class="calc-btn number zero" onclick="addToCalculation('0')">0</div>
                </div>
            </div>
        </div>
    `;
    
    craftingContainer.innerHTML = calculatorHTML;
    
    // Ajouter des styles CSS pour la calculatrice
    const style = document.createElement('style');
    style.textContent = `
        .calculator-container {
            max-width: 400px;
            margin: 0 auto;
            padding: 20px;
            background-color: #8B6952;
            border: 8px solid #5D4037;
            border-radius: 8px;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
        }
        
        .calculator-display {
            background-color: #1E1E1E;
            border: 4px solid #3E2723;
            padding: 10px;
            margin-bottom: 15px;
            border-radius: 4px;
        }
        
        .minecraft-display {
            width: 100%;
            background-color: #1E1E1E;
            color: #4facfe;
            font-size: 24px;
            font-family: monospace;
            text-align: right;
            padding: 5px;
            border: none;
            outline: none;
        }
        
        .calculator-grid {
            display: grid;
            gap: 10px;
        }
        
        .calculator-row {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
        }
        
        .calc-btn {
            background-color: #5D4037;
            border: 3px solid #3E2723;
            color: #E0E0E0;
            font-size: 20px;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
            border-radius: 4px;
            user-select: none;
            font-weight: bold;
            box-shadow: 0 4px 0 #3E2723;
        }
        
        .calc-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 0 #3E2723;
            border-color: #4facfe;
        }
        
        .calc-btn:active {
            transform: translateY(2px);
            box-shadow: 0 2px 0 #3E2723;
        }
        
        .number {
            background-color: #795548;
        }
        
        .operator {
            background-color: #4facfe;
            color: #fff;
        }
        
        .zero {
            grid-column: span 1;
        }
        
        /* Effet pixelisé sur la bordure pour rappeler Minecraft */
        .calculator-container::before {
            content: '';
            position: absolute;
            top: -4px;
            left: -4px;
            right: -4px;
            bottom: -4px;
            border: 2px dashed #3E2723;
            pointer-events: none;
            border-radius: 10px;
            z-index: -1;
            opacity: 0.5;
        }
    `;
    document.head.appendChild(style);
}

// Ajouter un élément à l'expression
window.addToCalculation = function(value) {
    // Si on commence une nouvelle expression après un résultat
    if (craftingExpression === 'Erreur' || craftingExpression.indexOf('=') !== -1) {
        craftingExpression = '';
    }
    
    // Éviter plusieurs opérateurs consécutifs
    const lastChar = craftingExpression.slice(-1);
    if (['+', '-', '*', '/'].includes(lastChar) && ['+', '-', '*', '/'].includes(value)) {
        craftingExpression = craftingExpression.slice(0, -1) + value;
    } else {
        craftingExpression += value;
    }
    
    updateCalculatorDisplay();
    
    // Jouer un son de clic
    try {
        const sound = new Audio('static/minecraft-stone.mp3');
        sound.volume = 0.1;
        sound.play().catch(err => console.log('Impossible de jouer le son:', err));
    } catch (e) {
        console.log('Erreur audio:', e);
    }
};

// Effacer l'expression
window.clearCalculation = function() {
    craftingExpression = '';
    updateCalculatorDisplay();
};

// Calculer le résultat
window.calculateResult = function() {
    if (!craftingExpression) return;
    
    try {
        const result = eval(craftingExpression);
        craftingExpression = craftingExpression + '=' + result.toString();
        updateCalculatorDisplay();
        
        // Jouer un son de succès
        try {
            const sound = new Audio('static/minecraft-levelup.mp3');
            sound.volume = 0.2;
            sound.play().catch(err => console.log('Impossible de jouer le son:', err));
        } catch (e) {
            console.log('Erreur audio:', e);
        }
        
        // Déverrouiller un achievement spécial si le résultat est 42
        if (result === 42) {
            showAchievement("Réponse Universelle", "Vous avez trouvé la réponse à la grande question sur la vie, l'univers et le reste !");
        }
    } catch (e) {
        craftingExpression = 'Erreur';
        updateCalculatorDisplay();
        
        // Jouer un son d'erreur
        try {
            const sound = new Audio('static/minecraft-hit.mp3');
            sound.volume = 0.2;
            sound.play().catch(err => console.log('Impossible de jouer le son:', err));
        } catch (e) {
            console.log('Erreur audio:', e);
        }
    }
};

// Mettre à jour l'affichage
function updateCalculatorDisplay() {
    const display = document.getElementById('craft-display');
    if (display) {
        display.value = craftingExpression || '0';
    }
} 