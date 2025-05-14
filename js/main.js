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

// Transition entre les sections
function transitionToSection(fromIndex, toIndex) {
    const sections = document.querySelectorAll('.minecraft-section');
    
    // Vérifier que les indices sont valides
    if (fromIndex < 0 || fromIndex >= sections.length || toIndex < 0 || toIndex >= sections.length) {
        console.error("Indices de section invalides:", fromIndex, toIndex);
        return;
    }
    
    const fromSection = sections[fromIndex];
    const toSection = sections[toIndex];
    
    console.log(`Transition de la section "${fromSection.id}" à "${toSection.id}"`);
    
    // Rendre visible IMMÉDIATEMENT tous les éléments de la section cible
    const allTargetElements = toSection.querySelectorAll('*');
    allTargetElements.forEach(el => {
        el.style.opacity = '1';
        el.style.visibility = 'visible';
    });
    
    // Forcer les éléments .fade-in à être visibles
    const fadeElements = toSection.querySelectorAll('.fade-in');
    fadeElements.forEach(el => {
        el.style.opacity = '1';
        el.style.visibility = 'visible';
        el.style.transform = 'translateY(0)';
        el.classList.add('visible');
    });
    
    // Debug - afficher l'état des sections avant la transition
    console.log("État de la section source:", {
        id: fromSection.id,
        classes: fromSection.className,
        visibility: window.getComputedStyle(fromSection).visibility,
        opacity: window.getComputedStyle(fromSection).opacity
    });
    
    console.log("État de la section cible:", {
        id: toSection.id,
        classes: toSection.className,
        visibility: window.getComputedStyle(toSection).visibility,
        opacity: window.getComputedStyle(toSection).opacity
    });
    
    // Effet sonore de transition
    playBlockSound();
    
    // Effet de particules pour la transition
    createTransitionParticles();
    
    // Reset des classes pour s'assurer que l'animation fonctionne
    fromSection.classList.remove('minecraft-section-hidden', 'minecraft-section-entering');
    toSection.classList.remove('minecraft-section-active', 'minecraft-section-exiting');
    
    // Rendre la section cible visible et animer ses éléments immédiatement
    toSection.classList.remove('minecraft-section-hidden');
    toSection.style.visibility = 'visible';
    toSection.style.opacity = '1';
    toSection.style.display = 'block';
    
    // Animer les éléments dans la nouvelle section immédiatement
    animateSectionElements(toSection);
    
    // Animation des sections
    fromSection.classList.remove('minecraft-section-active');
    fromSection.classList.add('minecraft-section-exiting');
    
    toSection.classList.add('minecraft-section-entering');
    
    // Déverrouiller l'achievement de la section
    if (toSection.id) {
        unlockAchievementForSection(toSection.id);
    }
    
    // Forcer à nouveau la visibilité des éléments
    setTimeout(() => {
        ensureSectionsVisibility();
    }, 400);
    
    // Utiliser un timeout pour terminer la transition
    setTimeout(() => {
        console.log("Fin de transition, mise à jour des classes");
        
        fromSection.classList.remove('minecraft-section-exiting');
        fromSection.classList.add('minecraft-section-hidden');
        
        toSection.classList.remove('minecraft-section-entering');
        toSection.classList.add('minecraft-section-active');
        toSection.style.opacity = '1';
        
        // Forcer à nouveau la visibilité
        ensureSectionsVisibility();
    }, 800); // Même durée que l'animation CSS
}

// Animer les éléments à l'intérieur d'une section
function animateSectionElements(section) {
    console.log("Animation des éléments dans la section", section.id);
    
    // Forcer tous les éléments à être visibles d'abord
    section.querySelectorAll('.fade-in').forEach(el => {
        el.style.opacity = '1';  // Assure que tous les éléments sont visibles même sans animation
        el.style.transform = 'translateY(0)';
    });
    
    // Réinitialiser les animations précédentes
    section.querySelectorAll('.fade-in').forEach(el => {
        el.classList.remove('visible');
    });
    
    // Animation avec délai progressif
    const elements = section.querySelectorAll('.fade-in');
    
    elements.forEach((element, index) => {
        // Utiliser un délai plus court pour chaque élément
        const delay = 150 + (index * 100); // 150ms pour le premier, puis +100ms pour chaque suivant
        
        setTimeout(() => {
            element.classList.add('visible');
            if (element.classList.contains('minecraft-card') || element.classList.contains('crafting-container')) {
                addShakeAnimation(element);
            }
        }, delay);
    });
}

