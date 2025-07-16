# Design Document

## Overview

The course creation feature is implemented as a React component that integrates with Supabase for data persistence and Clerk for authentication. The design follows a form-based approach with dynamic section management and real-time validation.

## Architecture

### Frontend Architecture
- **React Component**: `CreateCoursePage` handles the UI and user interactions
- **State Management**: React hooks manage form state and loading states
- **Authentication**: Clerk integration for user authentication and user ID retrieval
- **Database Client**: Supabase client for database operations
- **Routing**: React Router for navigation between pages

### Backend Architecture
- **Database**: PostgreSQL with Supabase
- **Authentication**: Clerk handles user authentication
- **Security**: Row Level Security (RLS) policies ensure data isolation
- **Data Storage**: JSONB format for flexible section storage

## Components and Interfaces

### React Component Structure
```typescript
CreateCoursePage {
  - State: courseTitle, sections, goals, instructions, authorizationHeader, testMessage, goalsStatus, isLoading, showPreview
  - Handlers: addSection, removeSection, handleSectionChange, saveCourse, testGoalsLink
  - UI: Form with title input, dynamic sections, goals API input, instructions input, auth header input, preview functionality
}

CoursePage {
  - State: courses, loading
  - Handlers: fetchCourses
  - UI: Course listing with cards, loading states, empty states, interactive badges
}

CourseContentPage {
  - State: course, loading, userMessage, goalStatus, submittingGoal, courseCompleted
  - Handlers: fetchCourse, handleGoalSubmission
  - UI: Course content display, interactive completion section, goal submission interface
}
```

### Database Schema
```sql
courses {
  id: UUID (Primary Key)
  title: TEXT (Not Null)
  user_id: TEXT (Clerk user ID - changed from UUID to support Clerk authentication)
  sections: JSONB (Array of section objects)
  goals: TEXT (Optional web link for external goals API)
  instructions: TEXT (Optional instructions for students)
  authorization_header: TEXT (Optional auth header for goals API calls)
  created_at: TIMESTAMP WITH TIME ZONE
  updated_at: TIMESTAMP WITH TIME ZONE
}
```

### Section Data Structure
```typescript
Section {
  title: string
  content: string
}
```

## Data Models

### Course Model
```typescript
type Course = {
  id: string
  title: string
  user_id: string
  sections: Array<{
    title: string
    content: string
  }>
  goals?: string
  created_at: string
  updated_at: string
}
```

### Form State Model
```typescript
type FormState = {
  courseTitle: string
  sections: Array<{
    title: string
    content: string
  }>
  goals: string
  testMessage: string
  goalsStatus: {
    status: 'success' | 'error' | null
    message: string
  }
  testingGoals: boolean
  isLoading: boolean
}
```

### Goals API Response Model
```typescript
type GoalsAPIResponse = {
  status: 'success' | 'error'
  message: string
}
```

## Error Handling

### Validation Errors
- **Empty Title**: Alert user if course title is empty
- **No Valid Sections**: Alert user if all sections are empty
- **Authentication**: Redirect to sign-in if user is not authenticated

### Database Errors
- **Connection Issues**: Display generic error message and log details
- **Permission Errors**: Handle RLS policy violations
- **Network Errors**: Retry mechanism with user feedback

### User Feedback
- **Loading States**: Visual feedback during save operations
- **Success Messages**: Confirmation when course is saved
- **Error Messages**: Clear error descriptions for users

## Testing Strategy

### Unit Testing
- **Component Rendering**: Test component renders correctly
- **State Management**: Test state updates for form interactions
- **Validation Logic**: Test form validation functions
- **Event Handlers**: Test button clicks and form submissions

### Integration Testing
- **Database Operations**: Test course creation and retrieval
- **Authentication Flow**: Test authenticated and unauthenticated states
- **Navigation**: Test routing between pages
- **Error Scenarios**: Test error handling and recovery

### End-to-End Testing
- **Complete User Flow**: Test full course creation workflow
- **Cross-browser Testing**: Ensure compatibility across browsers
- **Responsive Design**: Test on different screen sizes
- **Performance Testing**: Test with large numbers of sections

## Security Considerations

### Row Level Security (RLS)
- **User Isolation**: Users can only access their own courses
- **Policy Enforcement**: Database-level security policies
- **Authentication Integration**: Clerk user ID used for authorization

### Input Validation
- **Client-side Validation**: Immediate feedback for users
- **Server-side Validation**: Database constraints and triggers
- **XSS Prevention**: Proper input sanitization

### Data Privacy
- **User Data Protection**: Personal course content is private
- **Audit Trail**: Timestamps for creation and updates
- **Access Control**: Authentication required for all operations

## Performance Considerations

### Database Optimization
- **Indexes**: Optimized queries with proper indexing
- **JSONB Storage**: Efficient storage and querying of sections
- **Connection Pooling**: Efficient database connection management

### Frontend Optimization
- **State Management**: Efficient React state updates
- **Component Rendering**: Optimized re-renders
- **Bundle Size**: Minimal dependencies and code splitting

### Scalability
- **Database Design**: Scalable schema design
- **API Efficiency**: Minimal database queries
- **Caching Strategy**: Future caching implementation considerations