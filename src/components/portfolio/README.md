# Portfolio / Projects System

## Overview

The portfolio system is designed to showcase projects across multiple categories with full review functionality. Currently using mock data, but structured for easy database integration.

## Structure

### Data Model (`types.ts`)

```typescript
- ProjectCategory: "books" | "poetry" | "coaching-programs" | "films" | "partnerships" | "events"
- Project: Main project entity with all details
- Review: User reviews with approval system
- CategoryInfo: Category metadata
```

### Current Files

- `data.ts` - Mock data (replace with API calls)
- `index.tsx` - Main portfolio page with category filtering
- `project-card.tsx` - Reusable project card component
- `project-detail.tsx` - Individual project page
- `review-form.tsx` - Review submission form
- `review-list.tsx` - Display approved reviews

## Converting to Database

### 1. Database Schema

```sql
-- Projects Table
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT,
  long_description TEXT,
  media_type VARCHAR(20),
  media_url TEXT,
  thumbnail_url TEXT,
  downloadable_excerpt TEXT,
  external_link TEXT,
  date DATE,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Reviews Table
CREATE TABLE reviews (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  author VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  approved BOOLEAN DEFAULT false,
  date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Categories Table (optional)
CREATE TABLE categories (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT
);
```

### 2. API Routes to Create

Replace `data.ts` imports with these API calls:

```typescript
// GET /api/projects
// GET /api/projects/:id
// GET /api/projects/category/:category
// POST /api/reviews
// GET /api/reviews/:projectId
// PATCH /api/reviews/:id/approve (admin only)
```

### 3. Example API Integration

In `data.ts`, replace exports with API functions:

```typescript
// Before (current mock data)
export const projects: Project[] = [...]

// After (API integration)
export async function getProjects(): Promise<Project[]> {
  const response = await fetch('/api/projects');
  return response.json();
}

export async function getProject(id: string): Promise<Project | null> {
  const response = await fetch(`/api/projects/${id}`);
  if (!response.ok) return null;
  return response.json();
}

export async function submitReview(review: Omit<Review, 'id' | 'date' | 'approved'>) {
  const response = await fetch('/api/reviews', {
    method: 'POST',
    body: JSON.stringify(review),
  });
  return response.json();
}
```

### 4. Update Components

Convert components to use async data:

```typescript
// Before
import { projects } from "./data";

// After
import { getProjects } from "./data";

async function PortfolioPage() {
  const projects = await getProjects();
  // ... rest of component
}
```

### 5. Review Approval Admin Panel

Create an admin route for review management:

```typescript
// /admin/reviews
- List all pending reviews
- Approve/reject with one click
- Edit or delete reviews
- Filter by project
```

## Features

✅ **Category Filtering** - Tab-based navigation
✅ **Featured Projects** - Highlight important work
✅ **Review System** - User submissions with approval workflow
✅ **Media Support** - Images, videos, PDFs
✅ **Downloadable Excerpts** - For books and documents
✅ **External Links** - Direct to shop or other pages
✅ **Related Projects** - Show similar work
✅ **Ratings Display** - Average star ratings
✅ **Responsive Design** - Mobile-friendly layout

## Adding New Projects

### Manually (Current)

Edit `data.ts`:

```typescript
const newProject: Project = {
  id: "unique-id",
  title: "Project Title",
  category: "books", // or other category
  description: "Short description",
  longDescription: "Detailed description",
  mediaType: "image", // or "video", "pdf"
  mediaUrl: "/images/project-image.jpg",
  date: "2024-01-01",
  featured: false,
  reviews: [],
};

export const projects = [...existingProjects, newProject];
```

### Via CMS (Future)

1. Create API endpoint: `POST /api/projects`
2. Build admin form with file upload
3. Store media in cloud storage (AWS S3, Cloudinary)
4. Save project data to database

## Admin Features to Implement

1. **Project Management**

   - CRUD operations for projects
   - Image/video upload
   - Category management
   - Featured flag toggle

2. **Review Moderation**

   - Approve/reject reviews
   - Edit review content
   - Delete spam reviews
   - Email notifications

3. **Analytics**
   - View counts per project
   - Popular categories
   - Review statistics
   - Download tracking

## File Upload Strategy

When implementing media uploads:

```typescript
// Use cloud storage
import { uploadToCloudinary } from "@/lib/cloudinary";

const handleUpload = async (file: File) => {
  const result = await uploadToCloudinary(file);
  return result.secure_url; // Save this to database
};
```

## SEO Optimization

Each project page includes:

- Dynamic meta tags
- Open Graph images
- Structured data (JSON-LD)
- Semantic HTML

## Current Mock Data

The system includes 6 sample projects:

1. Days I Do Not Die (Book)
2. Reflections on Healing (Poetry)
3. Mental Wellness Foundations (Coaching Program)
4. Stories of Resilience (Film)
5. Community Mental Health Initiative (Partnership)
6. Hope & Healing Workshop Series (Event)

## Notes

- All reviews default to `approved: false`
- Review form shows success message
- Admin approval required before display
- Ratings are 1-5 stars
- Average rating calculated on-the-fly
- Related projects based on category
