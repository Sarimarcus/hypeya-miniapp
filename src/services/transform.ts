// Data transformation service
// Handles conversion between WordPress API data and application data formats

import {
  WordPressArticle,
  WordPressCategory,
  WordPressTag,
  WordPressTerm,
  WordPressAuthor,
  WordPressMedia,
} from "@/types/wordpress";
import { Article } from "@/types/article";
import { Category } from "@/types/category";
import { Tag } from "@/types/tag";

export class TransformService {
  /**
   * Transform WordPress article to application article format
   */
  static transformArticle(wpArticle: WordPressArticle): Article {
    // Debug: Log the embedded data structure
    console.log("WordPress Article:", {
      id: wpArticle.id,
      title: wpArticle.title.rendered,
      hasEmbedded: !!wpArticle._embedded,
      embeddedKeys: wpArticle._embedded ? Object.keys(wpArticle._embedded) : [],
      author: wpArticle._embedded?.author?.[0],
      featuredMedia: wpArticle._embedded?.["wp:featuredmedia"]?.[0],
      terms: wpArticle._embedded?.["wp:term"],
    });

    return {
      id: wpArticle.id,
      slug: wpArticle.slug,
      // Use canonical permalink from WordPress for outbound links
      link: wpArticle.link,
      title: this.sanitizeHtml(wpArticle.title.rendered),
      content: this.sanitizeContent(wpArticle.content.rendered),
      excerpt: this.sanitizeHtml(wpArticle.excerpt.rendered),
      publishedAt: new Date(wpArticle.date),
      updatedAt: new Date(wpArticle.modified),
      author: this.transformAuthor(
        wpArticle._embedded?.author?.[0],
        wpArticle.author
      ),
      featuredImage: this.transformFeaturedImage(
        wpArticle._embedded?.["wp:featuredmedia"]?.[0]
      ),
      categories: this.extractCategoriesFromEmbedded(
        wpArticle._embedded?.["wp:term"]
      ),
      tags: this.extractTagsFromEmbedded(wpArticle._embedded?.["wp:term"]),
    };
  }

  /**
   * Transform WordPress author to application author format
   */
  static transformAuthor(
    wpAuthor?: WordPressAuthor,
    authorId?: number
  ): Article["author"] {
    if (!wpAuthor) {
      return {
        id: authorId || 0,
        name: "Hypeya Team",
        slug: "hypeya-team",
        description: "",
        avatarUrl: "/images/default-avatar.svg",
      };
    }

    return {
      id: wpAuthor.id,
      name: wpAuthor.name || "Hypeya Team",
      slug: wpAuthor.slug || "hypeya-team",
      description: this.sanitizeHtml(wpAuthor.description || ""),
      avatarUrl:
        wpAuthor.avatar_urls?.["96"] ||
        wpAuthor.avatar_urls?.["48"] ||
        "/images/default-avatar.svg",
    };
  }

  /**
   * Transform WordPress featured image to application image format
   */
  static transformFeaturedImage(
    wpMedia?: WordPressMedia
  ): Article["featuredImage"] {
    if (!wpMedia) {
      return {
        id: 0,
        url: "/images/default-featured.jpg",
        alt: "Default featured image",
        width: 800,
        height: 400,
        sizes: {
          thumbnail: "/images/default-featured.jpg",
          medium: "/images/default-featured.jpg",
          large: "/images/default-featured.jpg",
          full: "/images/default-featured.jpg",
        },
      };
    }

    return {
      id: wpMedia.id,
      url: wpMedia.source_url,
      alt: wpMedia.alt_text || "",
      width: wpMedia.media_details?.width || 800,
      height: wpMedia.media_details?.height || 400,
      sizes: {
        thumbnail:
          wpMedia.media_details?.sizes?.thumbnail?.source_url ||
          wpMedia.source_url,
        medium:
          wpMedia.media_details?.sizes?.medium?.source_url ||
          wpMedia.source_url,
        large:
          wpMedia.media_details?.sizes?.large?.source_url || wpMedia.source_url,
        full: wpMedia.source_url,
      },
    };
  }

  /**
   * Extract categories from embedded wp:term data
   * WordPress API can return terms in different structures
   */
  static extractCategoriesFromEmbedded(
    wpTermArrays?: WordPressTerm[][]
  ): Category[] {
    if (!wpTermArrays || !Array.isArray(wpTermArrays)) {
      return [];
    }

    // Flatten all term arrays and filter for categories
    const allTerms = wpTermArrays.flat();
    return allTerms
      .filter(
        (term): term is WordPressTerm =>
          typeof term === "object" &&
          term !== null &&
          "taxonomy" in term &&
          term.taxonomy === "category"
      )
      .map((term) => this.transformCategoryFromTerm(term));
  }

