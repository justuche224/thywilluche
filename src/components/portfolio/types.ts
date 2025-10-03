export type ProjectCategory =
  | "books"
  | "poetry"
  | "coaching-programs"
  | "films"
  | "partnerships"
  | "events";

export interface Review {
  id: string;
  author: string;
  content: string;
  rating: number;
  date: string;
  approved: boolean;
}

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  description: string;
  longDescription?: string;
  mediaType: "image" | "video" | "pdf";
  mediaUrl: string;
  thumbnailUrl?: string;
  downloadableExcerpt?: string;
  externalLink?: string;
  date: string;
  featured?: boolean;
  reviews: Review[];
}

export interface CategoryInfo {
  id: ProjectCategory;
  name: string;
  description: string;
}
