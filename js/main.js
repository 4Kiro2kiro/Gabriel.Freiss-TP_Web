// CV de Steve - Minecraft Edition
document.addEventListener('DOMContentLoaded', function() {
    // Initialisation des composants
    console.log("Initialisation du CV de Steve...");
    
    // Initialiser le conteneur d'achievements en premier
    setupAchievements();
    
    // Puis initialiser les autres composants
    setupMinecraftSections();
    setupCraftingCalculator();
    setupQuestionnaire();
    setupBruteforce();
    setupSteveAnimation();
    
    // Créer un élément de débogage
    createDebugElement();
    
    // Vérifier la visibilité des sections après un court délai
    setTimeout(ensureSectionsVisibility, 1000);
    
    // Activer la solution de secours après un délai
    setTimeout(forceContentDisplay, 2000);

    // Ajouter une classe pour indiquer que le DOM est chargé
    document.body.classList.add('dom-loaded');

    // Protéger contre le bug de softlock
    window.addEventListener('keydown', function(e) {
        // Échap réinitialise tout en cas de problème
        if (e.key === 'Escape') {
            isScrolling = false;
            console.log("Navigation réinitialisée");
        }
    });

    // Afficher un indicateur visuel de verrouillage
    createLockIndicator();
});

// Animation de Steve
function setupSteveAnimation() {
    console.log("Initialisation de l'animation de Steve");
    
    // Une méthode plus simple pour cette animation
    const steveContainer = document.querySelector('.steve-container');
    if (!steveContainer) {
        console.log("Container de Steve non trouvé");
        return;
    }
    
    const steveImage = steveContainer.querySelector('.steve-image');
    if (!steveImage) {
        console.log("Image de Steve non trouvée");
        return;
    }
    
    // Ajouter la classe pour lancer l'animation de Steve
    setTimeout(() => {
        steveImage.classList.add('steve-appeared');
        
        // Jouer un son de manière sécurisée
        playSafeSoundWithFallback('../static/sounds/minecraft-hit.mp3');
    }, 1000);
}

// Création de particules de bloc cassé Minecraft
function createBlockParticles(container) {
    const colors = ['#8B5E34', '#56941D', '#828282', '#4AEDD9'];
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'minecraft-particle';
        
        // Style aléatoire pour chaque particule
        const size = Math.random() * 8 + 4; // 4-12px
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100; // position horizontale en %
        const duration = Math.random() * 1 + 1; // durée de 1-2s
        const delay = Math.random() * 0.5; // délai de 0-0.5s
        
        // Variables de déplacement pour l'animation
        const x = (Math.random() * 100 - 50) + 'px';
        const y = (Math.random() * -150 - 50) + 'px';
        const rotation = (Math.random() * 360) + 'deg';
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.backgroundColor = color;
        particle.style.left = `${left}%`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        
        // Définir les variables CSS pour l'animation
        particle.style.setProperty('--x', x);
        particle.style.setProperty('--y', y);
        particle.style.setProperty('--rot', rotation);
        
        container.appendChild(particle);
        
        // Supprimer la particule après l'animation
        setTimeout(() => {
            particle.remove();
        }, (duration + delay) * 1000 + 100);
    }
}

