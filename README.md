# Agora API

API pour l'application Agora - Service de location de salles municipales

## Description

Agora est une application permettant la location de salles municipales souvent inutilisées pour différents types d'événements : réunions, expositions, conférences, etc.

## Technologies utilisées

- **Backend**: Node.js, Express.js
- **Base de données**: MongoDB (NoSQL), PostgreSQL (relationnel)
- **Authentification**: JWT, bcryptjs
- **Email**: Resend
- **Communication temps réel**: Socket.IO
- **Documentation**: Swagger
- **Tests**: Jest, Supertest
- **Conteneurisation**: Docker

## Installation

### Prérequis
- Node.js (v18+)
- MongoDB
- PostgreSQL
- Docker (optionnel)

### Installation locale

1. Cloner le dépôt
```bash
git clone https://github.com/amirmoussi25/agora-api.git
cd agora-api
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer les variables d'environnement
```bash
cp .env.example .env
# Modifier le fichier .env avec vos paramètres
```

4. Démarrer les bases de données
```bash
# MongoDB et PostgreSQL doivent être en cours d'exécution
```

5. Lancer l'application
```bash
npm run dev
```

### Installation avec Docker

```bash
docker-compose up -d
```

## Scripts disponibles

- `npm start`: Démarre l'application en production
- `npm run dev`: Démarre l'application en mode développement
- `npm test`: Lance les tests
- `npm run test:watch`: Lance les tests en mode watch
- `npm run test:coverage`: Lance les tests avec rapport de couverture

## Documentation API

La documentation Swagger est disponible à l'adresse : `http://localhost:3001/api-docs`

## Structure du projet
