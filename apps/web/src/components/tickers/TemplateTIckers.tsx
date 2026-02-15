/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

interface TemplateTickerProps {
    tags: string[];
}

export default function TemplateTicker({ tags }: TemplateTickerProps) {
    return (
        <div className="flex gap-1.5 flex-wrap">
            {tags.map((tag) => (
                <span
                    key={tag}
                    className="
                        text-[9px] leading-none
                        px-1.5 py-[2px]
                        rounded-[3px]
                        bg-primary/7
                        border border-primary-light/40
                        text-primary-light
                        whitespace-nowrap
                    "
                >
                    {tag}
                </span>
            ))}
        </div>
    );
}