// Configuration des sections style Apple/Minecraft
function setupMinecraftSections() {
    const sections = Array.from(document.querySelectorAll('.minecraft-section'));
    let currentSectionIndex = 0;
    let isScrolling = false;
    let touchStartY = 0;
    let touchEndY = 0;
    
    console.log("Initialisation du système de défilement: sections trouvées =", sections.length);
    
    // Mode de défilement avec des animations légères
    sections.forEach((section, index) => {
        // Configurer des transitions douces
        section.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
        
        // Rendre la section initiale visible
        if (index === 0) {
            section.style.display = 'block';
            section.style.opacity = '1';
            section.style.visibility = 'visible';
            section.style.zIndex = '10';
            console.log("Section active:", section.id);
            
            // Animer progressivement les éléments de la première section
            setTimeout(() => {
                const elements = section.querySelectorAll('.fade-in');
                elements.forEach((el, i) => {
                    setTimeout(() => {
                        el.style.opacity = '1';
                        el.style.visibility = 'visible';
                        el.style.transform = 'translateY(0)';
                        el.classList.add('visible');
                    }, i * 100); // Délai progressif
                });
            }, 300);
        } else {
            // Masquer les autres sections
            section.style.display = 'none';
            section.style.opacity = '0';
            section.style.visibility = 'hidden';
            section.style.zIndex = '0';
        }
    });
    
    // Créer la navigation latérale
    createSectionIndicators(sections);
    
    // Déverrouiller l'achievement pour la première section après un délai
    setTimeout(() => {
        if (sections.length > 0 && sections[0].id) {
            console.log("Déverrouillage de l'achievement pour", sections[0].id);
            try {
                unlockAchievementForSection(sections[0].id);
            } catch (e) {
                console.error("Erreur lors du déverrouillage de l'achievement:", e);
            }
        }
    }, 2000);
    
    // Gestionnaire de défilement simplifié
    const handleWheel = function(e) {
        e.preventDefault(); // Empêcher le défilement standard de la page
        
        console.log("Événement wheel détecté", e.deltaY);
        
        if (isScrolling) {
            console.log("Défilement ignoré (déjà en cours)");
            return;
        }
        
        // Éviter les petits défilements accidentels
        if (Math.abs(e.deltaY) < 10) {
            console.log("Défilement trop petit, ignoré");
            return;
        }
        
        isScrolling = true;
        console.log("Défilement commencé");
        
        // Indice de la nouvelle section
        let newIndex = currentSectionIndex;
        
        if (e.deltaY > 0) {
            // Défiler vers le bas
            if (currentSectionIndex < sections.length - 1) {
                newIndex = currentSectionIndex + 1;
            } else {
                console.log("Déjà à la dernière section");
                isScrolling = false;
                return;
            }
        } else {
            // Défiler vers le haut
            if (currentSectionIndex > 0) {
                newIndex = currentSectionIndex - 1;
            } else {
                console.log("Déjà à la première section");
                isScrolling = false;
                return;
            }
        }
        
        // Transition avec animation
        console.log(`Transition de section ${currentSectionIndex} vers ${newIndex}`);
        
        // Effet sonore pour la transition
        playBlockSound();
        
        // Direction pour l'animation
        const direction = e.deltaY > 0 ? 1 : -1; // 1 pour vers le bas, -1 pour vers le haut
        
        // Masquer la section actuelle avec animation
        sections[currentSectionIndex].style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        sections[currentSectionIndex].style.opacity = '0';
        sections[currentSectionIndex].style.transform = `translateY(${-20 * direction}px)`;
        
        setTimeout(() => {
            sections[currentSectionIndex].style.display = 'none';
            sections[currentSectionIndex].style.visibility = 'hidden';
            sections[currentSectionIndex].style.zIndex = '0';
            
            // Préparer la nouvelle section pour l'entrée
            sections[newIndex].style.opacity = '0';
            sections[newIndex].style.transform = `translateY(${20 * direction}px)`;
            sections[newIndex].style.display = 'block';
            sections[newIndex].style.visibility = 'visible';
            sections[newIndex].style.zIndex = '10';
            
            // Créer un effet de particules pour la transition
            createTransitionParticles();
            
            // Animer l'entrée de la nouvelle section
            setTimeout(() => {
                sections[newIndex].style.opacity = '1';
                sections[newIndex].style.transform = 'translateY(0)';
                
                // Animer progressivement les éléments de la nouvelle section
                const elements = sections[newIndex].querySelectorAll('.fade-in');
                elements.forEach((el, i) => {
                    setTimeout(() => {
                        el.style.opacity = '1';
                        el.style.visibility = 'visible';
                        el.style.transform = 'translateY(0)';
                        el.classList.add('visible');
                        
                        // Ajouter un effet de tremblement pour certains éléments
                        if (el.classList.contains('minecraft-card') || el.classList.contains('crafting-container')) {
                            addShakeAnimation(el);
                        }
                    }, i * 100); // Délai progressif
                });
                
                // Mettre à jour l'index courant
                currentSectionIndex = newIndex;
                
                // Mettre à jour l'indicateur actif
                updateActiveIndicator(currentSectionIndex);
                
                // Déverrouiller l'achievement
                if (sections[newIndex].id) {
                    unlockAchievementForSection(sections[newIndex].id);
                }
                
                // Réactiver le défilement après un délai
                setTimeout(() => {
                    isScrolling = false;
                    console.log("Défilement réactivé");
                }, 600);
            }, 50);
        }, 400);
    };
    
    // Utiliser trois méthodes différentes pour capter l'événement de défilement
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('mousewheel', handleWheel, { passive: false });
    window.addEventListener('DOMMouseScroll', handleWheel, { passive: false });
    
    // Navigation par clic sur les indicateurs
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('section-indicator') || e.target.parentElement.classList.contains('section-indicator')) {
            if (isScrolling) return;
            
            const indicator = e.target.classList.contains('section-indicator') ? e.target : e.target.parentElement;
            const targetIndex = parseInt(indicator.getAttribute('data-index'));
            
            console.log(`Clic sur indicateur: transition vers section ${targetIndex}`);
            
            if (targetIndex !== currentSectionIndex) {
                isScrolling = true;
                
                // Masquer la section actuelle avec animation
                sections[currentSectionIndex].style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                sections[currentSectionIndex].style.opacity = '0';
                sections[currentSectionIndex].style.transform = 'translateY(-20px)';
                
                setTimeout(() => {
                    sections[currentSectionIndex].style.display = 'none';
                    sections[currentSectionIndex].style.visibility = 'hidden';
                    sections[currentSectionIndex].style.zIndex = '0';
                    
                    // Préparer la nouvelle section pour l'entrée
                    sections[targetIndex].style.opacity = '0';
                    sections[targetIndex].style.transform = 'translateY(20px)';
                    sections[targetIndex].style.display = 'block';
                    sections[targetIndex].style.visibility = 'visible';
                    sections[targetIndex].style.zIndex = '10';
                    
                    // Animer l'entrée de la nouvelle section
                    setTimeout(() => {
                        sections[targetIndex].style.opacity = '1';
                        sections[targetIndex].style.transform = 'translateY(0)';
                        
                        // Animer progressivement les éléments de la nouvelle section
                        const elements = sections[targetIndex].querySelectorAll('.fade-in');
                        elements.forEach((el, i) => {
                            setTimeout(() => {
                                el.style.opacity = '1';
                                el.style.visibility = 'visible';
                                el.style.transform = 'translateY(0)';
                                el.classList.add('visible');
                            }, i * 100); // Délai progressif
                        });
                        
                        // Mettre à jour l'index courant
                        currentSectionIndex = targetIndex;
                        
                        // Mettre à jour l'indicateur actif
                        updateActiveIndicator(currentSectionIndex);
                        
                        // Déverrouiller l'achievement
                        if (sections[targetIndex].id) {
                            unlockAchievementForSection(sections[targetIndex].id);
                        }
                        
                        // Réactiver le défilement après un délai
                        setTimeout(() => {
                            isScrolling = false;
                        }, 600);
                    }, 50);
                }, 400);
            }
        }
    });
    
    // Raccourcis clavier pour la navigation
    document.addEventListener('keydown', function(e) {
        if (isScrolling) return;
        
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            if (currentSectionIndex < sections.length - 1) {
                isScrolling = true;
                
                // Masquer la section actuelle
                sections[currentSectionIndex].style.display = 'none';
                sections[currentSectionIndex].style.opacity = '0';
                sections[currentSectionIndex].style.visibility = 'hidden';
                sections[currentSectionIndex].style.zIndex = '0';
                
                // Afficher la nouvelle section
                sections[currentSectionIndex + 1].style.display = 'block';
                sections[currentSectionIndex + 1].style.opacity = '1';
                sections[currentSectionIndex + 1].style.visibility = 'visible';
                sections[currentSectionIndex + 1].style.zIndex = '10';
                
                // S'assurer que tous les éléments de la nouvelle section sont visibles
                const elements = sections[currentSectionIndex + 1].querySelectorAll('*');
                elements.forEach(el => {
                    el.style.opacity = '1';
                    el.style.visibility = 'visible';
                });
                
                // Mettre à jour l'index courant
                currentSectionIndex++;
                
                // Mettre à jour l'indicateur actif
                updateActiveIndicator(currentSectionIndex);
                
                // Déverrouiller l'achievement
                if (sections[currentSectionIndex].id) {
                    unlockAchievementForSection(sections[currentSectionIndex].id);
                }
                
                setTimeout(() => {
                    isScrolling = false;
                }, 1000);
            }
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            if (currentSectionIndex > 0) {
                isScrolling = true;
                
                // Masquer la section actuelle
                sections[currentSectionIndex].style.display = 'none';
                sections[currentSectionIndex].style.opacity = '0';
                sections[currentSectionIndex].style.visibility = 'hidden';
                sections[currentSectionIndex].style.zIndex = '0';
                
                // Afficher la nouvelle section
                sections[currentSectionIndex - 1].style.display = 'block';
                sections[currentSectionIndex - 1].style.opacity = '1';
                sections[currentSectionIndex - 1].style.visibility = 'visible';
                sections[currentSectionIndex - 1].style.zIndex = '10';
                
                // S'assurer que tous les éléments de la nouvelle section sont visibles
                const elements = sections[currentSectionIndex - 1].querySelectorAll('*');
                elements.forEach(el => {
                    el.style.opacity = '1';
                    el.style.visibility = 'visible';
                });
                
                // Mettre à jour l'index courant
                currentSectionIndex--;
                
                // Mettre à jour l'indicateur actif
                updateActiveIndicator(currentSectionIndex);
                
                // Déverrouiller l'achievement
                if (sections[currentSectionIndex].id) {
                    unlockAchievementForSection(sections[currentSectionIndex].id);
                }
                
                setTimeout(() => {
                    isScrolling = false;
                }, 1000);
            }
        }
    });
    
    // Support tactile
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    document.addEventListener('touchend', function(e) {
        if (isScrolling) return;
        
        touchEndY = e.changedTouches[0].clientY;
        const deltaY = touchStartY - touchEndY;
        
        if (Math.abs(deltaY) < 50) return; // Ignorer les petits mouvements
        
        isScrolling = true;
        
        if (deltaY > 50) {
            // Défiler vers le bas
            if (currentSectionIndex < sections.length - 1) {
                transitionToSection(currentSectionIndex, currentSectionIndex + 1);
                currentSectionIndex++;
            } else {
                isScrolling = false;
            }
        } else if (deltaY < -50) {
            // Défiler vers le haut
            if (currentSectionIndex > 0) {
                transitionToSection(currentSectionIndex, currentSectionIndex - 1);
                currentSectionIndex--;
            } else {
                isScrolling = false;
            }
        }
        
        updateActiveIndicator(currentSectionIndex);
        
        // Réactiver le défilement après l'animation
        setTimeout(() => {
            isScrolling = false;
        }, 1000);
    }, { passive: true });
    
    // Navigation par les liens du menu
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            console.log("Clic sur lien: ", this.getAttribute('href'));
            
            if (isScrolling) {
                console.log("Navigation ignorée (défilement en cours)");
                return;
            }
            
            const targetId = this.getAttribute('href').substring(1);
            const targetIndex = sections.findIndex(section => section.id === targetId);
            
            console.log(`Lien cliqué: ${targetId}, index cible: ${targetIndex}`);
            
            if (targetIndex !== -1 && targetIndex !== currentSectionIndex) {
                isScrolling = true;
                
                // Effet sonore de téléportation
                const teleportSound = new Audio();
                teleportSound.src = 'https://www.myinstants.com/media/sounds/minecraft-teleport.mp3';
                teleportSound.volume = 0.3;
                teleportSound.play().catch(e => console.log('Erreur audio:', e));
                
                transitionToSection(currentSectionIndex, targetIndex);
                currentSectionIndex = targetIndex;
                updateActiveIndicator(currentSectionIndex);
                
                // Réactiver le défilement après l'animation
                setTimeout(() => {
                    isScrolling = false;
                    console.log("Navigation terminée, défilement réactivé");
                }, 1000);
            } else {
                console.log("Section cible invalide ou déjà active");
            }
        });
    });
}

