# Blog CMS

Ett fullstack Blog CMS byggt med Orchard Core och React med rollbaserad åtkomstkontroll.

## Teknologier

**Backend**
- Orchard Core CMS (.NET 8)
- SQLite
- ASP.NET Core Web API

**Frontend**
- React 18
- Vite
- React Router

## Installation

### Backend
```bash
cd BlogCMS
dotnet run
```

Första körning: Gå till `http://localhost:5000/setup`

### Frontend
```bash
cd blog-frontend
npm install
npm run dev
```

## Inloggning

1. Logga in på `http://localhost:5000/admin`
2. Använd testanvändare (se tabell nedan)
3. Navigera till `http://localhost:3000`

## Testanvändare

| Roll | Användarnamn | Lösenord |
|------|--------------|----------|
| Administrator | admin | Admin123! |
| Editor | editor | Editor123! |
| Viewer | viewer | Viewer123! |

## Projektstruktur
```
blog-cms-project/
├── BlogCMS/              # Backend
├── blog-frontend/        # Frontend
└── DOKUMENTATION.md      # Teknisk dokumentation
```

## Kursinformation

**Student:** Lina El-Sidani  
**Program:** .NET Systems Developer  
**Skola:** TUC Yrkeshögskola