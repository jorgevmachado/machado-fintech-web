import { IconSwitch } from '@fintech/ui';

export default function Page() {
  return (
    <div style={{ padding: 40, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div role="group" aria-label="Visualização" className="flex w-fit items-center">
        <IconSwitch offIcon="cards" onIcon="table" />
      </div>
    </div>
  );
}