// Variables globales
let reponses = {};
const bonnesReponses = {
    1: 3, // Bedrock
    2: 2, // Branch Mining
    3: 3  // Pioche en netherite
};
let isScrolling = false; // Ajouter un verrou pour éviter les défilements multiples
let lastScrollTime = 0; // Pour limiter la fréquence de défilement
const scrollLockTime = 3500; // Temps de verrouillage en millisecondes (3.5 secondes)
let achievementsUnlocked = {}; // Pour suivre les achievements déjà déverrouillés

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    console.log("Initialisation du CV de Steve...");
    
    // Créer le questionnaire
    creerQuestionnaire();
    
    // Créer la calculatrice
    setupCraftingCalculator();
    
    // Configurer le bouton bruteforce
    setupBruteforce();
    
    // Initialiser les indicateurs de section
    setupSectionIndicators();
    
    // Activer la navigation fluide
    setupSmoothScrolling();

    // Ajouter une classe pour indiquer que le DOM est chargé
    document.body.classList.add('dom-loaded');

    // Protéger contre le bug de softlock
    window.addEventListener('keydown', function(e) {
        // Échap réinitialise tout en cas de problème
        if (e.key === 'Escape') {
            isScrolling = false;
            console.log("Navigation réinitialisée");
        }
    });

    // Afficher un indicateur visuel de verrouillage
    createLockIndicator();
});

