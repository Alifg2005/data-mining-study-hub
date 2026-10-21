import type { TreeNode } from '../../types/content';

function Branch({ nodes, depth }: { nodes: TreeNode[]; depth: number }) {
  return (
    <ul className={depth === 0 ? 'space-y-1.5' : 'mt-1.5 space-y-1.5 border-l border-border pl-4'}>
      {nodes.map((node) => (
        <li key={node.label}>
          <span
            className={
              depth === 0
                ? 'inline-block rounded-md bg-accent-soft px-2 py-0.5 text-sm font-semibold text-accent-soft-fg'
                : 'text-sm text-fg'
            }
          >
            {node.label}
          </span>
          {node.children && <Branch nodes={node.children} depth={depth + 1} />}
        </li>
      ))}
    </ul>
  );
}

/** Taxonomy diagram rendered as nested lists so it stays readable and accessible on any screen. */
export function TreeView({ root }: { root: TreeNode }) {
  return (
    <figure className="rounded-xl border border-border bg-surface p-5">
      <figcaption className="mb-4 font-semibold text-fg">{root.label}</figcaption>
      {root.children && (
        <div className="grid gap-6 sm:grid-cols-2">
          {root.children.map((child) => (
            <Branch key={child.label} nodes={[child]} depth={0} />
          ))}
        </div>
      )}
    </figure>
  );
}
