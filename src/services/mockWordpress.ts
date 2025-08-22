// Mock WordPress API service for development
// Provides realistic demo data when the real API is unavailable

import { Article } from "@/types/article";
import { Category } from "@/types/category";
import { Tag } from "@/types/tag";
import { ApiResponse } from "@/types/api";

// Mock data
const mockAuthors = [
  {
    id: 1,
    name: "Sarah Chen",
    slug: "sarah-chen",
    description: "Tech journalist and AI enthusiast",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108755-2616b612b3f7?w=96&h=96&fit=crop&crop=face",
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    slug: "marcus-rodriguez",
    description: "Senior developer and startup advisor",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face",
  },
  {
    id: 3,
    name: "Emily Watson",
    slug: "emily-watson",
    description: "Product manager and tech strategist",
    avatarUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop&crop=face",
  },
];

const mockCategories: Category[] = [
  {
    id: 1,
    name: "Artificial Intelligence",
    slug: "ai",
    description: "Latest developments in AI and machine learning",
    count: 15,
    color: "#3B82F6",
  },
  {
    id: 2,
    name: "Web Development",
    slug: "web-dev",
    description: "Frontend and backend development trends",
    count: 23,
    color: "#10B981",
  },
  {
    id: 3,
    name: "Mobile",
    slug: "mobile",
    description: "Mobile app development and design",
    count: 12,
    color: "#F59E0B",
  },
  {
    id: 4,
    name: "Blockchain",
    slug: "blockchain",
    description: "Cryptocurrency and blockchain technology",
    count: 8,
    color: "#8B5CF6",
  },
  {
    id: 5,
    name: "Startups",
    slug: "startups",
    description: "Entrepreneurship and startup stories",
    count: 18,
    color: "#EF4444",
  },
];

const mockTags: Tag[] = [
  { id: 1, name: "React", slug: "react", description: "", count: 25 },
  { id: 2, name: "TypeScript", slug: "typescript", description: "", count: 20 },
  { id: 3, name: "Next.js", slug: "nextjs", description: "", count: 15 },
  { id: 4, name: "Machine Learning", slug: "ml", description: "", count: 12 },
  { id: 5, name: "ChatGPT", slug: "chatgpt", description: "", count: 18 },
  {
    id: 6,
    name: "Performance",
    slug: "performance",
    description: "",
    count: 10,
  },
  { id: 7, name: "UX Design", slug: "ux", description: "", count: 14 },
];

const mockImages = [
  "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
];