// Crée un indicateur visuel de verrouillage de navigation
function createLockIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'lock-indicator';
    indicator.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 14px;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
    `;
    indicator.textContent = 'Navigation verrouillée...';
    document.body.appendChild(indicator);
}

// Affiche l'indicateur de verrouillage
function showLockIndicator() {
    const indicator = document.getElementById('lock-indicator');
    if (indicator) {
        indicator.style.opacity = '1';
        setTimeout(() => {
            indicator.style.opacity = '0';
        }, scrollLockTime - 500); // Masquer un peu avant le déverrouillage
    }
}

// Navigation fluide
function setupSmoothScrolling() {
    // Navigation par les liens d'ancrage
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Eviter les clics répétés
            if (isScrolling) return;
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                isScrolling = true;
                showLockIndicator();
                
                // Défiler vers la section cible avec une animation douce
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
                
                // Mettre à jour l'indicateur actif
                updateActiveIndicator(targetId.substring(1));
                
                // Déverrouiller l'achievement pour cette section
                unlockAchievementForSection(targetId.substring(1));
                
                // Libérer le verrou après l'animation
                setTimeout(() => {
                    isScrolling = false;
                    console.log("Navigation déverrouillée");
                }, scrollLockTime);
            }
        });
    });
    
    // Détecter la section visible lors du défilement
    window.addEventListener('scroll', function() {
        // Limiter la fréquence de traitement des événements de défilement
        const now = Date.now();
        if (now - lastScrollTime < 100) return; // Ignorer les événements trop rapprochés
        lastScrollTime = now;
        
        // Si un défilement programmé est en cours, ne pas interférer
        if (isScrolling) return;
        
        const sections = document.querySelectorAll('.minecraft-section');
        let currentSectionId = '';
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            // Considérer une section comme visible quand son centre est dans la fenêtre
            if (rect.top <= window.innerHeight/2 && rect.bottom >= window.innerHeight/2) {
                currentSectionId = section.id;
            }
        });
        
        if (currentSectionId) {
            updateActiveIndicator(currentSectionId);
            unlockAchievementForSection(currentSectionId);
        }
    }, { passive: true }); // Améliore les performances

    // Verrouiller la navigation lors du défilement avec la molette
    window.addEventListener('wheel', function(e) {
        if (isScrolling) {
            e.preventDefault();
            return;
        }
        
        // Détecter un vrai geste de défilement (pas un petit mouvement accidentel)
        if (Math.abs(e.deltaY) > 20) {
            isScrolling = true;
            showLockIndicator();
            
            // Libérer le verrou après le délai
            setTimeout(() => {
                isScrolling = false;
                console.log("Navigation déverrouillée après défilement");
            }, scrollLockTime);
        }
    }, { passive: false });
}

// Configuration des indicateurs de section
function setupSectionIndicators() {
    const indicators = document.querySelectorAll('.section-indicator');
    
    indicators.forEach((indicator, index) => {
        // Ajouter l'attribut data-index pour faciliter la navigation
        indicator.setAttribute('data-index', index);
        
        indicator.addEventListener('click', function() {
            // Éviter les clics répétés
            if (isScrolling) return;
            
            const sectionId = this.getAttribute('data-section');
            const targetSection = document.getElementById(sectionId);
            
            if (targetSection) {
                isScrolling = true;
                showLockIndicator();
                
                window.scrollTo({
                    top: targetSection.offsetTop,
                    behavior: 'smooth'
                });
                
                updateActiveIndicator(sectionId);
                
                // Déverrouiller l'achievement pour cette section
                unlockAchievementForSection(sectionId);
                
                // Libérer le verrou après l'animation
                setTimeout(() => {
                    isScrolling = false;
                }, scrollLockTime);
            }
        });
    });
    
    // Activer l'indicateur pour la section active au chargement
    const currentSection = window.location.hash ? 
        window.location.hash.substring(1) : 'hero';
    
    updateActiveIndicator(currentSection);
}

// Mettre à jour l'indicateur actif
function updateActiveIndicator(sectionId) {
    const indicators = document.querySelectorAll('.section-indicator');
    
    indicators.forEach(indicator => {
        if (indicator.getAttribute('data-section') === sectionId) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

// Fonction pour créer le questionnaire
function creerQuestionnaire() {
    const container = document.getElementById('questionnaire');
    if (!container) return;
    
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
            setTimeout(() => {
                window.location.href = 'pagecontact.html';
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
        });
    }
}

// Système d'achievements amélioré
function unlockAchievementForSection(sectionId) {
    // Vérifier si l'achievement a déjà été déverrouillé
    if (achievementsUnlocked[sectionId]) {
        return;
    }
    
    achievementsUnlocked[sectionId] = true;
    
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
    const container = document.getElementById('achievement-container');
    if (!container) return;
    
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
        <div class="icon"></div>
        <div class="content">
            <div class="title">Achievement débloqué : ${title}</div>
            <div class="description">${description}</div>
        </div>
    `;
    
    // Ajouter la notification au conteneur
    container.appendChild(notification);
    
    // Afficher la notification avec un petit délai
    setTimeout(() => {
        notification.classList.add('show');
        
        // Jouer un son de notification (si possible)
        playAchievementSound();
    }, 100);
    
    // Masquer et supprimer la notification après 4 secondes
    setTimeout(() => {
        notification.classList.remove('show');
        
        // Supprimer complètement après la fin de l'animation
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 4000);
}

