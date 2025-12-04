/**
 * TypeScript types for Directus Page Builder blocks
 * These types mirror the Directus schema
 */

// Base block metadata
export interface BaseBlockMeta {
  id: string;
  date_created?: string;
  date_updated?: string;
  user_created?: string;
  user_updated?: string;
  admin_note?: string;
}

// Hero Block
export interface HeroBlock extends BaseBlockMeta {
  heading: string;
  heading2?: string; // Second part of h1 (e.g., "AI" in purple)
  heading_line2?: string; // Second heading line as h2 (e.g., "ด้วย Prompts คุณภาพสูง")
  subheading?: string;
  cta_text?: string;
  cta_link?: string;
  cta_text2?: string; // Second CTA button
  cta_link2?: string;
  background_image?: string;
  text_align?: 'left' | 'center' | 'right';
  theme?: 'light' | 'dark';
  stats?: Array<{
    icon?: string;
    label: string;
    value?: string;
  }>;
}

// CTA Block
export interface CTABlock extends BaseBlockMeta {
  heading: string;
  description?: string;
  button_text: string;
  button_link: string;
  button_text2?: string;
  button_link2?: string;
  button_style?: 'primary' | 'secondary' | 'outline';
  background_color?: string;
  background_gradient?: string;
}

// Features Block
export interface Feature {
  title: string;
  description: string;
  icon?: string;
}

export interface FeaturesBlock extends BaseBlockMeta {
  heading?: string;
  description?: string;
  features: Feature[];
  theme?: 'light' | 'dark';
  columns?: 1 | 2 | 3 | 4;
}

// Rich Text Block
export interface RichTextBlock extends BaseBlockMeta {
  content: string;
}

// Form Block
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'textarea' | 'select' | 'checkbox';
  required?: boolean;
  placeholder?: string;
  options?: string[];
}

export interface FormBlock extends BaseBlockMeta {
  heading: string;
  description?: string;
  form_fields: FormField[];
  submit_text: string;
  success_message: string;
  webhook_url?: string;
}

// Testimonials Block
export interface Testimonial {
  name: string;
  role?: string;
  company?: string;
  content: string;
  avatar?: string;
  rating?: number;
}

export interface TestimonialsBlock extends BaseBlockMeta {
  heading?: string;
  testimonials: Testimonial[];
}

// Prompts Grid Block
export interface PromptCard {
  title: string;
  description?: string;
  icon?: string;
  icon_color?: string;
  tags?: string[];
  badge?: 'free' | 'premium';
  views?: number;
  link?: string;
}

export interface PromptsGridBlock extends BaseBlockMeta {
  heading?: string;
  description?: string;
  prompts: PromptCard[];
  columns?: 1 | 2 | 3 | 4;
  show_view_all?: boolean;
  view_all_text?: string;
  view_all_link?: string;
}

// Pricing Block
export interface PricingPlan {
  name: string;
  price: string;
  price_period?: string;
  description?: string;
  badge?: string;
  featured?: boolean;
  features: Array<{
    text: string;
    included: boolean;
  }>;
  bonuses?: Array<{
    text: string;
    included: boolean;
  }>;
  button_text: string;
  button_link: string;
}

export interface PricingBlock extends BaseBlockMeta {
  heading?: string;
  description?: string;
  plans: PricingPlan[];
  theme?: 'light' | 'dark';
}

// FAQ Block
export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQBlock extends BaseBlockMeta {
  heading?: string;
  description?: string;
  faqs: FAQItem[];
  theme?: 'light' | 'dark';
}

// Footer Block
export interface FooterLink {
  label: string;
  url: string;
  isExternal?: boolean;
}

export interface FooterBlock extends BaseBlockMeta {
  logo_text?: string;
  logo_link?: string;
  copyright_text?: string;
  links?: FooterLink[];
  social_links?: Array<{
    platform: string;
    url: string;
    icon?: string;
  }>;
  theme?: 'light' | 'dark';
}

// Union type for all blocks
export type Block =
  | HeroBlock
  | CTABlock
  | FeaturesBlock
  | RichTextBlock
  | FormBlock
  | TestimonialsBlock
  | PromptsGridBlock
  | PricingBlock
  | FAQBlock
  | FooterBlock;

// Page Block Link (junction table)
export interface PageBlock {
  id: number;
  pages_id: number;
  collection: 'block_hero' | 'block_cta' | 'block_features' | 'block_richtext' | 'block_form' | 'block_testimonials' | 'block_prompts_grid' | 'block_pricing' | 'block_faq' | 'block_footer';
  item: string; // UUID of the block
  sort: number;
  hide_block: boolean;
}

// Page Block with loaded data
export interface PageBlockWithData extends PageBlock {
  data: Block;
}

// Page type
export interface Page {
  id: number;
  status: 'published' | 'draft' | 'archived';
  sort?: number;
  user_created?: string;
  date_created?: string;
  user_updated?: string;
  date_updated?: string;
  title: string;
  permalink: string;
  seo_title?: string;
  seo_description?: string;
  seo_image?: string;
  page_type: 'landing' | 'content' | 'pricing' | 'contact' | 'about' | 'blog' | 'marketing';
  priority?: 'high' | 'medium' | 'low';
  tags?: string[];
  published_date?: string;
}

// Page with blocks
export interface PageWithBlocks extends Page {
  blocks: PageBlockWithData[];
}
