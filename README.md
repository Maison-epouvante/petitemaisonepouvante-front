# Petite Maison de l'Épouvante - Frontend React

Application frontend React TypeScript moderne pour la plateforme e-commerce Petite Maison de l'Épouvante.

## 🎨 Technologies

- **React 19.2.0** - Bibliothèque UI moderne
- **TypeScript** - Typage statique
- **Vite 7.2.4** - Build tool ultra-rapide
- **React Router v6** - Navigation côté client
- **Axios** - Client HTTP pour les appels API
- **CSS Modules** - Styling avec CSS moderne
- **Docker** - Conteneurisation avec build multi-stage
- **Nginx** - Serveur web de production avec reverse proxy

## 🚀 Démarrage Rapide

### Développement Local

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

Le proxy Vite redirige automatiquement `/api/*` vers `http://localhost:8000` (API Gateway).

### Production avec Docker

```bash
# Build l'image Docker
docker-compose build petitemaisonepouvante-front

# Démarrer le conteneur
docker-compose up -d petitemaisonepouvante-front
```

Accessible sur `http://localhost:3000`

## 📁 Structure du Projet

```
src/
├── api/
│   └── index.ts              # Configuration Axios et endpoints API
├── components/
│   ├── Header.tsx            # En-tête avec navigation et badge panier
│   └── Header.css
├── hooks/
│   └── useCart.ts            # Hook personnalisé pour gestion du panier
├── pages/
│   ├── Home.tsx              # Page d'accueil
│   ├── Home.css
│   ├── Products.tsx          # Catalogue produits avec filtres
│   ├── Products.css
│   ├── Cart.tsx              # Panier et checkout
│   ├── Cart.css
│   ├── Trocs.tsx             # Trocs, dons et échanges
│   └── Trocs.css
├── types/
│   └── index.ts              # Types TypeScript
├── App.tsx                   # Composant principal avec routing
├── App.css
├── index.css                 # Styles globaux
└── main.tsx                  # Point d'entrée
```

## 🎯 Fonctionnalités

### 🏠 Page d'Accueil
- Hero section avec gradient attractif
- Affichage des catégories de produits
- Produits mis en avant
- Section Troc & Dons

### 🛍️ Catalogue Produits
- Listing de tous les produits
- Filtrage par catégorie
- Ajout au panier avec feedback visuel
- Affichage du stock disponible
- Cards avec effets hover

### 🛒 Panier
- Affichage des articles avec miniatures
- Gestion des quantités (+/-)
- Suppression d'articles
- Récapitulatif de commande
- Formulaire d'adresse de livraison
- Création de commande via Order Service
- Message de succès avec mention RabbitMQ

### 🔄 Troc & Dons
- Listing des annonces (troc/don/échange)
- Création de nouvelles annonces
- Sélection du type d'annonce
- Bordures colorées par type
- Boutons de contact

## 🔌 Intégration API

Le frontend communique avec tous les microservices via l'API Gateway (`/api`):

### User Service
- `GET /api/users` - Liste des utilisateurs
- `POST /api/users` - Créer un utilisateur
- `GET /api/users/:id` - Détails utilisateur

### Product Service
- `GET /api/products` - Liste des produits
- `GET /api/products/:id` - Détails produit
- `GET /api/categories` - Liste des catégories

### Order Service
- `POST /api/orders` - Créer une commande
- Message RabbitMQ automatique vers Notification Service

### Troc Service
- `GET /api/trocs` - Liste des trocs
- `POST /api/trocs` - Créer un troc
- `GET /api/trocs/:id` - Détails troc

## 🎨 Design

### Thème Horror/Épouvante
- Palette de couleurs avec gradients sombres
- Effets hover avec transitions fluides
- Design responsive (mobile-first)
- Scrollbar personnalisée
- Typography moderne