// Jouer un son d'achievement
function playAchievementSound() {
    try {
        const sound = new Audio('static/sounds/minecraft-levelup.mp3');
        sound.volume = 0.2;
        sound.play().catch(err => console.log('Impossible de jouer le son:', err));
    } catch (e) {
        console.log('Erreur audio:', e);
    }
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

    // Créer l'affichage
    let calculatorHTML = `
        <div class="p-4 bg-base-300 rounded-lg mb-4">
            <input type="text" id="craft-display" class="input input-bordered w-full text-right text-xl" readonly value="0">
        </div>
        <div class="grid grid-cols-4 gap-2">
            <button class="btn btn-primary" onclick="addToCalculation('7')">7</button>
            <button class="btn btn-primary" onclick="addToCalculation('8')">8</button>
            <button class="btn btn-primary" onclick="addToCalculation('9')">9</button>
            <button class="btn btn-secondary" onclick="addToCalculation('+')">+</button>
            
            <button class="btn btn-primary" onclick="addToCalculation('4')">4</button>
            <button class="btn btn-primary" onclick="addToCalculation('5')">5</button>
            <button class="btn btn-primary" onclick="addToCalculation('6')">6</button>
            <button class="btn btn-secondary" onclick="addToCalculation('-')">-</button>
            
            <button class="btn btn-primary" onclick="addToCalculation('1')">1</button>
            <button class="btn btn-primary" onclick="addToCalculation('2')">2</button>
            <button class="btn btn-primary" onclick="addToCalculation('3')">3</button>
            <button class="btn btn-secondary" onclick="addToCalculation('*')">×</button>
            
            <button class="btn btn-accent" onclick="clearCalculation()">C</button>
            <button class="btn btn-primary" onclick="addToCalculation('0')">0</button>
            <button class="btn btn-success" onclick="calculateResult()">=</button>
            <button class="btn btn-secondary" onclick="addToCalculation('/')">/</button>
        </div>
    `;
    
    craftingContainer.innerHTML = calculatorHTML;
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
        
        // Déverrouiller un achievement spécial si le résultat est 42
        if (result === 42) {
            showAchievement("Réponse Universelle", "Vous avez trouvé la réponse à la grande question sur la vie, l'univers et le reste !");
        }
    } catch (e) {
        craftingExpression = 'Erreur';
        updateCalculatorDisplay();
    }
};