// Créer des indicateurs de section sur le côté
function createSectionIndicators(sections) {
    const indicatorsContainer = document.createElement('div');
    indicatorsContainer.className = 'section-indicators';
    
    sections.forEach((section, index) => {
        const indicator = document.createElement('div');
        indicator.className = 'section-indicator';
        indicator.setAttribute('data-index', index);
        
        // Ajouter une icône Minecraft pour chaque section
        let iconClass = '';
        switch(section.id) {
            case 'hero':
                iconClass = 'icon-home';
                break;
            case 'about':
                iconClass = 'icon-steve';
                break;
            case 'skills':
                iconClass = 'icon-sword';
                break;
            case 'crafting':
                iconClass = 'icon-craft';
                break;
            case 'contact':
                iconClass = 'icon-book';
                break;
            default:
                iconClass = 'icon-block';
        }
        
        indicator.innerHTML = `<div class="indicator-icon ${iconClass}"></div>`;
        indicator.title = section.querySelector('h2')?.textContent || section.id;
        
        if (index === 0) {
            indicator.classList.add('active');
        }
        
        indicatorsContainer.appendChild(indicator);
    });
    
    document.body.appendChild(indicatorsContainer);
}

// Mettre à jour l'indicateur actif
function updateActiveIndicator(activeIndex) {
    const indicators = document.querySelectorAll('.section-indicator');
    
    indicators.forEach((indicator, index) => {
        if (index === activeIndex) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

// Créer un effet de particules lors des transitions
function createTransitionParticles() {
    const container = document.createElement('div');
    container.className = 'transition-particles';
    document.body.appendChild(container);
    
    // Créer les particules
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'transition-particle';
        
        // Style aléatoire pour chaque particule
        const size = Math.random() * 8 + 4; // 4-12px
        const colors = [
            'var(--minecraft-dirt)',
            'var(--minecraft-stone)',
            'var(--minecraft-grass)',
            'var(--minecraft-diamond)'
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.backgroundColor = color;
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.top = `${Math.random() * 100}vh`;
        particle.style.animationDelay = `${Math.random() * 0.5}s`;
        
        container.appendChild(particle);
    }
    
    // Supprimer les particules après l'animation
    setTimeout(() => {
        container.remove();
    }, 2000);
}

// Fonction pour jouer un son en respectant les restrictions des navigateurs
function playSafeSound(url, volume = 0.2) {
    try {
        // Créer un élément audio avec autoplay désactivé
        const audio = new Audio(url);
        audio.volume = volume;
        
        // Enregistrer le click utilisateur pour permettre le son plus tard
        document.addEventListener('click', function audioListener() {
            // Essayer de jouer le son lors du premier clic utilisateur
            audio.play().catch(error => {
                console.log("Erreur audio:", error);
            });
            // Ne déclencher qu'une seule fois
            document.removeEventListener('click', audioListener);
        }, { once: true });
        
        // Essayer de lire le son maintenant (échouera probablement mais c'est OK)
        audio.play().catch(error => {
            console.log("Son en attente d'interaction:", url);
        });
    } catch (e) {
        console.warn("Impossible de créer l'élément audio:", e);
    }
}

// Version avec fallback pour gérer les restrictions d'autoplay
function playSafeSoundWithFallback(url, volume = 0.2) {
    // Ne pas afficher d'erreur, juste logger l'info
    console.log("Tentative de lecture audio:", url);
    
    // Essayer de jouer le son sans afficher d'erreur dans la console
    try {
        const audio = new Audio(url);
        audio.volume = volume;
        
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Ignorer silencieusement l'erreur - c'est attendu
            });
        }
    } catch (e) {
        // Ignorer l'erreur
    }
}

// Jouer un son de bloc Minecraft
function playBlockSound() {
    // Utiliser un son dont nous sommes sûrs qu'il existe
    playSafeSoundWithFallback('../static/sounds/minecraft-click.mp3', 0.2);
}

// Jouer un son de minage
function playMiningSound() {
    playSafeSoundWithFallback('../static/sounds/minecraft-click.mp3', 0.2);
}

// Jouer un son de succès
function playSuccessSound() {
    // Utiliser un son dont nous sommes sûrs qu'il existe
    playSafeSoundWithFallback('../static/sounds/minecraft-click.mp3', 0.2);
}

