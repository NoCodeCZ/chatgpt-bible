import type { FooterBlock as FooterBlockType } from '@/types/blocks';
import Link from 'next/link';

interface FooterBlockProps {
  data: FooterBlockType;
}

export default function FooterBlock({ data }: FooterBlockProps) {
  const {
    logo_text = 'GPT Bible',
    logo_link = '/',
    copyright_text,
    links = [],
    social_links = [],
    theme = 'dark',
  } = data;

  const themeClasses = {
    light: 'bg-white border-gray-200',
    dark: 'bg-gray-950/95 backdrop-blur-sm border-white/10', // Solid background to prevent animation interference
  }[theme];

  const textColorClasses = {
    light: 'text-gray-900',
    dark: 'text-white',
  }[theme];

  const linkColorClasses = {
    light: 'text-gray-600 hover:text-gray-900',
    dark: 'text-zinc-400 hover:text-white',
  }[theme];

  return (
    <footer className={`py-12 px-4 sm:px-6 lg:px-8 border-t ${themeClasses}`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {logo_text.charAt(0).toUpperCase()}
              </span>
            </div>
            <Link
              href={logo_link}
              className={`font-semibold text-base ${textColorClasses}`}
            >
              {logo_text}
            </Link>
          </div>

          {/* Links */}
          {links.length > 0 && (
            <div className={`flex items-center gap-6 text-sm ${linkColorClasses}`}>
              {links.map((link, index) => {
                if (link.isExternal) {
                  return (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors"
                    >
                      {link.label}
                    </a>
                  );
                }
                return (
                  <Link
                    key={index}
                    href={link.url}
                    className="transition-colors"
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Social Links */}
          {social_links.length > 0 && (
            <div className="flex items-center gap-4">
              {social_links.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-all border ${
                    theme === 'dark' ? 'border-white/10' : 'border-gray-200'
                  }`}
                >
                  {social.icon ? (
                    <span dangerouslySetInnerHTML={{ __html: social.icon }} />
                  ) : (
                    <span className="text-zinc-400">{social.platform}</span>
                  )}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Copyright */}
        {copyright_text && (
          <div className={`mt-8 pt-8 border-t ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} text-center`}>
            <p className={`text-sm ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-500'}`}>
              {copyright_text}
            </p>
          </div>
        )}
      </div>
    </footer>
  );
}

