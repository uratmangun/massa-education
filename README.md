# Massa Education Platform

A comprehensive course creation and learning management system built with React, TypeScript, and Supabase. This platform enables educators to create interactive courses with external API integration for quiz-like completion tracking, specifically designed for Massa blockchain smart contract education.

## 🚀 Features

### Course Creation & Management
- **Dynamic Course Builder**: Create courses with multiple sections using markdown support
- **Interactive Goals System**: Connect courses to external APIs for quiz-like completion validation
- **Real-time Preview**: See how your course will look before publishing
- **Authorization Support**: Secure API communication with custom headers
- **Student Instructions**: Guide learners on how to complete course objectives
- **Course Completion Tracking**: Database-backed system to track user progress and completions

### Learning Experience
- **Course Listing**: Browse all available courses with interactive badges and completion status
- **Rich Content Display**: Markdown-rendered course content with responsive design
- **Interactive Completion**: Submit answers to external APIs for course validation
- **Progress Feedback**: Real-time status updates and completion confirmations
- **Multi-section Courses**: Structured learning with organized content sections

### Technical Features
- **Authentication**: Secure user management with Clerk integration
- **Database**: PostgreSQL with Supabase for scalable data storage and RLS policies
- **API Integration**: External endpoint support for interactive course completion
- **Responsive Design**: Mobile-first approach that works across all device sizes
- **Type Safety**: Full TypeScript implementation with proper type definitions
- **Real-time Updates**: Live preview and status updates during course creation

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS 4.0 with custom components and animations
- **Authentication**: Clerk (third-party auth provider)
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Routing**: React Router DOM v7
- **Markdown**: ReactMarkdown for rich content rendering
- **UI Components**: Custom component library built with Radix UI and shadcn/ui
- **Package Manager**: Bun for fast dependency management
- **Build Tool**: Vite for optimized development and production builds

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v18 or higher)
- **Bun** package manager for fast dependency management
- **Docker** (for local Supabase development environment)
- **Clerk account** for authentication services
- **Local Supabase setup** with project ID `<your local project id>`

## 🚀 Getting Started

### 1. Clone the Repository

```fish
git clone <repository-url>
cd massa-education-platform
```

### 2. Install Dependencies

```fish
bun install
```

### 3. Environment Setup

The project includes a `.env.local` file with the following configuration:

```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=

# Supabase Local Development
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=
```

### 4. Database Setup

The project uses a local Supabase instance with project ID `<your local supabase project id>`. All migrations are automatically applied using Docker:

```fish
# Migrations are applied directly to the PostgreSQL container
cat supabase/migrations/20250716083943_create_courses_table.sql | docker exec -i <your supabase postgres container id> psql -U postgres -d postgres
```

### 5. Run the Development Server

```fish
bun run dev
```

The application will be available at `http://localhost:3000`

## 🗄️ Database Schema

The application uses the following database tables:

### Courses Table
- **id**: UUID primary key
- **title**: Course title (TEXT)
- **user_id**: UUID reference to auth.users (with CASCADE delete)
- **sections**: Course content sections (JSONB array)
- **goals**: Optional external API endpoint (TEXT)
- **authorization_header**: API authorization header (TEXT)
- **instructions**: Student instructions for course completion (TEXT)
- **created_at/updated_at**: Timestamps with automatic updates

### User Course Completions Table
- **id**: UUID primary key
- **user_id**: Clerk user ID (TEXT)
- **course_id**: Reference to courses table (UUID)
- **completed_at**: Completion timestamp
- **Unique constraint**: One completion per user per course

## 📁 Project Structure

```
massa-education-platform/
├── src/
│   ├── components/                 # React components
│   │   ├── ui/                    # Reusable UI components (Button, Card, Input, etc.)
│   │   ├── Header.tsx             # Navigation header component
│   │   ├── HomePage.tsx           # Landing page with hero section
│   │   ├── CoursePage.tsx         # Course listing and overview page
│   │   ├── CreateCoursePage.tsx   # Course creation interface with preview
│   │   └── CourseContentPage.tsx  # Individual course viewer and completion
│   ├── lib/                       # Utility libraries
│   │   ├── supabase.ts           # Supabase client configuration
│   │   └── utils.ts              # Utility functions and helpers
│   ├── App.tsx                    # Main application with routing
│   ├── index.tsx                  # Application entry point
│   └── index.css                  # Global styles and Tailwind imports
├── supabase/
│   ├── config.toml               # Supabase local configuration
│   ├── functions/                # Edge functions (course-handler)
│   └── migrations/               # Database schema migrations (7 files)
├── styles/
│   └── globals.css               # Additional global styles
├── .env.local                    # Environment variables
├── package.json                  # Dependencies and scripts
├── vite.config.ts               # Vite build configuration
├── tsconfig.json                # TypeScript configuration
└── README.md                    # Project documentation
```