// Jouer un son d'erreur
function playErrorSound() {
    // Utiliser un son dont nous sommes sûrs qu'il existe
    playSafeSoundWithFallback('../static/sounds/minecraft-click.mp3', 0.2);
}

// Ajouter une animation de secousse/tremblement à un élément
function addShakeAnimation(element) {
    element.classList.add('minecraft-shake');
    setTimeout(() => {
        element.classList.remove('minecraft-shake');
    }, 1000);
}

// Items Minecraft pour la calculatrice
const calcItems = [
    { id: 'diamond', name: 'Diamant', value: '1', img: '../static/icons/diamond.png' },
    { id: 'iron_ingot', name: 'Lingot de Fer', value: '2', img: '../static/icons/iron_ingot.png' },
    { id: 'gold_ingot', name: 'Lingot d\'Or', value: '3', img: '../static/icons/diamond_sword.png' },
    { id: 'redstone', name: 'Redstone', value: '4', img: '../static/icons/diamond_pickaxe.png' },
    { id: 'lapis', name: 'Lapis Lazuli', value: '5', img: '../static/icons/diamond.png' },
    { id: 'emerald', name: 'Émeraude', value: '6', img: '../static/icons/diamond_sword.png' },
    { id: 'coal', name: 'Charbon', value: '7', img: '../static/icons/iron_ingot.png' },
    { id: 'quartz', name: 'Quartz du Nether', value: '8', img: '../static/icons/diamond_pickaxe.png' },
    { id: 'obsidian', name: 'Obsidienne', value: '9', img: '../static/icons/iron_ingot.png' },
    { id: 'cobblestone', name: 'Pierre', value: '0', img: '../static/icons/diamond.png' },
    { id: 'plus', name: 'Addition', value: '+', img: '../static/icons/diamond_pickaxe.png' },
    { id: 'minus', name: 'Soustraction', value: '-', img: '../static/icons/diamond_sword.png' },
    { id: 'multiply', name: 'Multiplication', value: '*', img: '../static/icons/diamond.png' },
    { id: 'divide', name: 'Division', value: '/', img: '../static/icons/diamond_sword.png' },
    { id: 'equals', name: 'Égal', value: '=', img: '../static/icons/diamond_pickaxe.png' },
    { id: 'clear', name: 'Effacer', value: 'C', img: '../static/icons/iron_ingot.png' }
];

let craftingExpression = '';

