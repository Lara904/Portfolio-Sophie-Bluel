# Portfolio Architecte – Front-End

Projet de développement d’une interface dynamique pour le portfolio d’un architecte.

## Sommaire

- Contexte
- Fonctionnalités
- Technologies utilisées
- Installation
- Utilisation
- Structure du projet
- Crédits

## Contexte

Ce projet consiste à :

- Dynamiser la galerie de projets sur la page d'accueil
- Développer une interface de connexion pour l'administrateur
- Implémenter une modale pour ajouter, supprimer et gérer les projets

Les maquettes ont été fournies via Figma, le back-end a été fourni en Node.js avec une documentation Swagger.

## Fonctionnalités

Utilisateur :

- Affichage dynamique des projets depuis l'API
- Filtrage des projets par catégorie

Administrateur :

- Page de connexion sécurisée
- Authentification via token JWT
- Ajout de projets via formulaire (upload image, titre, catégorie)
- Suppression de projets depuis la modale
- Galerie et modale mises à jour dynamiquement sans rechargement

## Technologies utilisées

- HTML5 / CSS3
- JavaScript (Vanilla)
- Node.js (API fournie)
- Swagger (documentation API)
- Figma (UI/UX design)

## Installation

Prérequis :

- Node.js & npm installés

Cloner le projet :

git clone https://github.com/votre-utilisateur/portfolio-architecte.git
cd portfolio-architecte

Installation du back-end :

cd backend
npm install
npm start

Le serveur démarre à l'adresse : http://localhost:5678

Interface Swagger disponible à : http://localhost:5678/api-docs

Lancer le front-end :

Ouvrir index.html dans votre navigateur ou utiliser une extension comme Live Server (VS Code)

## Utilisation

- Accéder à la page d’accueil via index.html
- Cliquer sur "login" pour se connecter (email/mot de passe valides requis)
- Une fois connecté :
  - Supprimer un projet via l’icône poubelle
  - Ajouter un projet via la modale et formulaire d’upload
- Les modifications sont visibles immédiatement sans rechargement

## Structure du projet

frontend/
├── index.html
├── login.html
├── css/
├── js/
└── assets/

backend/
├── app.js
├── routes/
├── controllers/
└── ...

README.md

## Crédits

- Design fourni via Figma
- API et documentation fournies dans le cadre du projet
- Développement : [Lara O]
