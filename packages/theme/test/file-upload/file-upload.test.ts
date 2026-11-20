import {
  buildFileUploadDropzoneTheme,
  buildFileUploadFileTheme,
  buildFileUploadTheme,
  FILE_UPLOAD_SIZE_CLASS_MAP,
  FILE_UPLOAD_TONE_CLASS_MAP,
  OTone,
} from '../../src';

describe('FileUpload theme', () => {
  describe('class maps', () => {
    it('should map a border, a hover border and a soft background for every tone', () => {
      OTone.forEach((tone) => {
        const classNames = FILE_UPLOAD_TONE_CLASS_MAP[tone];

        expect(classNames.border).toBeTruthy();
        expect(classNames.hoverBorder.startsWith('hover:')).toBe(true);
        expect(classNames.soft).toBeTruthy();
      });
    });

    it('should map dropzone spacing and typography for every reduced size', () => {
      (['sm', 'md', 'lg'] as const).forEach((size) => {
        const classNames = FILE_UPLOAD_SIZE_CLASS_MAP[size];

        expect(classNames.dropzone).toContain('min-h-');
        expect(classNames.title).toMatch(/^text-/);
        expect(classNames.hint).toMatch(/^text-/);
      });
    });
  });

  describe('buildFileUploadDropzoneTheme', () => {
    it('should default to a neutral dashed border with the primary hover accent', () => {
      const result = buildFileUploadDropzoneTheme();

      expect(result).toContain('border-2 border-dashed');
      expect(result).toContain('border-[color:var(--app-border,#e2e8f0)]');
      expect(result).toContain('hover:border-[color:var(--app-accent-border,#3b82f6)]');
      expect(result).not.toContain('var(--app-accent-soft');
    });

    it('should paint the accent border and the soft background while dragging', () => {
      const result = buildFileUploadDropzoneTheme({ isDragActive: true });

      expect(result).toContain('border-[color:var(--app-accent-border,#3b82f6)]');
      expect(result).toContain('bg-[color:var(--app-accent-soft,#eff6ff)]');
      expect(result).not.toContain('hover:border-');
    });

    it('should use the requested tone for the drag state instead of the primary accent', () => {
      const result = buildFileUploadDropzoneTheme({
        isDragActive: true,
        tone: 'danger',
      });

      expect(result).toContain('border-[color:var(--app-negative,#dc2626)]');
      expect(result).toContain('bg-[color:var(--app-negative-soft,rgba(220,38,38,0.10))]');
      expect(result).not.toContain('border-[color:var(--app-accent');
      expect(result).not.toContain('bg-[color:var(--app-accent');
    });

    it('should win over the drag state when disabled', () => {
      const result = buildFileUploadDropzoneTheme({
        isDragActive: true,
        disabled: true,
      });

      expect(result).toContain('cursor-not-allowed');
      expect(result).toContain('opacity-60');
      expect(result).not.toContain('border-[color:var(--app-accent');
      expect(result).not.toContain('bg-[color:var(--app-accent');
    });

    it('should apply the requested size and append the custom className last', () => {
      const result = buildFileUploadDropzoneTheme({
        size: 'lg',
        className: 'my-dropzone',
      });

      expect(result).toContain(FILE_UPLOAD_SIZE_CLASS_MAP.lg.dropzone);
      expect(result.endsWith('my-dropzone')).toBe(true);
    });

    it('should never emit two border color classes at once', () => {
      const states = [
        {},
        { isDragActive: true },
        { disabled: true },
      ];

      states.forEach((state) => {
        const borderClasses = buildFileUploadDropzoneTheme(state)
          .split(' ')
          .filter((className) => className.startsWith('border-[') || className.startsWith('border-white'));

        expect(borderClasses).toHaveLength(1);
      });
    });
  });

  describe('buildFileUploadTheme', () => {
    it('should expose the dropzone, icon, title and hint classes for the requested size', () => {
      const result = buildFileUploadTheme({ size: 'sm' });

      expect(result.root).toBe('flex flex-col gap-4');
      expect(result.dropzone).toContain(FILE_UPLOAD_SIZE_CLASS_MAP.sm.dropzone);
      expect(result.icon).toContain('text-2xl');
      expect(result.title).toContain('font-medium');
      expect(result.hint).toContain('text-[color:var(--app-text-muted,#64748b)]');
    });

    it('should append the custom className to the root', () => {
      expect(buildFileUploadTheme({ className: 'extra' }).root).toBe('flex flex-col gap-4 extra');
    });
  });

  describe('variant', () => {
    it('should keep using the inherited --app-* variables when variant is omitted', () => {
      const result = buildFileUploadTheme();

      expect(result.title).toContain('text-[color:var(--app-text,#0f172a)]');
      expect(result.hint).toContain('text-[color:var(--app-text-muted,#64748b)]');
      expect(result.dropzone).toContain('border-[color:var(--app-border,#e2e8f0)]');
    });

    it('should emit the literal light palette when variant is light', () => {
      const result = buildFileUploadTheme({ variant: 'light' });

      expect(result.title).toContain('text-slate-900');
      expect(result.hint).toContain('text-slate-500');
      expect(result.dropzone).toContain('border-slate-200');
      expect(result.dropzone).not.toContain('var(--app-border');
      expect(result.dropzone).not.toContain('var(--app-accent-soft');
    });

    it('should emit the literal dark palette when variant is dark', () => {
      const result = buildFileUploadTheme({ variant: 'dark' });

      expect(result.title).toContain('text-[#e6edf7]');
      expect(result.hint).toContain('text-[#93a4bd]');
      expect(result.dropzone).toContain('border-[#1f2f4a]');
      expect(result.dropzone).not.toContain('var(--app-border');
      expect(result.dropzone).not.toContain('var(--app-accent-soft');
    });

    it('should swap the surface and text colors of the file card by variant', () => {
      const light = buildFileUploadFileTheme({ variant: 'light' });
      const dark = buildFileUploadFileTheme({ variant: 'dark' });

      expect(light.root).toContain('bg-white');
      expect(light.name).toContain('text-slate-900');
      expect(dark.root).toContain('bg-[#111c33]');
      expect(dark.name).toContain('text-[#e6edf7]');
      expect(dark.remove).toContain('hover:bg-white/10');
    });

    it('should paint the drag state with the variant accent instead of the --app-* fallback', () => {
      const result = buildFileUploadDropzoneTheme({
        isDragActive: true,
        variant: 'dark',
      });

      expect(result).toContain('border-[#3b82f6]');
      expect(result).toContain('bg-[rgba(59,130,246,0.16)]');
      expect(result).not.toContain('var(--app-accent-soft');
    });

    it('should paint the rejected file with the variant negative tone', () => {
      const result = buildFileUploadFileTheme({ hasError: true, variant: 'dark' });

      expect(result.root).toContain('border-[#f87171]');
      expect(result.root).toContain('bg-[rgba(248,113,113,0.16)]');
      expect(result.error).toContain('text-[#f87171]');
    });

    it('should never emit two border color classes in any variant', () => {
      (['light', 'dark'] as const).forEach((variant) => {
        [{}, { isDragActive: true }, { disabled: true }].forEach((state) => {
          const borderClasses = buildFileUploadDropzoneTheme({ ...state, variant })
            .split(' ')
            .filter((className) => className.startsWith('border-')
              && className !== 'border-2'
              && !className.startsWith('border-dashed'));

          expect(borderClasses).toHaveLength(1);
        });
      });
    });
  });

  describe('buildFileUploadFileTheme', () => {
    it('should keep the neutral border for a valid file', () => {
      const result = buildFileUploadFileTheme();

      expect(result.root).toContain('border-[color:var(--app-border,#e2e8f0)]');
      expect(result.root).not.toContain('var(--app-negative');
    });

    it('should paint the error border and background for a rejected file', () => {
      const result = buildFileUploadFileTheme({ hasError: true });

      expect(result.root).toContain('border-[color:var(--app-negative,#dc2626)]');
      expect(result.root).toContain('bg-[color:var(--app-negative-soft,rgba(220,38,38,0.10))]');
    });

    it('should mark the remove button as not-allowed when disabled', () => {
      const enabled = buildFileUploadFileTheme();
      const disabled = buildFileUploadFileTheme({ disabled: true });

      expect(enabled.remove).toContain('cursor-pointer');
      expect(disabled.remove).toContain('cursor-not-allowed');
      expect(disabled.remove).not.toContain('cursor-pointer');
    });
  });
});