// Mettre à jour l'affichage
function updateCalculatorDisplay() {
    const display = document.getElementById('craft-display');
    if (display) {
        display.value = craftingExpression || '0';
    }
}

// Créer un élément de débogage
function createDebugElement() {
    const debugElement = document.createElement('div');
    debugElement.id = 'debug-info';
    debugElement.style.cssText = `
        position: fixed;
        top: 10px;
        left: 10px;
        background-color: rgba(0,0,0,0.7);
        color: white;
        padding: 5px;
        font-size: 12px;
        z-index: 9999;
        max-width: 300px;
        max-height: 100px;
        overflow: auto;
        font-family: monospace;
    `;
    
    document.body.appendChild(debugElement);
    
    // Écouter les événements de défilement pour le débogage
    window.addEventListener('wheel', function(e) {
        debugElement.textContent = `Wheel Event: deltaY=${e.deltaY}`;
        
        // Effacer le texte après 2 secondes
        setTimeout(() => {
            debugElement.textContent = '';
        }, 2000);
    });
    
    // Écouter les événements de touche pour le débogage
    window.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'PageUp' || e.key === 'PageDown') {
            debugElement.textContent = `Key Event: ${e.key}`;
            
            // Effacer le texte après 2 secondes
            setTimeout(() => {
                debugElement.textContent = '';
            }, 2000);
        }
    });
}

