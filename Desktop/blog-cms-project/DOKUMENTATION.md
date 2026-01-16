# Teknisk Dokumentation - Blog CMS

## Innehållsstruktur

### Content Types

**BlogPost**
- Syfte: Blogginlägg
- Fields:
  - Title (TextField): Inläggets rubrik
  - Author (TextField): Författarens namn
  - Body (HtmlField): Innehållstext
- Parts: Title Part, Autoroute Part, HtmlBody Part

**Page**
- Syfte: Statiska sidor
- Fields:
  - Title: Sidans rubrik
  - Body: Sidans innehåll
- Parts: Title Part, HtmlBody Part, Autoroute Part

**Category**
- Syfte: Kategorisering av innehåll
- Fields:
  - Title (TextField): Kategorinamn
  - Description (TextField): Beskrivning
- Parts: Title Part

## Användarroller

### Administrator
- Full åtkomst till systemet
- Kan hantera användare och roller
- Ser alla posts inklusive drafts
- Tillgång till admin panel med statistik

### Editor
- Kan skapa och redigera innehåll
- Ser published posts och egna drafts
- Tillgång till admin panel
- Kan inte hantera användare

### Viewer
- Kan endast se published posts
- Ingen åtkomst till admin panel
- Läsbehörighet

## Publiceringsflöde

### Statusar
- **Draft**: Opublicerat, synligt för författare och administratörer
- **Published**: Publicerat, synligt för alla

### Arbetsflöde
1. Innehåll skapas i Orchard Core
2. Sparas som Draft
3. Vid publicering ändras status till Published
4. Published innehåll visas i frontend
5. Drafts synliga baserat på roll

## API-Integration

### Backend Endpoints

**GET /api/content/blogpost**
Hämtar published BlogPosts
```json
[
  {
    "contentItemId": "string",
    "title": "string",
    "published": true,
    "createdUtc": "2026-01-16T...",
    "author": "string",
    "body": "string"
  }
]
```

**GET /api/auth/current**
Hämtar inloggad användares information

**POST /api/auth/logout**
Loggar ut användare

**GET /api/admin/stats**
Hämtar statistik (kräver autentisering)

### Frontend Implementation

Komponenter:
- App.jsx: Huvudkomponent med routing
- pages/Home.jsx: Startsida
- pages/AdminPanel.jsx: Admin interface
- pages/Login.jsx: Login

API-anrop:
```javascript
const response = await fetch('/api/content/blogpost', {
  credentials: 'include'
});
```

Rollbaserad rendering:
```javascript
{user && user.role === 'Administrator' && (
  <div className="admin-notice">
    Administrator Access
  </div>
)}
```

## Teknisk Stack

### Backend
- .NET 8 med Orchard Core
- SQLite databas
- Controllers: ContentApiController, AuthApiController, AdminApiController
- CORS konfigurerad för localhost:3000

### Frontend
- React 18 med Vite
- Vite proxy för /api
- React Router
- Cookie-baserad autentisering

## Installation

Backend:
```bash
cd BlogCMS
dotnet run
```
Port: 5000

Frontend:
```bash
cd blog-frontend
npm run dev
```
Port: 3000

## Säkerhet

- Passwords hashas av Orchard Core
- Cookie-baserad autentisering
- CORS begränsad till localhost:3000
- Rollbaserad åtkomstkontroll