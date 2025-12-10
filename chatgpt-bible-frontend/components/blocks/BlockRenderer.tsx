import type { PageBlockWithData } from '@/types/blocks';
import HeroBlock from './HeroBlock';
import FeaturesBlock from './FeaturesBlock';
import CTABlock from './CTABlock';
import RichTextBlock from './RichTextBlock';
import FormBlock from './FormBlock';
import TestimonialsBlock from './TestimonialsBlock';
import PromptsGridBlock from './PromptsGridBlock';
import PricingBlock from './PricingBlock';
import FAQBlock from './FAQBlock';
import PainPointsBlock from './PainPointsBlock';
import TimelineBlock from './TimelineBlock';
import RegistrationBlock from './RegistrationBlock';
import FooterBlock from './FooterBlock';

interface BlockRendererProps {
  block: PageBlockWithData;
}

/**
 * BlockRenderer - Dynamically renders the appropriate block component
 * based on the block collection type
 */
export default function BlockRenderer({ block }: BlockRendererProps) {
  // Skip hidden blocks
  if (block.hide_block) {
    return null;
  }

  // Render the appropriate component based on collection type
  switch (block.collection) {
    case 'block_hero':
      return <HeroBlock data={block.data as any} />;

    case 'block_features':
      return <FeaturesBlock data={block.data as any} />;

    case 'block_cta':
      return <CTABlock data={block.data as any} />;

    case 'block_richtext':
      return <RichTextBlock data={block.data as any} />;

    case 'block_form':
      return <FormBlock data={block.data as any} />;

    case 'block_testimonials':
      return <TestimonialsBlock data={block.data as any} />;

    case 'block_prompts_grid':
      return <PromptsGridBlock data={block.data as any} />;

    case 'block_pricing':
      return <PricingBlock data={block.data as any} />;

    case 'block_faq':
      return <FAQBlock data={block.data as any} />;

    case 'block_pain_points':
      return <PainPointsBlock data={block.data as any} />;

    case 'block_timeline':
      return <TimelineBlock data={block.data as any} />;

    case 'block_registration':
      return <RegistrationBlock data={block.data as any} />;

    case 'block_footer':
      return <FooterBlock data={block.data as any} />;

    default:
      console.warn(`Unknown block type: ${block.collection}`);
      return null;
  }
}
