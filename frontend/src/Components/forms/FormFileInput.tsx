import { useRef } from 'react'
import { Upload } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface FormFileInputProps {
  label: string
  name: string
  accept?: string
  multiple?: boolean
  error?: string
  required?: boolean
  className?: string
  onFilesSelected?: (files: FileList) => void
}

const FormFileInput = ({
  label,
  name,
  accept = 'image/*',
  multiple = false,
  error,
  required = false,
  className,
  onFilesSelected,
}: FormFileInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className={cn('space-y-1.5', className)}>
      <Label htmlFor={name} className="text-sm font-medium text-neutral-700">
        {label}
        {required && <span className="text-danger-500 ml-0.5">*</span>}
      </Label>
      <div
        className={cn(
          'flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors',
          error
            ? 'border-danger-500 bg-danger-50/50'
            : 'border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50'
        )}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="h-5 w-5 text-neutral-400" />
        <span className="text-sm text-neutral-500">Click to upload {multiple ? 'files' : 'a file'}</span>
        <input
          ref={inputRef}
          id={name}
          name={name}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => e.target.files && onFilesSelected?.(e.target.files)}
          className="hidden"
        />
      </div>
      {error && <p className="text-xs text-danger-500">{error}</p>}
    </div>
  )
}

export default FormFileInput
