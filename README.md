# StockFlow - Inventory Management System

A modern, web-based inventory management system built with React and TypeScript. This application provides comprehensive stock control features including product management, quantity tracking, user authentication, and role-based permissions.

## Features

- **Product Management**: Add, edit, delete, and search products with detailed information
- **Stock Control**: Track current stock levels with entry and exit transactions
- **User Authentication**: Secure login system with role-based access control
- **Role Permissions**: Different access levels (Admin, Operator) with specific capabilities
- **Real-time Updates**: Live inventory updates with toast notifications
- **Responsive Design**: Modern UI built with shadcn/ui and Tailwind CSS
- **Transaction History**: Track all stock movements and changes

## Technologies Used

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Framework**: shadcn/ui components
- **Styling**: Tailwind CSS
- **HTTP Client**: Fetch API communication
- **State Management**: React Context API
- **Icons**: Lucide React
- **Notifications**: Sonner for toast messages

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd stockflow
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Update the `.env` file with your API configuration:
```bash
VITE_API_BASE_URL=http://localhost:5000/api
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Layout.tsx      # Main layout wrapper
│   └── PermissionGate.tsx # Role-based access control
├── contexts/           # React Context providers
│   ├── AuthContext.tsx # Authentication state
│   ├── InventoryContext.tsx # Product and stock management
│   └── UserContext.tsx # User management
├── pages/              # Application pages
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Login.tsx       # Authentication page
│   ├── Produtos/       # Product management pages
│   └── Usuarios.tsx    # User management
├── services/           # API services
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## API Integration

This frontend application requires a backend API server. Make sure to:

1. Set up your backend API server
2. Configure the `VITE_API_BASE_URL` in your `.env` file to point to your API endpoint
3. Ensure CORS is properly configured on your backend to allow requests from the frontend

## User Roles

- **Admin**: Full access to all features including user management and system settings
- **Operator**: Can manage products and stock but has limited access to administrative features

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is licensed under the MIT License.