// Section active - sécurité supplémentaire
window.onload = function() {
    // Ajouter un système de sécurité pour réactiver le défilement en cas de blocage
    console.log("Initialisation du système de sécurité pour le défilement");
    
    document.addEventListener('keydown', function(e) {
        // Réinitialiser le système de défilement avec Échap
        if (e.key === 'Escape') {
            console.log("Réinitialisation forcée du système de défilement");
            const debugInfo = document.getElementById('debug-info');
            if (debugInfo) {
                debugInfo.textContent = "RESET: Défilement réactivé";
            }
            
            // Forcer la réactivation du défilement
            window.minecraftScrollReset = true;
            
            setTimeout(() => {
                debugInfo.textContent = "";
            }, 2000);
        }
    });
    
    // Vérification périodique que le défilement n'est pas bloqué
    setInterval(() => {
        if (window.minecraftScrollReset) {
            console.log("Réinitialisation du système de défilement");
            // Réinitialiser les variables de défilement
            window.isScrollingBlocked = false;
            window.minecraftScrollReset = false;
        }
    }, 500);
};

// Ajouter cette fonction après document.addEventListener('DOMContentLoaded', function() { ... });
// Pour s'assurer que toutes les sections sont correctement initialisées
function ensureSectionsVisibility() {
    console.log("FORÇAGE de la visibilité des sections...");
    
    // Obtenir toutes les sections
    const sections = document.querySelectorAll('.minecraft-section');
    
    // Rendre visible TOUT le contenu de TOUTES les sections
    sections.forEach((section, index) => {
        console.log(`Force visibilité de la section ${index} (${section.id})`);
        
        // Forcer tous les éléments à être visibles
        const allElements = section.querySelectorAll('*');
        allElements.forEach(el => {
            el.style.opacity = '1';
            el.style.visibility = 'visible';
        });
        
        // S'assurer que les éléments fade-in sont visibles
        const fadeElements = section.querySelectorAll('.fade-in');
        fadeElements.forEach(el => {
            el.style.opacity = '1';
            el.style.visibility = 'visible';
            el.style.transform = 'translateY(0)';
            el.classList.add('visible');
        });
        
        // Visibilité conditionnelle selon si c'est la section active
        if (section.classList.contains('minecraft-section-active')) {
            section.style.visibility = 'visible';
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
            section.style.display = 'block';
            section.style.zIndex = '10';
        }
    });
    
    // Forcer l'animation de la section active
    const activeSection = document.querySelector('.minecraft-section-active');
    if (activeSection) {
        console.log("Section active forcée:", activeSection.id);
        activeSection.style.opacity = '1';
        activeSection.style.visibility = 'visible';
        activeSection.style.zIndex = '100';
        
        // Forcer les éléments de la section active à être visibles
        const elements = activeSection.querySelectorAll('*');
        elements.forEach(el => {
            el.style.opacity = '1';
            el.style.visibility = 'visible';
        });
    }
}