## 🎯 Usage Guide

### Creating a Course

1. **Navigate to Course Creation**: Click "Add Course" from the course listing page
2. **Fill Course Details**: Enter title and add multiple sections with content
3. **Configure Goals (Optional)**: 
   - Add external API endpoint URL
   - Set authorization headers if needed
   - Write instructions for students
   - Test the API connection
4. **Preview Your Course**: Use the preview toggle to see how it will look
5. **Save and Publish**: Course becomes immediately available to students

### Taking a Course

1. **Browse Courses**: View all available courses on the main course page
2. **Select a Course**: Click on any course card to start learning
3. **Read Content**: Progress through course sections with markdown content
4. **Complete Goals**: For interactive courses, follow instructions and submit answers
5. **Track Progress**: See completion status and feedback

### API Integration

Courses can integrate with external APIs for completion tracking:

```json
// API Request Format
{
  "message": "student_input_here"
}

// Expected API Response
{
  "status": "success|error",
  "message": "feedback_message"
}
```

## 🔧 Development Features

### Local Development Environment
- **Hot Reload**: Vite provides instant feedback during development
- **TypeScript Support**: Full type checking and IntelliSense
- **Tailwind CSS**: Utility-first styling with JIT compilation
- **Component Library**: Reusable UI components with consistent design

### Database Management
- **Migration System**: Versioned database schema changes
- **Row Level Security**: Secure data access policies
- **Real-time Subscriptions**: Live data updates (available for future features)
- **Local Development**: Docker-based Supabase for offline development

### API Architecture
- **RESTful Design**: Clean API endpoints through Supabase
- **External Integration**: Support for third-party API validation
- **Error Handling**: Comprehensive error states and user feedback
- **Type Safety**: Full TypeScript interfaces for all data models

## 🚀 Deployment

### Production Build

```fish
bun run build
```

### Environment Variables for Production

Update your production environment with:

```env
# Production Clerk Configuration
VITE_CLERK_PUBLISHABLE_KEY=your_production_clerk_key

# Production Supabase Configuration
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_key
```

### Deployment Checklist

1. **Database Migration**: Apply all migrations to your production Supabase instance
2. **Environment Variables**: Update all production environment variables
3. **Clerk Configuration**: Configure production domain and redirect URLs
4. **Build Optimization**: Run production build with optimizations enabled
5. **Testing**: Verify all features work in production environment

## 🤝 Contributing

1. **Fork the Repository**: Create your own copy of the project
2. **Create Feature Branch**: Work on features in dedicated branches
3. **Follow Code Standards**: Maintain TypeScript types and component patterns
4. **Test Thoroughly**: Ensure all features work with both local and external APIs
5. **Update Documentation**: Keep README and code comments current
6. **Submit Pull Request**: Provide clear description of changes and testing performed

## 📄 License

This project is licensed under the **MIT License** - an OSI (Open Source Initiative) approved license.

### MIT License Summary

- ✅ **Commercial Use**: Use this software commercially
- ✅ **Modification**: Modify the source code
- ✅ **Distribution**: Distribute copies of the software
- ✅ **Private Use**: Use the software privately
- ✅ **Patent Grant**: Express grant of patent rights from contributors

### License Requirements

- 📋 **License and Copyright Notice**: Include the license and copyright notice with the software

See the [LICENSE](LICENSE) file for the complete license text.

### Open Source Commitment

This project is committed to open source principles:

- **Transparency**: All source code is publicly available
- **Community Driven**: Contributions welcome from developers worldwide
- **Educational Purpose**: Built to help others learn and build upon
- **No Vendor Lock-in**: Use, modify, and distribute freely

## 🙏 Acknowledgments

- **Supabase**: For providing excellent backend-as-a-service platform
- **Clerk**: For seamless authentication solutions
- **React Community**: For the amazing ecosystem and development tools
- **Tailwind CSS**: For the utility-first CSS framework
- **Vite**: For the fast and modern build tooling
- **Massa Blockchain**: For inspiring this educational platform

---

*Built with modern web technologies to provide an excellent learning experience for Massa blockchain smart contract development.*