const mockArticles: Article[] = [
  {
    id: 1,
    slug: "future-of-ai-development",
    title: "The Future of AI Development: What Every Developer Should Know",
    content: `<p>Artificial Intelligence is rapidly transforming the software development landscape. As we move into 2025, developers need to understand how AI tools and frameworks are reshaping the industry.</p>

<p>From code generation to automated testing, AI is becoming an integral part of the development workflow. This article explores the key trends and technologies that every developer should be aware of.</p>

<h2>Key AI Tools for Developers</h2>
<p>Modern AI tools are revolutionizing how we write, test, and deploy code. Here are some essential tools...</p>`,
    excerpt:
      "Artificial Intelligence is rapidly transforming the software development landscape. Discover the key trends and technologies every developer should know in 2025.",
    publishedAt: new Date("2025-01-15T10:00:00Z"),
    updatedAt: new Date("2025-01-15T10:00:00Z"),
    author: mockAuthors[0],
    categories: [mockCategories[0]],
    tags: [mockTags[3], mockTags[4]],
    featuredImage: {
      id: 1,
      url: mockImages[0],
      alt: "AI Development Concept",
      width: 800,
      height: 400,
      sizes: {
        thumbnail: mockImages[0] + "&w=150&h=150",
        medium: mockImages[0] + "&w=300&h=200",
        large: mockImages[0] + "&w=600&h=400",
        full: mockImages[0],
      },
    },
  },
  {
    id: 2,
    slug: "react-performance-optimization",
    title: "React Performance Optimization: Advanced Techniques for 2025",
    content: `<p>Performance optimization in React applications has evolved significantly. This comprehensive guide covers the latest techniques and best practices for building lightning-fast React apps.</p>

<p>We'll explore everything from component optimization to bundle splitting, ensuring your React applications deliver exceptional user experiences.</p>`,
    excerpt:
      "Learn advanced React performance optimization techniques for 2025. From component optimization to bundle splitting - make your React apps lightning fast.",
    publishedAt: new Date("2025-01-12T14:30:00Z"),
    updatedAt: new Date("2025-01-12T14:30:00Z"),
    author: mockAuthors[1],
    categories: [mockCategories[1]],
    tags: [mockTags[0], mockTags[5]],
    featuredImage: {
      id: 2,
      url: mockImages[1],
      alt: "React Performance Dashboard",
      width: 800,
      height: 400,
      sizes: {
        thumbnail: mockImages[1] + "&w=150&h=150",
        medium: mockImages[1] + "&w=300&h=200",
        large: mockImages[1] + "&w=600&h=400",
        full: mockImages[1],
      },
    },
  },
  {
    id: 3,
    slug: "mobile-app-trends-2025",
    title: "Mobile App Development Trends That Will Dominate 2025",
    content: `<p>The mobile app development landscape is constantly evolving. As we look ahead to 2025, several key trends are emerging that will shape how we build mobile applications.</p>

<p>From cross-platform frameworks to AI-powered features, this article covers the essential trends every mobile developer should be following.</p>`,
    excerpt:
      "Discover the mobile app development trends that will dominate 2025. Stay ahead with insights on cross-platform frameworks and AI-powered features.",
    publishedAt: new Date("2025-01-10T09:15:00Z"),
    updatedAt: new Date("2025-01-10T09:15:00Z"),
    author: mockAuthors[2],
    categories: [mockCategories[2]],
    tags: [mockTags[6]],
    featuredImage: {
      id: 3,
      url: mockImages[2],
      alt: "Mobile Development Workspace",
      width: 800,
      height: 400,
      sizes: {
        thumbnail: mockImages[2] + "&w=150&h=150",
        medium: mockImages[2] + "&w=300&h=200",
        large: mockImages[2] + "&w=600&h=400",
        full: mockImages[2],
      },
    },
  },
  {
    id: 4,
    slug: "nextjs-15-features",
    title: "Next.js 15: Revolutionary Features Every Developer Must Try",
    content: `<p>Next.js 15 brings groundbreaking features that revolutionize how we build React applications. From improved performance to new developer experience enhancements, this release is a game-changer.</p>

<p>Let's dive deep into the most important features and how they can improve your development workflow and application performance.</p>`,
    excerpt:
      "Explore the revolutionary features of Next.js 15 that are changing how developers build React applications. Performance improvements and DX enhancements.",
    publishedAt: new Date("2025-01-08T16:45:00Z"),
    updatedAt: new Date("2025-01-08T16:45:00Z"),
    author: mockAuthors[0],
    categories: [mockCategories[1]],
    tags: [mockTags[0], mockTags[2], mockTags[1]],
    featuredImage: {
      id: 4,
      url: mockImages[3],
      alt: "Next.js Development Setup",
      width: 800,
      height: 400,
      sizes: {
        thumbnail: mockImages[3] + "&w=150&h=150",
        medium: mockImages[3] + "&w=300&h=200",
        large: mockImages[3] + "&w=600&h=400",
        full: mockImages[3],
      },
    },
  },
  {
    id: 5,
    slug: "blockchain-development-guide",
    title: "Complete Guide to Blockchain Development in 2025",
    content: `<p>Blockchain technology continues to evolve rapidly. This comprehensive guide covers everything you need to know about blockchain development in 2025.</p>

<p>From smart contracts to DeFi applications, we'll explore the tools, frameworks, and best practices for building on blockchain platforms.</p>`,
    excerpt:
      "Master blockchain development in 2025 with this complete guide. Learn about smart contracts, DeFi, and the latest development tools.",
    publishedAt: new Date("2025-01-05T11:20:00Z"),
    updatedAt: new Date("2025-01-05T11:20:00Z"),
    author: mockAuthors[1],
    categories: [mockCategories[3]],
    tags: [],
    featuredImage: {
      id: 5,
      url: mockImages[4],
      alt: "Blockchain Network Visualization",
      width: 800,
      height: 400,
      sizes: {
        thumbnail: mockImages[4] + "&w=150&h=150",
        medium: mockImages[4] + "&w=300&h=200",
        large: mockImages[4] + "&w=600&h=400",
        full: mockImages[4],
      },
    },
  },
  {
    id: 6,
    slug: "startup-tech-stack-2025",
    title: "The Ultimate Tech Stack for Startups in 2025",
    content: `<p>Choosing the right technology stack is crucial for startup success. This guide analyzes the best tech stacks for different types of startups in 2025.</p>

<p>We'll cover everything from frontend frameworks to deployment strategies, helping you make informed decisions for your startup's technical foundation.</p>`,
    excerpt:
      "Choose the perfect tech stack for your startup in 2025. Comprehensive analysis of frameworks, tools, and deployment strategies for success.",
    publishedAt: new Date("2025-01-02T13:00:00Z"),
    updatedAt: new Date("2025-01-02T13:00:00Z"),
    author: mockAuthors[2],
    categories: [mockCategories[4]],
    tags: [mockTags[0], mockTags[1]],
    featuredImage: {
      id: 6,
      url: mockImages[5],
      alt: "Startup Development Team",
      width: 800,
      height: 400,
      sizes: {
        thumbnail: mockImages[5] + "&w=150&h=150",
        medium: mockImages[5] + "&w=300&h=200",
        large: mockImages[5] + "&w=600&h=400",
        full: mockImages[5],
      },
    },
  },
];

