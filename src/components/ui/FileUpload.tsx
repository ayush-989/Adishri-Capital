import { InputHTMLAttributes, useState } from "react";
import { UploadCloud, X } from "lucide-react";
import { cn } from "./Button";

interface FileUploadProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  error?: string;
  onChange?: (file: File | null) => void;
  accept?: string;
}

export function FileUpload({ label, error, onChange, accept = "image/*", className, ...props }: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File must be smaller than 5MB");
        return;
      }
      setPreview(URL.createObjectURL(file));
      onChange?.(file);
    } else {
      setPreview(null);
      onChange?.(null);
    }
  };

  const handleClear = () => {
    setPreview(null);
    onChange?.(null);
  };

  return (
    <div className={cn("w-full", className)}>
      {label && <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}
      {preview ? (
        <div className="relative rounded-lg border-2 border-slate-200 border-dashed p-2">
          <img src={preview} alt="Preview" className="h-40 w-full object-contain rounded-md" />
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 shadow"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <label className={cn(
          "flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors",
          error ? "border-red-500" : "border-slate-300"
        )}>
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadCloud className="w-8 h-8 mb-3 text-slate-400" />
            <p className="mb-2 text-sm text-slate-500 font-semibold">Click to upload</p>
            <p className="text-xs text-slate-400">SVG, PNG, JPG or GIF (MAX. 5MB)</p>
          </div>
          <input 
            type="file" 
            className="hidden" 
            onChange={handleFileChange} 
            accept={accept} 
            {...props} 
          />
        </label>
      )}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
