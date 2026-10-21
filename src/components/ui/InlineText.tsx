import { Fragment } from 'react';
import type { RichText } from '../../types/content';

/** Renders RichText, turning **bold** segments into <strong>. No other markup is interpreted. */
export function InlineText({ text }: { text: RichText }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold text-fg">
            {part}
          </strong>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}