function setupCraftingCalculator() {
    const craftingContainer = document.querySelector('.crafting-container');
    if (!craftingContainer) return;

    // Créer l'affichage
    let calculatorHTML = `
        <div class="craft-display-container">
            <input type="text" id="craft-display" class="craft-display" readonly value="0">
        </div>
        <div class="crafting-grid-container">
            <h4 class="crafting-subtitle">Table de craft</h4>
            <div class="crafting-grid">
                <!-- Grille 3x3 pour la table de craft -->
                <div class="crafting-grid-row">
                    <div class="crafting-grid-cell" onclick="addToCalculation('7')">
                        <img src="${calcItems.find(i => i.value === '7').img}" alt="7" class="crafting-item-img">
                    </div>
                    <div class="crafting-grid-cell" onclick="addToCalculation('8')">
                        <img src="${calcItems.find(i => i.value === '8').img}" alt="8" class="crafting-item-img">
                    </div>
                    <div class="crafting-grid-cell" onclick="addToCalculation('9')">
                        <img src="${calcItems.find(i => i.value === '9').img}" alt="9" class="crafting-item-img">
                    </div>
                </div>
                <div class="crafting-grid-row">
                    <div class="crafting-grid-cell" onclick="addToCalculation('4')">
                        <img src="${calcItems.find(i => i.value === '4').img}" alt="4" class="crafting-item-img">
                    </div>
                    <div class="crafting-grid-cell" onclick="addToCalculation('5')">
                        <img src="${calcItems.find(i => i.value === '5').img}" alt="5" class="crafting-item-img">
                    </div>
                    <div class="crafting-grid-cell" onclick="addToCalculation('6')">
                        <img src="${calcItems.find(i => i.value === '6').img}" alt="6" class="crafting-item-img">
                    </div>
                </div>
                <div class="crafting-grid-row">
                    <div class="crafting-grid-cell" onclick="addToCalculation('1')">
                        <img src="${calcItems.find(i => i.value === '1').img}" alt="1" class="crafting-item-img">
                    </div>
                    <div class="crafting-grid-cell" onclick="addToCalculation('2')">
                        <img src="${calcItems.find(i => i.value === '2').img}" alt="2" class="crafting-item-img">
                    </div>
                    <div class="crafting-grid-cell" onclick="addToCalculation('3')">
                        <img src="${calcItems.find(i => i.value === '3').img}" alt="3" class="crafting-item-img">
                    </div>
                </div>
            </div>
            
            <!-- Flèche de craft -->
            <div class="crafting-arrow">➡️</div>
            
            <!-- Résultat du craft -->
            <div class="crafting-result">
                <div class="crafting-grid-cell result-cell" onclick="calculateResult()">
                    <img src="${calcItems.find(i => i.value === '=').img}" alt="=" class="crafting-item-img">
                </div>
            </div>
            
            <!-- Opérations -->
            <div class="operations-grid">
                <div class="operations-title">Opérations:</div>
                <div class="operations-row">
                    <div class="crafting-grid-cell operation-cell" onclick="addToCalculation('+')">
                        <img src="${calcItems.find(i => i.value === '+').img}" alt="+" class="crafting-item-img">
                        <span class="operation-label">+</span>
                    </div>
                    <div class="crafting-grid-cell operation-cell" onclick="addToCalculation('-')">
                        <img src="${calcItems.find(i => i.value === '-').img}" alt="-" class="crafting-item-img">
                        <span class="operation-label">-</span>
                    </div>
                    <div class="crafting-grid-cell operation-cell" onclick="addToCalculation('*')">
                        <img src="${calcItems.find(i => i.value === '*').img}" alt="*" class="crafting-item-img">
                        <span class="operation-label">×</span>
                    </div>
                    <div class="crafting-grid-cell operation-cell" onclick="addToCalculation('/')">
                        <img src="${calcItems.find(i => i.value === '/').img}" alt="/" class="crafting-item-img">
                        <span class="operation-label">/</span>
                    </div>
                    <div class="crafting-grid-cell operation-cell clear-cell" onclick="clearCalculation()">
                        <img src="${calcItems.find(i => i.value === 'C').img}" alt="C" class="crafting-item-img">
                        <span class="operation-label">C</span>
                    </div>
                </div>
            </div>
            
            <!-- Instructions -->
            <div class="crafting-instructions">
                Placez des ressources sur la table de craft et utilisez les opérateurs pour calculer
            </div>
        </div>
    `;
    
    craftingContainer.innerHTML = calculatorHTML;
}