### Couleurs Principales
- `#6a11cb` → `#2575fc` (Gradient bleu-violet)
- `#f093fb` → `#f5576c` (Gradient rose)
- `#4facfe` → `#00f2fe` (Gradient cyan)
- `#43e97b` → `#38f9d7` (Gradient vert)

## 🐳 Docker

### Multi-stage Build

**Stage 1: Builder**
- Base: `node:20-alpine`
- Installation des dépendances
- Build de l'application Vite

**Stage 2: Production**
- Base: `nginx:alpine`
- Copie des fichiers buildés
- Configuration Nginx avec reverse proxy

### Configuration Nginx

```nginx
location /api/ {
    proxy_pass http://nginx-api-gateway:80;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

## 🔧 Scripts NPM

```json
{
  "dev": "vite",           // Serveur de développement
  "build": "tsc -b && vite build",  // Build production
  "lint": "eslint .",      // Linting
  "preview": "vite preview" // Preview du build
}
```

## 🗂️ Gestion d'État

### useCart Hook
- Persistance dans `localStorage`
- Fonctions: `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`
- Calculs: `getTotal`, `getItemCount`
- Synchronisation automatique

## 📦 Dépendances Principales

```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^6.28.0",
  "axios": "^1.7.9"
}
```

## 🌐 URLs de Développement

- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:8000
- **User Service**: http://localhost:8001
- **Product Service**: http://localhost:8002
- **Order Service**: http://localhost:8003
- **Troc Service**: http://localhost:8004
- **Notification Service**: http://localhost:8005

## 🔗 Architecture Microservices

```
Frontend (React) → API Gateway (Laravel) → Microservices
                                          ↓
                                    - User Service
                                    - Product Service
                                    - Order Service → RabbitMQ → Notification Service
                                    - Troc Service
```

## 📝 Variables d'Environnement

### Développement (vite.config.ts)
```typescript
server: {
  host: true,
  port: 3000,
  proxy: {
    '/api': 'http://localhost:8000'
  }
}
```

### Production (Nginx)
Le proxy Nginx redirige `/api` vers `http://nginx-api-gateway:80` dans le réseau Docker.

## 🧪 Tests

```bash
npm run test      # Tests unitaires (à configurer)
npm run lint      # Linting du code
```

## 🚢 Déploiement

L'application est prête pour le déploiement avec:
- Build optimisé avec Vite
- Compression gzip activée
- Cache headers configurés
- SPA routing avec fallback index.html
- Reverse proxy vers l'API Gateway

## 📚 Documentation Complémentaire

- [Guide de Migration](../GUIDE_MIGRATION.md)
- [Routes API](../ROUTES_API.md)
- [Troubleshooting](../TROUBLESHOOTING.md)
- [Quick Start](../README_QUICK_START.md)

## 🎓 Points Clés

1. **Routing SPA**: React Router gère la navigation côté client
2. **Proxy API**: Toutes les requêtes `/api` sont proxifiées vers l'API Gateway
3. **Panier Persistant**: Le panier est sauvegardé dans localStorage
4. **RabbitMQ**: Les commandes déclenchent des notifications asynchrones
5. **Docker**: Build multi-stage pour optimiser la taille de l'image
6. **Responsive**: Design adapté mobile, tablette et desktop

## 🐛 Résolution de Problèmes

### Le frontend ne se connecte pas à l'API
- Vérifier que l'API Gateway est démarré: `docker ps | grep nginx-api-gateway`
- Vérifier les logs: `docker logs petitemaisonepouvante-front`
- Vérifier la configuration du proxy dans `vite.config.ts` (dev) ou `nginx.conf` (prod)

### Erreur CORS
Les CORS sont gérés par Laravel dans l'API Gateway. Vérifier `config/cors.php`.

### Le panier ne persiste pas
Vérifier que le localStorage n'est pas désactivé dans le navigateur.

## 📞 Support

Pour toute question ou problème, consulter la documentation ou créer une issue.

---

**Créé avec ❤️ pour Petite Maison de l'Épouvante**
