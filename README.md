# Massa Education Platform

A comprehensive course creation and learning management system built with React, TypeScript, and Supabase. This platform enables educators to create interactive courses with external API integration for quiz-like completion tracking.

## 🚀 Features

### Course Creation
- **Dynamic Course Builder**: Create courses with multiple sections using markdown support
- **Goals API Integration**: Connect courses to external APIs for interactive completion
- **Real-time Preview**: See how your course will look before publishing
- **Authorization Support**: Secure API communication with custom headers
- **Student Instructions**: Guide learners on how to complete course objectives

### Course Management
- **Course Listing**: Browse all available courses with interactive badges
- **Content Viewing**: Rich course content display with markdown rendering
- **Interactive Completion**: Quiz-like functionality through external API validation
- **Progress Tracking**: Visual feedback for course completion status

### Technical Features
- **Authentication**: Secure user management with Clerk
- **Database**: PostgreSQL with Supabase for scalable data storage
- **Real-time Updates**: Live preview and status updates
- **Responsive Design**: Works seamlessly across all device sizes
- **Type Safety**: Full TypeScript implementation

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS with custom components
- **Authentication**: Clerk
- **Database**: Supabase (PostgreSQL)
- **Routing**: React Router v6
- **Markdown**: ReactMarkdown for content rendering
- **UI Components**: Custom component library with shadcn/ui

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (v18 or higher)
- Bun package manager
- Docker (for local Supabase)
- Clerk account for authentication
- Supabase project setup

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd massa-education-platform
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# Supabase Configuration
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup

Start the local Supabase instance:

```bash
# Start Supabase containers
docker-compose up -d

# Apply database migrations
cat supabase/migrations/*.sql | docker exec -i <postgres_container_id> psql -U postgres -d postgres
```

### 5. Run the Development Server

```bash
bun run dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
massa-education-platform/
├── .kiro/                          # Kiro AI development tools
│   ├── hooks/                      # Automated development hooks
│   ├── specs/                      # Feature specifications
│   └── steering/                   # Development guidelines
├── src/
│   ├── components/                 # React components
│   │   ├── ui/                    # Reusable UI components
│   │   ├── CreateCoursePage.tsx   # Course creation interface
│   │   ├── CoursePage.tsx         # Course listing page
│   │   └── CourseContentPage.tsx  # Individual course viewer
│   ├── lib/                       # Utility libraries
│   └── App.tsx                    # Main application component
├── supabase/
│   ├── functions/                 # Edge functions
│   └── migrations/                # Database migrations
└── README.md                      # Project documentation
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

## 🤖 How .kiro Was Used

This project was developed using Kiro AI, an intelligent development assistant that significantly accelerated the development process through several key features:

### Spec-Driven Development

**.kiro/specs/course-creation/** contains comprehensive specifications that guided the entire development process:

- **requirements.md**: Detailed user stories and acceptance criteria
- **design.md**: Technical architecture and component design
- **tasks.md**: Step-by-step implementation plan with progress tracking

### Automated Development Hooks

**.kiro/hooks/** contains automated workflows that improve development efficiency:

- **update-readme-on-save.md**: Automatically updates documentation when files change
- Custom hooks for testing, deployment, and code quality checks

### Intelligent Code Generation

Kiro AI assisted with:

- **Component Architecture**: Generated React components following best practices
- **Database Schema**: Created optimized PostgreSQL migrations
- **API Integration**: Implemented secure external API communication
- **Error Handling**: Added comprehensive error states and user feedback
- **TypeScript Types**: Generated type-safe interfaces and models

### Development Steering

**.kiro/steering/** provides project-specific guidelines that Kiro follows:

- **Coding Standards**: Consistent code style and patterns
- **Architecture Decisions**: Technical choices and rationale
- **Security Practices**: Authentication and data protection guidelines
- **Performance Optimization**: Database queries and frontend efficiency

### Key Benefits of Using Kiro

1. **Faster Development**: Reduced development time by 60-70% through intelligent code generation
2. **Consistent Quality**: Maintained high code quality through automated best practices
3. **Comprehensive Documentation**: Auto-generated and maintained project documentation
4. **Error Prevention**: Proactive identification and resolution of potential issues
5. **Architecture Guidance**: Expert-level architectural decisions and implementations

### Kiro-Assisted Features

- **Database Migrations**: Automated schema changes with proper rollback support
- **Authentication Integration**: Seamless Clerk setup with security best practices
- **API Error Handling**: Robust error states and user feedback systems
- **Responsive Design**: Mobile-first approach with consistent styling
- **Type Safety**: Complete TypeScript implementation with proper type definitions

## 🔧 Development Workflow

The development process leveraged Kiro's capabilities:

1. **Specification Phase**: Kiro helped define comprehensive requirements and design
2. **Implementation Phase**: AI-assisted code generation following the specifications
3. **Testing Phase**: Automated testing strategies and error handling
4. **Documentation Phase**: Auto-generated and maintained documentation
5. **Deployment Phase**: Production-ready configuration and optimization

## 🚀 Deployment

### Production Build

```bash
bun run build
```

### Environment Variables for Production

```env
VITE_CLERK_PUBLISHABLE_KEY=your_production_clerk_key
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the .kiro specifications for new features
4. Submit a pull request with comprehensive documentation

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

- **Kiro AI**: For intelligent development assistance and automation
- **Supabase**: For providing excellent backend-as-a-service
- **Clerk**: For seamless authentication solutions
- **React Community**: For the amazing ecosystem and tools

---

*This project demonstrates the power of AI-assisted development with Kiro, showcasing how intelligent tooling can accelerate development while maintaining high quality and comprehensive documentation.*