  /**
   * Extract tags from embedded wp:term data
   * WordPress API can return terms in different structures
   */
  static extractTagsFromEmbedded(wpTermArrays?: WordPressTerm[][]): Tag[] {
    if (!wpTermArrays || !Array.isArray(wpTermArrays)) {
      return [];
    }

    // Flatten all term arrays and filter for tags
    const allTerms = wpTermArrays.flat();
    return allTerms
      .filter(
        (term): term is WordPressTerm =>
          typeof term === "object" &&
          term !== null &&
          "taxonomy" in term &&
          term.taxonomy === "post_tag"
      )
      .map((term) => this.transformTagFromTerm(term));
  }

  /**
   * Transform WordPress categories to application categories
   */
  static transformCategories(wpTerms: unknown[]): Category[] {
    if (!Array.isArray(wpTerms)) {
      return [];
    }

    return wpTerms
      .filter(
        (term): term is WordPressTerm =>
          typeof term === "object" &&
          term !== null &&
          "taxonomy" in term &&
          term.taxonomy === "category"
      )
      .map((term) => this.transformCategoryFromTerm(term));
  }

  /**
   * Transform WordPress tags to application tags
   */
  static transformTags(wpTerms: unknown[]): Tag[] {
    if (!Array.isArray(wpTerms)) {
      return [];
    }

    return wpTerms
      .filter(
        (term): term is WordPressTerm =>
          typeof term === "object" &&
          term !== null &&
          "taxonomy" in term &&
          term.taxonomy === "post_tag"
      )
      .map((term) => this.transformTagFromTerm(term));
  }

  /**
   * Transform single WordPress category
   */
  static transformCategory(wpCategory: WordPressCategory): Category {
    return {
      id: wpCategory.id,
      name: wpCategory.name || "Uncategorized",
      slug: wpCategory.slug || "uncategorized",
      description: this.sanitizeHtml(wpCategory.description || ""),
      count: wpCategory.count || 0,
      color: this.getCategoryColor(wpCategory.slug || wpCategory.name),
    };
  }

  /**
   * Transform single WordPress tag
   */
  static transformTag(wpTag: WordPressTag): Tag {
    return {
      id: wpTag.id,
      name: wpTag.name || "Unknown Tag",
      slug: wpTag.slug || "unknown",
      description: this.sanitizeHtml(wpTag.description || ""),
      count: wpTag.count || 0,
    };
  }

  /**
   * Transform WordPressTerm to Category (from embedded data)
   */
  static transformCategoryFromTerm(wpTerm: WordPressTerm): Category {
    return {
      id: wpTerm.id,
      name: wpTerm.name || "Uncategorized",
      slug: wpTerm.slug || "uncategorized",
      description: "",
      count: 0,
      color: this.getCategoryColor(wpTerm.slug || wpTerm.name),
    };
  }

  /**
   * Transform WordPressTerm to Tag (from embedded data)
   */
  static transformTagFromTerm(wpTerm: WordPressTerm): Tag {
    return {
      id: wpTerm.id,
      name: wpTerm.name || "Unknown Tag",
      slug: wpTerm.slug || "unknown",
      description: "",
      count: 0,
    };
  }

  /**
   * Sanitize HTML content for display
   */
  static sanitizeHtml(html: string): string {
    if (!html) return "";

    // Remove HTML tags but preserve line breaks
    return html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n\n")
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .trim();
  }

  /**
   * Sanitize and process article content
   */
  static sanitizeContent(html: string): string {
    if (!html) return "";

    // For now, we'll return the raw HTML as the components will handle rendering
    // In a production app, you might want to use a proper HTML sanitizer like DOMPurify
    return html
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .trim();
  }

