import { useRef, useState } from 'react';
import { ImagePlus } from 'lucide-react';
import { cva } from 'class-variance-authority';
import { BanksAdminService } from '../services/banks-admin.service';
import { Spinner } from '@/components/ui/spinner';

const imageUploadVariants = cva(
  'w-24 h-24 rounded-full mx-auto flex items-center justify-center transition-all cursor-pointer overflow-hidden',
  {
    variants: {
      hasImage: {
        true: 'bg-primary-foreground border border-primary',
        false: 'border border-dashed bg-muted border-muted-foreground',
      },
      error: {
        true: 'bg-red-100 border-red-500 text-red-600',
      },
    },
  }
);

export function ImageUpload({
  value,
  onChange,
  hasError,
}: {
  value: string;
  onChange: (url: string) => void;
  hasError?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>(value);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const publicUrl = await BanksAdminService.uploadLogo(file);
      onChange(publicUrl);
    } catch {
      setPreview(value);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={imageUploadVariants({
          hasImage: Boolean(preview),
          error: hasError,
        })}
      >
        {uploading ? (
          <Spinner className="size-6" />
        ) : preview ? (
          <img src={preview} alt="Logo" className="w-full h-full object-cover" />
        ) : (
          <ImagePlus className="opacity-50" size={30} />
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
