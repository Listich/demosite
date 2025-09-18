# 🚀 JEB Incubator – Fullstack Project (Piscine)

Ce projet a été réalisé dans le cadre de la **Piscine JEB Incubator**.  
Il comprend un **backend en Laravel 11** et un **frontend en Angular 17**, connectés ensemble pour gérer et afficher les données d’un incubateur de startups.

---
<img width="4096" height="2240" alt="Screenshot From 2025-09-18 18-36-01" src="https://github.com/user-attachments/assets/9b7b7325-3815-4901-8b3b-244202286f91" />


## 🔧 Tech Stack

### Backend
- **Laravel 11** (PHP 8.2)
- **MySQL** (base de données relationnelle)
- **Sanctum** (authentification par token)
- **cURL / Postman** (tests API)

### Frontend
- **Angular 17** (standalone components)
- **TypeScript**
- **TailwindCSS** (design moderne et responsive)
- **Palette personnalisée** : *Sweet Pink Dreams* (rose/violet pastel, style magazine/blog)

---
<img width="4096" height="2240" alt="Screenshot From 2025-09-18 18-37-03" src="https://github.com/user-attachments/assets/2d7a2103-b82c-472c-80ff-ef44fd73ab93" />



## 📌 Fonctionnalités

### Backend (API Laravel)
- 🔑 Authentification (register, login, tokens, middleware)
- 👤 Gestion des utilisateurs (CRUD complet)
- 🚀 Gestion des startups et projets (CRUD complet)
- 📊 Dashboard avec statistiques globales
- 🔄 Synchronisation des données depuis l’API JEB externe
- 🖼️ Gestion des images (utilisateurs, startups, projets, fondateurs)

### Frontend (Angular)
- 📰 Page **News** (style blog/magazine, thème GutenVerse)
- 📂 Affichage des startups et projets
- 📊 Dashboard utilisateur connecté à l’API
- 🎨 Interface soignée, avec une UI “cute” et moderne

---

## 🧪 Tests

- **Backend** : Auth, Users, Projects, Startups, Dashboard (via **Pest**)
- **Frontend** : tests unitaires Angular (Jasmine/Karma)

---

## 🚀 Installation & Lancement

### Backend
```bash
# Cloner le repo backend
git clone https://github.com/<ton-username>/jeb-backend.git
cd jeb-backend

# Installer les dépendances
composer install

# Configurer l'environnement
cp .env.example .env
php artisan key:generate

# Lancer les migrations et seeders
php artisan migrate --seed

# Lancer le serveur local
php artisan serve
