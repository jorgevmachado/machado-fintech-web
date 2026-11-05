'use client';
import { Button } from '@fintech/ui';

type DeleteProps = {
  identifier: string;
  onClose: () => void;
  onSubmit: (identifier: string) => void;
};
export default function Delete({
  onClose,
  onSubmit,
  identifier,
}: DeleteProps) {


  return (
    <div className="flex gap-2 mt-1 justify-end">
      <Button onClick={onClose}>
        Cancel
      </Button>
      <Button onClick={() => onSubmit(identifier)} tone="danger">
        Delete
      </Button>
    </div>
  );
}