  /**
   * Get a color for a category based on its name/slug
   */
  static getCategoryColor(categoryIdentifier: string): string {
    // Color mapping for common categories
    const colorMap: Record<string, string> = {
      technology: "#3B82F6",
      tech: "#3B82F6",
      programming: "#8B5CF6",
      coding: "#8B5CF6",
      design: "#EC4899",
      ui: "#EC4899",
      ux: "#EC4899",
      business: "#10B981",
      marketing: "#F59E0B",
      tutorial: "#06B6D4",
      news: "#EF4444",
      review: "#84CC16",
      opinion: "#F97316",
      personal: "#6B7280",
      lifestyle: "#F472B6",
      travel: "#14B8A6",
      food: "#F59E0B",
      health: "#10B981",
      fitness: "#059669",
      entertainment: "#8B5CF6",
      gaming: "#7C3AED",
      sports: "#DC2626",
      science: "#0EA5E9",
      education: "#3B82F6",
      howto: "#06B6D4",
      "how-to": "#06B6D4",
    };

    const identifier = categoryIdentifier.toLowerCase();

    // Try exact match first
    if (colorMap[identifier]) {
      return colorMap[identifier];
    }

    // Try partial matches
    for (const [key, color] of Object.entries(colorMap)) {
      if (identifier.includes(key) || key.includes(identifier)) {
        return color;
      }
    }

    // Default color based on hash of the name for consistency
    const hash = this.hashString(identifier);
    const colors = [
      "#3B82F6", // Blue
      "#8B5CF6", // Purple
      "#EC4899", // Pink
      "#10B981", // Emerald
      "#F59E0B", // Amber
      "#06B6D4", // Cyan
      "#EF4444", // Red
      "#84CC16", // Lime
      "#F97316", // Orange
      "#14B8A6", // Teal
    ];

    return colors[hash % colors.length];
  }

  /**
   * Simple string hash function for consistent color assignment
   */
  static hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Calculate estimated reading time
   */
  static calculateReadingTime(content: string): number {
    const wordsPerMinute = 200; // Average reading speed
    const text = this.sanitizeHtml(content);
    const wordCount = text.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  }

  /**
   * Extract first paragraph as summary
   */
  static extractSummary(content: string, maxLength: number = 160): string {
    const text = this.sanitizeHtml(content);
    if (text.length <= maxLength) {
      return text;
    }

    // Try to cut at sentence boundary
    const truncated = text.substring(0, maxLength);
    const lastSentence = truncated.lastIndexOf(".");
    const lastSpace = truncated.lastIndexOf(" ");

    if (lastSentence > maxLength * 0.7) {
      return truncated.substring(0, lastSentence + 1);
    } else if (lastSpace > maxLength * 0.7) {
      return truncated.substring(0, lastSpace) + "...";
    } else {
      return truncated + "...";
    }
  }

  /**
   * Format date for display
   */
  static formatDate(
    date: Date,
    format: "short" | "medium" | "long" = "medium"
  ): string {
    let options: Intl.DateTimeFormatOptions;

    switch (format) {
      case "short":
        options = { month: "short", day: "numeric" };
        break;
      case "long":
        options = {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        };
        break;
      case "medium":
      default:
        options = { month: "short", day: "numeric", year: "numeric" };
        break;
    }

    return new Intl.DateTimeFormat("es-ES", options).format(date);
  }

  /**
   * Format relative time (e.g., "2 hours ago")
   */
  static formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) {
      return "Ahora mismo";
    } else if (diffMinutes < 60) {
      return `${diffMinutes} minuto${diffMinutes !== 1 ? "s" : ""} atrás`;
    } else if (diffHours < 24) {
      return `${diffHours} hora${diffHours !== 1 ? "s" : ""} atrás`;
    } else if (diffDays < 7) {
      return `${diffDays} día${diffDays !== 1 ? "s" : ""} atrás`;
    } else {
      return this.formatDate(date, "medium");
    }
  }

  /**
   * Validate and clean article data
   */
  static validateArticle(article: Article): boolean {
    return !!(
      article.id &&
      article.title &&
      article.slug &&
      article.publishedAt &&
      article.author?.name
    );
  }

  /**
   * Transform multiple WordPress articles
   */
  static transformArticles(wpArticles: WordPressArticle[]): Article[] {
    return wpArticles
      .map((wpArticle) => this.transformArticle(wpArticle))
      .filter((article) => this.validateArticle(article));
  }

  /**
   * Transform multiple WordPress categories
   */
  static transformCategoriesList(
    wpCategories: WordPressCategory[]
  ): Category[] {
    return wpCategories.map((wpCategory) => this.transformCategory(wpCategory));
  }

  /**
   * Transform multiple WordPress tags
   */
  static transformTagsList(wpTags: WordPressTag[]): Tag[] {
    return wpTags.map((wpTag) => this.transformTag(wpTag));
  }
}
