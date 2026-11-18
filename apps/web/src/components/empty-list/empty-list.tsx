import Image from 'next/image';

type EmptyListStateProps = {
  title: string;
  subtitle: string;
  imageAlt?: string;
};

export default function EmptyList({ title, subtitle, imageAlt = 'Ilustracao de lista vazia' }: EmptyListStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <div className="w-full max-w-4xl">
        <Image
          src="/illustrations/empty-list-dark.svg"
          alt={imageAlt}
          width={1200}
          height={700}
          priority
          className="mx-auto h-auto w-full max-w-2xl object-contain"
        />
      </div>

      <div className="space-y-1">
        <h3 className="text-xl font-black text-[color:var(--app-text,#0f172a)] md:text-2xl">
          {title}
        </h3>
        <p className="text-sm text-[color:var(--app-text-muted,#64748b)] md:text-base">{subtitle}</p>
      </div>
    </div>
  );
}
