import type { RichTextBlock as RichTextBlockType } from '@/types/blocks';

interface RichTextBlockProps {
  data: RichTextBlockType;
}

export default function RichTextBlock({ data }: RichTextBlockProps) {
  const { content } = data;

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <div
          className="prose prose-lg prose-gray max-w-none
            prose-headings:font-bold prose-headings:text-gray-900
            prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-8
            prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-6
            prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-4
            prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-gray-900 prose-strong:font-semibold
            prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4
            prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4
            prose-li:text-gray-600 prose-li:mb-2"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </section>
  );
}
