import { AlertTriangle } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Button } from '../ui/Button';

type SubmitDialogProps = {
  open: boolean;
  unansweredCount: number;
  onCancel: () => void;
  onConfirm: () => void;
};

/** Confirmation shown when submitting with unanswered questions. Uses the native modal <dialog> for focus trapping and Esc. */
export function SubmitDialog({ open, unansweredCount, onCancel, onConfirm }: SubmitDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
    } else if (!open && dialog.open) {
      if (typeof dialog.close === 'function') dialog.close();
      else dialog.removeAttribute('open');
    }
  }, [open]);

  const plural = unansweredCount === 1 ? 'question is' : 'questions are';

  return (
    <dialog
      ref={ref}
      aria-labelledby="submit-dialog-title"
      aria-describedby="submit-dialog-desc"
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
      className="m-auto w-[min(28rem,calc(100vw-2rem))] rounded-2xl border border-border bg-surface p-0 text-fg shadow-pop"
    >
      <div className="p-6">
        <div className="flex gap-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-warning-soft">
            <AlertTriangle aria-hidden className="size-5 text-warning" />
          </span>
          <div>
            <h2 id="submit-dialog-title" className="text-lg font-semibold tracking-tight">
              Submit with unanswered questions?
            </h2>
            <p id="submit-dialog-desc" className="mt-2 leading-relaxed text-muted">
              {unansweredCount} {plural} still unanswered. Unanswered questions are scored as not correct.
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onConfirm}>
            Submit anyway
          </Button>
          <Button onClick={onCancel} autoFocus>
            Keep answering
          </Button>
        </div>
      </div>
    </dialog>
  );
}
