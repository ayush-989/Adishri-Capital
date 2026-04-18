import { type InputHTMLAttributes, useState } from "react";
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
      {label && <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-0.5">{label}</label>}
      {preview ? (
        <div className="relative rounded-lg border-2 border-slate-200 border-dashed p-2">
          <img src={preview} alt="Preview" className="h-40 w-full object-contain rounded-md" />
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-3 right-3 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-md transition-all active:scale-95"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <label className={cn(
          "flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer bg-gray-50/50 hover:bg-primary-50/50 hover:border-primary-300 transition-all duration-200",
          error ? "border-red-500" : "border-gray-300"
        )}>
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadCloud className="w-8 h-8 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-600 font-semibold tracking-wide">Click to upload</p>
            <p className="text-xs text-gray-400">SVG, PNG, JPG or GIF (MAX. 5MB)</p>
          </div>
          <input type="file" className="hidden" onChange={handleFileChange} accept={accept} {...props} />
        </label>
      )}
      {error && <p className="mt-1.5 ml-0.5 text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}
