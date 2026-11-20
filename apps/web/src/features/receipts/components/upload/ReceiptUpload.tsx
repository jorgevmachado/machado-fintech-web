'use client';
import { useState } from 'react';

import { FileUpload, Button, Text } from '@fintech/ui';

type ReceiptUploadProps = {
  onSubmit: (files: Array<File>) => Promise<boolean>;
}
export default function ReceiptUpload({ onSubmit }: ReceiptUploadProps) {
  const [files, setFiles] = useState<Array<File>>([]);
  return (
    <section className="min-w-0 rounded-2xl border border-[color:var(--app-border,#e2e8f0)] bg-[color:var(--app-surface,#ffffff)] p-4 shadow-sm sm:p-6">
      <div className="flex flex-col gap-6">
        <Text>Total: {files.length}</Text>
        <FileUpload multiple value={files} onFilesChange={(files) => setFiles(files)} />
        <Button onClick={async () => {
          const result = await onSubmit(files)
          if(result) {
            setFiles([]);
          }
        }} disabled={files.length === 0}>form.action.send</Button>
      </div>
    </section>
  )
}