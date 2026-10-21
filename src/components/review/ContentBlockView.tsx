import { AlertTriangle, Check, Info, Lightbulb, Library, X } from 'lucide-react';
import type { ContentBlock } from '../../types/content';
import { cn } from '../../lib/cn';
import { InlineText } from '../ui/InlineText';
import { TreeView } from './TreeView';

const calloutStyles = {
  note: { icon: Info, box: 'border-accent/30 bg-accent-soft', icon_: 'text-accent', label: 'Note' },
  tip: { icon: Lightbulb, box: 'border-info/25 bg-info-soft', icon_: 'text-info', label: 'Tip' },
  caution: { icon: AlertTriangle, box: 'border-warning/30 bg-warning-soft', icon_: 'text-warning', label: 'Caution' },
  supplemental: {
    icon: Library,
    box: 'border-dashed border-border-strong bg-surface-sunken',
    icon_: 'text-subtle',
    label: 'Supplemental',
  },
} as const;

/** Renders ✓ / ✗ table cells as icons with screen-reader text. */
function TableCell({ value }: { value: string }) {
  if (value === '✓')
    return (
      <>
        <Check aria-hidden className="size-4 text-success" />
        <span className="sr-only">Yes</span>
      </>
    );
  if (value === '✗')
    return (
      <>
        <X aria-hidden className="size-4 text-subtle" />
        <span className="sr-only">No</span>
      </>
    );
  return <>{value}</>;
}

export function ContentBlockView({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'paragraph':
      return (
        <p className="leading-relaxed text-pretty text-muted">
          <InlineText text={block.text} />
        </p>
      );

    case 'list': {
      const ListTag = block.ordered ? 'ol' : 'ul';
      return (
        <div>
          {block.title && <h4 className="mb-2 font-semibold text-fg">{block.title}</h4>}
          <ListTag
            className={cn(
              'space-y-2 pl-5 leading-relaxed text-muted marker:text-subtle',
              block.ordered ? 'list-decimal' : 'list-disc',
            )}
          >
            {block.items.map((item, i) => (
              <li key={i} className="pl-1 text-pretty">
                <InlineText text={item} />
              </li>
            ))}
          </ListTag>
        </div>
      );
    }

    case 'definitions':
      return (
        <dl className="divide-y divide-border overflow-hidden rounded-xl border border-border">
          {block.items.map((item) => (
            <div key={item.term} className="grid gap-1 bg-surface px-4 py-3 sm:grid-cols-[12rem_1fr] sm:gap-4">
              <dt className="font-semibold text-fg">{item.term}</dt>
              <dd className="leading-relaxed text-pretty text-muted">
                <InlineText text={item.definition} />
              </dd>
            </div>
          ))}
        </dl>
      );

    case 'table': {
      const headerCol = block.rowHeaderColumn ?? 0;
      return (
        <figure>
          <div className="overflow-x-auto rounded-xl border border-border" tabIndex={0} role="region" aria-label={block.caption ?? 'Table'}>
            <table
              className={cn('w-full border-collapse text-left text-sm', block.columns.length > 3 && 'min-w-[36rem]')}
            >
              {block.caption && <caption className="sr-only">{block.caption}</caption>}
              <thead className="bg-surface-sunken">
                <tr>
                  {block.columns.map((col) => (
                    <th key={col} scope="col" className="px-4 py-3 font-semibold text-fg">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-surface">
                {block.rows.map((row, r) => (
                  <tr key={r}>
                    {row.map((cell, c) =>
                      c === headerCol ? (
                        <th key={c} scope="row" className="px-4 py-3 align-top font-medium text-fg">
                          <TableCell value={cell} />
                        </th>
                      ) : (
                        <td key={c} className="px-4 py-3 align-top leading-relaxed text-muted">
                          <TableCell value={cell} />
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.caption && (
            <figcaption aria-hidden className="mt-2 text-sm text-subtle">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    }

    case 'comparison':
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          {block.items.map((item) => (
            <div key={item.title} className="rounded-xl border border-border bg-surface p-5">
              <div className="flex items-center justify-between gap-3">
                <h4 className="font-semibold text-fg">{item.title}</h4>
                {item.tag && (
                  <span className="rounded-md bg-accent-soft px-2 py-0.5 font-mono text-xs text-accent-soft-fg">
                    {item.tag}
                  </span>
                )}
              </div>
              {item.description && (
                <p className="mt-2 text-sm leading-relaxed text-pretty text-muted">
                  <InlineText text={item.description} />
                </p>
              )}
              <ul className="mt-3 space-y-1.5 text-sm">
                {item.points.map((point) => (
                  <li key={point} className="flex gap-2 text-fg">
                    <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                    <span>
                      <InlineText text={point} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );

    case 'process':
      return (
        <div>
          {block.title && <h4 className="mb-3 font-semibold text-fg">{block.title}</h4>}
          <ol className="relative space-y-4">
            {block.steps.map((step, i) => (
              <li key={step.title} className="relative flex gap-4">
                {i < block.steps.length - 1 && (
                  <span aria-hidden className="absolute top-8 bottom-[-1rem] left-[0.9375rem] w-px bg-border" />
                )}
                <span
                  aria-hidden
                  className="relative grid size-8 shrink-0 place-items-center rounded-full border border-accent/40 bg-accent-soft font-mono text-sm font-medium text-accent-soft-fg"
                >
                  {i + 1}
                </span>
                <div className="pt-1">
                  <p className="font-medium text-fg">{step.title}</p>
                  {step.description && (
                    <p className="mt-1 text-sm leading-relaxed text-pretty text-muted">
                      <InlineText text={step.description} />
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      );

    case 'example':
      return (
        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="font-mono text-xs text-subtle">Example</p>
          <h4 className="mt-1 font-semibold text-fg">{block.title}</h4>
          {block.text && (
            <p className="mt-2 leading-relaxed text-pretty text-muted">
              <InlineText text={block.text} />
            </p>
          )}
          {block.items && (
            <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-muted marker:text-subtle">
              {block.items.map((item, i) => (
                <li key={i} className="pl-1 text-pretty">
                  <InlineText text={item} />
                </li>
              ))}
            </ul>
          )}
        </div>
      );

    case 'callout': {
      const style = calloutStyles[block.tone];
      const Icon = style.icon;
      return (
        <aside className={cn('flex gap-3 rounded-xl border p-4', style.box)} aria-label={block.title ?? style.label}>
          <Icon aria-hidden className={cn('mt-0.5 size-[18px] shrink-0', style.icon_)} />
          <div className="text-sm leading-relaxed text-pretty">
            {block.title && <p className="mb-1 font-semibold text-fg">{block.title}</p>}
            <p className="text-muted">
              <InlineText text={block.text} />
            </p>
          </div>
        </aside>
      );
    }

    case 'tree':
      return <TreeView root={block.root} />;
  }
}
