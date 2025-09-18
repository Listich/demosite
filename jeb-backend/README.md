````markdown
# 📘 JEB Backend – Laravel 11 API

## 🚀 Présentation

Ce backend Laravel 11 expose une API RESTful pour gérer les entités de l’incubateur JEB :  
**startups**, **projets**, **utilisateurs**, **fondateurs**, **investisseurs**, **partenaires**, **news** et **événements**.

Les données sont synchronisées depuis l’API officielle JEB via une commande artisan dédiée.

---

## 🧩 Stack Technique

- **Framework** : Laravel 11
- **Langage** : PHP 8.3+
- **Base de données** : MySQL (production), SQLite (tests)
- **Authentification** : Sanctum (token-based)
- **Tests** : PHPUnit

---

## 📦 Installation

```bash
git clone https://github.com/ton-compte/jeb-backend.git
cd jeb-backend

composer install
cp .env.example .env
php artisan key:generate
````

Configure ensuite le fichier `.env` :

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=jeb
DB_USERNAME=root
DB_PASSWORD=

# Token pour l’API JEB
JEB_API_TOKEN=xxx-votre-token-ici
```

---

## 🗃️ Migration & Seeder

```bash
php artisan migrate
php artisan db:seed
```

---

## 🔄 Synchronisation avec l’API JEB

Pour importer les données distantes :

```bash
php artisan sync:jeb
```

---

## 🔐 Authentification

### Endpoint

```http
POST /api/login
```

### Body JSON

```json
{
  "email": "admin@jeb.com",
  "password": "password"
}
```

### Réponse

```json
{
  "user": {
    "id": 1,
    "name": "Admin",
    "email": "admin@jeb.com"
  },
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJI..."
}
```

Utilisez ce token dans l’en-tête :

```
Authorization: Bearer VOTRE_TOKEN_ICI
```

Pour accéder aux routes protégées.

---

## 📡 Endpoints principaux

### 👤 Utilisateurs (`/api/users`)

| Méthode | Route         | Description              |
| ------- | ------------- | ------------------------ |
| GET     | `/users`      | Lister les utilisateurs  |
| GET     | `/users/{id}` | Voir un utilisateur      |
| POST    | `/users`      | Créer un utilisateur     |
| PUT     | `/users/{id}` | Modifier un utilisateur  |
| DELETE  | `/users/{id}` | Supprimer un utilisateur |

### 🚀 Startups (`/api/startups`)

| Méthode | Route       | Description             |
| ------- | ----------- | ----------------------- |
| GET     | `/startups` | Lister les startups     |
| POST    | `/startups` | Créer une startup       |
| ...     | etc.        | CRUD complet disponible |

### 📊 Dashboard (`/api/dashboard`)

| Méthode | Route        | Description                            |
| ------- | ------------ | -------------------------------------- |
| GET     | `/dashboard` | Statistiques agrégées de la plateforme |

---

## ✅ Lancer les tests

```bash
php artisan test
```

### Fichiers de test inclus :

* `AuthTest.php`
* `AuthenticatedUserTest.php`
* `UserTest.php`
* `ProjectTest.php`
* `StartupTest.php`
* `DashboardTest.php`

> Pest peut également être utilisé si installé (`./vendor/bin/pest`)

---

## 👨‍💻 Auteur

Projet réalisé par **Serena Kifoula – Epitech Toulouse**
📅 **Septembre 2025**