// Ajouter un élément à l'expression
window.addToCalculation = function(value) {
    // Si on commence une nouvelle expression après un résultat
    if (craftingExpression === 'Erreur' || (craftingExpression.indexOf('=') !== -1 && !['+', '-', '*', '/'].includes(value))) {
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
    playMiningSound();
    
    // Effet visuel sur la cellule cliquée
    const cells = document.querySelectorAll('.crafting-grid-cell');
    cells.forEach(cell => {
        if (cell.getAttribute('onclick') === `addToCalculation('${value}')`) {
            cell.classList.add('cell-active');
            setTimeout(() => {
                cell.classList.remove('cell-active');
            }, 300);
        }
    });
    
    // Achievement pour utilisation de la calculatrice
    if (craftingExpression.length === 1) {
        unlockAchievement('calculator_first', 'Premier chiffre placé!', '../static/icons/diamond.png');
    }
};

// Effacer l'expression
window.clearCalculation = function() {
    craftingExpression = '';
    updateCalculatorDisplay();
    playMiningSound();
};

// Calculer le résultat
window.calculateResult = function() {
    if (!craftingExpression) return;
    
    try {
        const result = eval(craftingExpression);
        craftingExpression = craftingExpression + '=' + result.toString();
        updateCalculatorDisplay();
        unlockAchievement('calculation', 'Calcul effectué avec succès!', '../static/icons/diamond_pickaxe.png');
        playSuccessSound();
    } catch (e) {
        craftingExpression = 'Erreur';
        updateCalculatorDisplay();
        playErrorSound();
    }
};

// Mettre à jour l'affichage
function updateCalculatorDisplay() {
    const display = document.getElementById('craft-display');
    if (display) {
        display.value = craftingExpression || '0';
    }
}

// Questionnaire
const questionnaire = [
    {
        qid: 1,
        question: "Quel bloc est le plus résistant dans Minecraft ?",
        options: [
            { id: 1, text: "Obsidienne" },
            { id: 2, text: "Diamant" },
            { id: 3, text: "Bedrock" }
        ],
        correctAnswer: 3
    },
    {
        qid: 2,
        question: "Quelle est la meilleure méthode de minage ?",
        options: [
            { id: 1, text: "Strip Mining" },
            { id: 2, text: "Branch Mining" },
            { id: 3, text: "Cave Mining" }
        ],
        correctAnswer: 2
    },
    {
        qid: 3,
        question: "Quel est le meilleur outil pour miner l'obsidienne ?",
        options: [
            { id: 1, text: "Pioche en fer" },
            { id: 2, text: "Pioche en diamant" },
            { id: 3, text: "Pioche en netherite" }
        ],
        correctAnswer: 3
    }
];

// Configuration du questionnaire
function setupQuestionnaire() {
    const questionnaireContainer = document.getElementById('questionnaire');
    if (!questionnaireContainer) return;
    
    // Créer les questions
    questionnaire.forEach(q => {
        const questionElement = document.createElement('div');
        questionElement.className = 'question';
        questionElement.innerHTML = `
            <div class="question-text">${q.question}</div>
            <div class="options" id="options-${q.qid}">
                ${q.options.map(option => `
                    <button 
                        class="minecraft-btn option-btn" 
                        data-qid="${q.qid}" 
                        data-option-id="${option.id}"
                        onclick="selectAnswer(${q.qid}, ${option.id})"
                    >
                        ${option.text}
                    </button>
                `).join('')}
            </div>
        `;
        questionnaireContainer.appendChild(questionElement);
    });
}

// Réponses de l'utilisateur
let userAnswers = {};

// Sélection d'une réponse
window.selectAnswer = function(questionId, optionId) {
    userAnswers[questionId] = optionId;
    
    // Mettre à jour le style des boutons
    const options = document.querySelectorAll(`button[data-qid="${questionId}"]`);
    options.forEach(button => {
        button.classList.remove('correct', 'incorrect');
        
        const buttonOptionId = parseInt(button.getAttribute('data-option-id'));
        if (buttonOptionId === optionId) {
            const question = questionnaire.find(q => q.qid === questionId);
            if (question && buttonOptionId === question.correctAnswer) {
                button.classList.add('correct');
                unlockAchievement('correct_answer', 'Bonne réponse!', '../static/icons/diamond.png');
                playSuccessSound();
            } else {
                button.classList.add('incorrect');
                playErrorSound();
            }
        }
    });
    
    // Vérifier si toutes les réponses sont correctes
    checkAllAnswers();
};

// Vérifier toutes les réponses
function checkAllAnswers() {
    // Vérifier si toutes les questions ont été répondues
    if (Object.keys(userAnswers).length !== questionnaire.length) return;
    
    // Vérifier si toutes les réponses sont correctes
    const allCorrect = questionnaire.every(q => userAnswers[q.qid] === q.correctAnswer);
    
    if (allCorrect) {
        unlockAchievement('all_answers', 'Toutes les réponses sont correctes!', '../static/icons/diamond_sword.png');
        // Rediriger vers la page de contact
        setTimeout(() => {
            window.location.href = 'pagecontact.html';
        }, 1500);
    }
}

// Bouton Bruteforce
function setupBruteforce() {
    const bruteforceBtn = document.getElementById('bruteforce-btn');
    if (!bruteforceBtn) return;
    
    bruteforceBtn.addEventListener('click', function() {
        // Sélectionner automatiquement les bonnes réponses
        questionnaire.forEach(q => {
            selectAnswer(q.qid, q.correctAnswer);
        });
        
        unlockAchievement('bruteforce', 'Bruteforce activé!', '../static/icons/iron_ingot.png');
    });
}

// Système d'Achievements
const achievements = [
    {
        id: 'visit_hero',
        title: 'Premier Contact',
        description: 'Bienvenue dans le CV de Steve!',
        icon: '../static/icons/diamond.png',
        unlocked: false
    },
    {
        id: 'visit_about',
        title: 'Curieux',
        description: 'Vous avez consulté la section À propos',
        icon: '../static/icons/diamond_pickaxe.png',
        unlocked: false
    },
    {
        id: 'visit_skills',
        title: 'Observateur',
        description: 'Vous avez exploré les compétences de Steve',
        icon: '../static/icons/diamond_sword.png',
        unlocked: false
    },
    {
        id: 'visit_crafting',
        title: 'Artisan',
        description: 'Vous avez découvert la calculatrice Minecraft',
        icon: '../static/icons/diamond_pickaxe.png',
        unlocked: false
    },
    {
        id: 'visit_contact',
        title: 'Communicatif',
        description: 'Vous êtes prêt à contacter Steve',
        icon: '../static/icons/diamond.png',
        unlocked: false
    },
    {
        id: 'calculator_first',
        title: 'Apprenti Mathématicien',
        description: 'Vous avez commencé à utiliser la calculatrice',
        icon: '../static/icons/diamond.png',
        unlocked: false
    },
    {
        id: 'calculation',
        title: 'Mathématicien',
        description: 'Vous avez effectué un calcul',
        icon: '../static/icons/diamond_pickaxe.png',
        unlocked: false
    },
    {
        id: 'correct_answer',
        title: 'Connaisseur',
        description: 'Vous avez répondu correctement à une question',
        icon: '../static/icons/diamond.png',
        unlocked: false
    },
    {
        id: 'all_answers',
        title: 'Expert Minecraft',
        description: 'Vous avez répondu correctement à toutes les questions!',
        icon: '../static/icons/diamond_sword.png',
        unlocked: false
    },
    {
        id: 'bruteforce',
        title: 'Hacker',
        description: 'Vous avez utilisé le bruteforce pour contourner le questionnaire',
        icon: '../static/icons/iron_ingot.png',
        unlocked: false
    }
];

// Initialiser le conteneur d'achievements
function setupAchievements() {
    const container = document.createElement('div');
    container.className = 'achievements-container';
    container.id = 'achievements-container';
    document.body.appendChild(container);
    
    // Déverrouiller l'achievement de visite initiale
    setTimeout(() => {
        unlockAchievement('visit_hero', 'Bienvenue dans le CV de Steve!', '../static/icons/diamond.png');
    }, 1000);
}

// Déverrouiller un achievement
function unlockAchievement(id, description, icon) {
    // Vérifier que l'achievement existe
    const achievement = achievements.find(a => a.id === id);
    if (!achievement || achievement.unlocked) return;
    
    achievement.unlocked = true;
    
    // Vérifier si le conteneur existe
    const container = document.getElementById('achievements-container');
    if (!container) {
        console.error("Conteneur d'achievements introuvable pour:", id);
        return; // Sortir si le conteneur n'existe pas
    }
    
    // Créer l'élément d'achievement
    const achievementElement = document.createElement('div');
    achievementElement.className = 'achievement';
    achievementElement.style.transform = 'translateX(0)'; // S'assurer qu'il est visible immédiatement
    achievementElement.innerHTML = `
        <img src="${icon}" alt="${achievement.title}" class="achievement-icon">
        <div class="achievement-text">
            <div class="achievement-title">${achievement.title}</div>
            <div class="achievement-description">${description}</div>
        </div>
    `;
    
    // Ajouter au conteneur
    container.appendChild(achievementElement);
    
    // Jouer un son d'achievement
    playSafeSoundWithFallback('../static/sounds/minecraft-click.mp3', 0.3);
    
    // Ajouter la classe show après un court délai (pour l'animation)
    setTimeout(() => {
        achievementElement.classList.add('show');
    }, 100);
    
    // Supprimer après 5 secondes
    setTimeout(() => {
        achievementElement.classList.remove('show');
        setTimeout(() => {
            achievementElement.remove();
        }, 500);
    }, 5000);
}

// Déverrouiller un achievement spécifique à une section
function unlockAchievementForSection(sectionId) {
    switch(sectionId) {
        case 'hero':
            unlockAchievement('visit_hero', 'Bienvenue dans le CV de Steve!', '../static/icons/diamond.png');
            break;
        case 'about':
            unlockAchievement('visit_about', 'Vous avez consulté la section À propos', '../static/icons/diamond_pickaxe.png');
            break;
        case 'skills':
            unlockAchievement('visit_skills', 'Vous avez exploré les compétences de Steve', '../static/icons/diamond_sword.png');
            break;
        case 'crafting':
            unlockAchievement('visit_crafting', 'Vous avez découvert la calculatrice Minecraft', '../static/icons/diamond_pickaxe.png');
            break;
        case 'contact':
            unlockAchievement('visit_contact', 'Vous êtes prêt à contacter Steve', '../static/icons/diamond.png');
            break;
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