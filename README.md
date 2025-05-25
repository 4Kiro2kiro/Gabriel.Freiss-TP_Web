# Steve's CV - Minecraft Edition

Un CV créatif et interactif sur le thème de Minecraft, développé avec Tailwind CSS et DaisyUI.

## Fonctionnalités

- Design immersif inspiré de l'univers Minecraft avec textures et icônes fidèles au jeu
- Indicateurs de section dynamiques qui montrent votre position dans le CV
- Calculatrice Minecraft interactive avec style authentique
- Système d'achievements qui se débloquent à mesure que vous explorez le CV
- Questionnaire Minecraft interactif pour accéder à la page de contact
- Design entièrement responsive (mobile et desktop)
- Effets sonores et animations pour une expérience immersive
- Fonction "bruteforce" pour les impatients

## Technologies utilisées

- HTML5
- CSS3 avec Tailwind CSS pour le style
- JavaScript vanilla pour l'interactivité
- DaisyUI pour les composants UI basés sur Tailwind
- PostCSS pour la compilation du CSS

## Installation et lancement

1. Clonez ce dépôt
   ```
   git clone https://github.com/4Kiro2kiro/Gabriel.Freiss-TP_Web
   cd TP-Web
   ```

2. Installez les dépendances
   ```
   npm install
   ```

3. Lancez le serveur de développement
   ```
   npm run dev
   ```

   Ou compilez le CSS pour la production:
   ```
   npm run build
   ```

4. Alternative: lancez simplement avec un serveur HTTP statique
   ```
   python -m http.server 8000
   ```

## Structure du projet

- `index.html` - Page principale du CV avec toutes les sections
- `pagecontact.html` - Page de contact débloquée après avoir répondu au questionnaire
- `js/main.js` - Logique JavaScript pour la navigation fluide et l'interactivité
- `css/output.css` - CSS compilé par Tailwind
- `static/` - Images, icônes et ressources pour l'apparence Minecraft
  - `static/icons/` - Icônes Minecraft pour les compétences et la navigation
  - `static/sounds/` - Effets sonores pour les interactions

## Caractéristiques spéciales


### Calculatrice Minecraft
- Interface inspirée de la table de craft Minecraft
- Fonctions mathématiques complètes (addition, soustraction, multiplication, division)
- Effets sonores pour les interactions
- Easter egg lorsque vous obtenez le résultat "42"

### Système d'achievements
- Débloquement d'achievements à mesure que vous explorez le CV
- Notifications visuelles dans le style Minecraft
- Sons de niveau gagné lors du débloquement

## Exigences du projet

- [x] Créer une page web avec un CV ou une passion
- [x] Utiliser les composants de DaisyUI (navigation, cartes, boutons)
- [x] Ajouter un menu "calculatrice" style Minecraft
- [x] Ajouter un menu "Me contacter" avec questionnaire interactif
- [x] Créer une page de contact conditionnelle basée sur les réponses
- [x] Utiliser la fonction mailto pour le formulaire de contact
- [x] Inclure un bouton "bruteforce" pour obtenir les bonnes réponses
- [x] Créer un design responsive et accessible

## Auteur

Gabriel Freiss