// Appel périodique pour s'assurer que le contenu est visible après chaque transition
setInterval(ensureSectionsVisibility, 2000);

// Fonction de secours pour forcer l'affichage du contenu
function forceContentDisplay() {
    console.log("ACTIVATION DU MODE DE SECOURS: Forçage de l'affichage du contenu");
    
    // Récupérer toutes les sections
    const sections = document.querySelectorAll('.minecraft-section');
    
    // Parcourir les sections
    sections.forEach((section, index) => {
        // Désactiver les animations et transitions sur la section
        section.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
        
        // Si c'est la première section, la rendre visible
        if (index === 0) {
            // Forcer la visibilité
            section.style.opacity = '1';
            section.style.visibility = 'visible';
            section.style.display = 'block';
            section.style.transform = 'translateY(0)';
            section.style.position = 'relative';
            section.style.zIndex = '100';
            
            // S'assurer que tous les éléments sont visibles
            const elements = section.querySelectorAll('*');
            elements.forEach(el => {
                el.style.opacity = '1';
                el.style.visibility = 'visible';
                el.style.animation = 'fadeIn 0.5s ease forwards';
                el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            });
            
            console.log("Section initiale forcée visible:", section.id);
        } else {
            // Masquer les autres sections mais s'assurer qu'elles sont correctement configurées
            section.style.opacity = '0';
            section.style.visibility = 'hidden';
            section.style.zIndex = '0';
        }
    });
    
    // Recentrer Steve correctement
    const steveContainer = document.querySelector('.steve-container');
    if (steveContainer) {
        steveContainer.style.display = 'flex';
        steveContainer.style.justifyContent = 'center';
        steveContainer.style.alignItems = 'center';
        
        const steveImage = steveContainer.querySelector('.steve-image');
        if (steveImage) {
            steveImage.style.animation = 'minecraft-float 2s infinite ease-in-out alternate';
        }
    }
}

// Créer une navigation de secours si le défilement est totalement cassé
function createEmergencyNavigation(sections) {
    // Cette fonction est désactivée à la demande de l'utilisateur
    console.log("Navigation de secours désactivée");
}

// Appeler la fonction après un court délai pour s'assurer que tout est chargé
setTimeout(forceContentDisplay, 2000); 