export class MockWordPressApiService {
  private simulateDelay(min: number = 300, max: number = 800): Promise<void> {
    const delay = Math.random() * (max - min) + min;
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  async getLatestArticles(
    page = 1,
    perPage = 12
  ): Promise<ApiResponse<Article[]>> {
    await this.simulateDelay();

    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedArticles = mockArticles.slice(startIndex, endIndex);

    return {
      data: paginatedArticles,
      success: true,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(mockArticles.length / perPage),
        totalItems: mockArticles.length,
        itemsPerPage: perPage,
        hasNext: endIndex < mockArticles.length,
        hasPrevious: page > 1,
      },
    };
  }

  async getArticlesByCategory(
    categoryId: number,
    page = 1,
    perPage = 12
  ): Promise<ApiResponse<Article[]>> {
    await this.simulateDelay();

    const filteredArticles = mockArticles.filter((article) =>
      article.categories.some((cat) => cat.id === categoryId)
    );

    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

    return {
      data: paginatedArticles,
      success: true,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(filteredArticles.length / perPage),
        totalItems: filteredArticles.length,
        itemsPerPage: perPage,
        hasNext: endIndex < filteredArticles.length,
        hasPrevious: page > 1,
      },
    };
  }

  async getArticleBySlug(slug: string): Promise<ApiResponse<Article | null>> {
    await this.simulateDelay();

    const article = mockArticles.find((a) => a.slug === slug);

    return {
      data: article || null,
      success: true,
    };
  }

  async getCategories(): Promise<ApiResponse<Category[]>> {
    await this.simulateDelay();

    return {
      data: mockCategories,
      success: true,
    };
  }

  async getTags(): Promise<ApiResponse<Tag[]>> {
    await this.simulateDelay();

    return {
      data: mockTags,
      success: true,
    };
  }

  async searchArticles(
    query: string,
    page = 1,
    perPage = 12
  ): Promise<ApiResponse<Article[]>> {
    await this.simulateDelay();

    const searchLower = query.toLowerCase();
    const filteredArticles = mockArticles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchLower) ||
        article.excerpt.toLowerCase().includes(searchLower) ||
        article.content.toLowerCase().includes(searchLower) ||
        article.tags.some((tag) =>
          tag.name.toLowerCase().includes(searchLower)
        ) ||
        article.categories.some((cat) =>
          cat.name.toLowerCase().includes(searchLower)
        )
    );

    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

    return {
      data: paginatedArticles,
      success: true,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(filteredArticles.length / perPage),
        totalItems: filteredArticles.length,
        itemsPerPage: perPage,
        hasNext: endIndex < filteredArticles.length,
        hasPrevious: page > 1,
      },
    };
  }
}

// Export singleton instance
export const mockWordpressApi = new MockWordPressApiService();
