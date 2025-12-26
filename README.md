# Inventory & Purchase Management System

A full-stack inventory and purchase management application built with Next.js and ASP.NET Core following Clean Architecture principles.

## Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **State Management**: Redux Toolkit with RTK Query
- **UI**: Custom components with Tailwind CSS
- **Charts**: Chart.js with react-chartjs-2
- **Icons**: react-icons

### Backend
- **Framework**: ASP.NET Core (.NET 8)
- **Language**: C#
- **Architecture**: Clean Architecture (Domain, Application, Infrastructure, API layers)
- **ORM**: Entity Framework Core
- **Database**: PostgreSQL

## Features

### 1. Dashboard
- **Inventory Overview Tab**
  - Graph showing total vs used inventory capacity
  - Cards displaying total inventory, total items, and capacity percentage
  - Section-wise capacity with progress indicators
  - Recent inventory logs

- **Purchase Overview Tab**
  - Graph showing purchases over time
  - Total sales and current year cost statistics
  - Recent purchase logs

### 2. Inventory Items Management
- View all inventory items in a table
- Full CRUD operations (Create, Read, Update, Delete)
- Add new items with form including:
  - Name, description, quantity, unit price
  - Section assignment (A, B, C, or D)
  - Image URL

### 3. Purchase Management
- View all purchases and active purchases
- Create new purchase orders
- Form to add multiple items to a purchase
- Track purchase status (Pending, Active, Completed, Cancelled)
- Display purchased by, date, total cost

### 4. Image Recognition (UI Placeholder)
- Upload receipt or product images
- Mock detection of receipt vs product
- Extract data from uploaded images
- Log directly to inventory or purchases

## Project Structure

```
inventory-management/
├── frontend/              # Next.js frontend
│   ├── app/              # App Router pages
│   │   ├── page.tsx      # Dashboard
│   │   ├── inventory/    # Inventory pages
│   │   ├── purchases/    # Purchase pages
│   │   └── image-recognition/
│   ├── components/       # React components
│   │   ├── dashboard/
│   │   ├── layout/
│   │   └── ui/          # Shared UI components
│   ├── lib/             # Libraries and utilities
│   │   ├── api/         # RTK Query API slices
│   │   └── store/       # Redux store
│   └── types/           # TypeScript type definitions
│
└── backend/             # ASP.NET Core backend
    ├── InventoryManagement.Domain/
    │   ├── Entities/    # Domain entities
    │   └── Enums/       # Domain enums
    ├── InventoryManagement.Application/
    │   ├── DTOs/        # Data Transfer Objects
    │   └── Interfaces/  # Service interfaces
    ├── InventoryManagement.Infrastructure/
    │   ├── Data/        # DbContext
    │   ├── Repositories/
    │   └── Services/    # Service implementations
    └── InventoryManagement.API/
        ├── Controllers/ # API controllers
        └── Program.cs   # App configuration
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- .NET 8 SDK
- PostgreSQL database

### Backend Setup

1. Navigate to the backend API directory:
```bash
cd backend/InventoryManagement.API
```

2. Update the connection string in `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=inventory_management;Username=postgres;Password=your_password"
  }
}
```

3. Run database migrations:
```bash
dotnet ef migrations add InitialCreate --project ../InventoryManagement.Infrastructure
dotnet ef database update --project ../InventoryManagement.Infrastructure
```

4. Run the backend:
```bash
dotnet run
```

The API will be available at `https://localhost:5001` or `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Inventory Items
- `GET /api/inventoryitems` - Get all inventory items
- `GET /api/inventoryitems/{id}` - Get inventory item by ID
- `POST /api/inventoryitems` - Create new inventory item
- `PUT /api/inventoryitems/{id}` - Update inventory item
- `DELETE /api/inventoryitems/{id}` - Delete inventory item

### Purchases
- `GET /api/purchases` - Get all purchases
- `GET /api/purchases/active` - Get active purchases
- `GET /api/purchases/{id}` - Get purchase by ID
- `POST /api/purchases` - Create new purchase
- `DELETE /api/purchases/{id}` - Delete purchase

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Architecture Highlights

### Clean Architecture
The backend follows Clean Architecture with clear separation of concerns:
- **Domain**: Core business entities and enums
- **Application**: Business logic, DTOs, and interfaces
- **Infrastructure**: Data access, EF Core, and service implementations
- **API**: Controllers, middleware, and dependency injection

### Component-Driven Frontend
- Thin page components that only compose child components
- Feature-specific components in dedicated folders
- Reusable UI components
- Type-safe API calls with RTK Query

## Production Considerations

- Add proper authentication and authorization (consider NextAuth.js for frontend, JWT for backend)
- Implement proper error handling and logging
- Add input validation
- Implement actual image recognition service (e.g., Azure Computer Vision, AWS Rekognition)
- Add unit and integration tests
- Configure environment variables for different environments
- Set up CI/CD pipelines
- Add database backup and recovery procedures
- Implement rate limiting and security headers

## License

MIT
