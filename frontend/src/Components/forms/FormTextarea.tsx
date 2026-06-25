import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface FormTextareaProps {
  label: string
  name: string
  placeholder?: string
  error?: string
  required?: boolean
  className?: string
  rows?: number
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void
}

const FormTextarea = ({
  label,
  name,
  placeholder,
  error,
  required = false,
  className,
  rows = 4,
  value,
  onChange,
  onBlur,
}: FormTextareaProps) => {
  return (
    <div className={cn('space-y-1.5', className)}>
      <Label htmlFor={name} className="text-sm font-medium text-neutral-700">
        {label}
        {required && <span className="text-danger-500 ml-0.5">*</span>}
      </Label>
      <Textarea
        id={name}
        name={name}
        placeholder={placeholder}
        rows={rows}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={error ? 'border-danger-500 focus-visible:ring-danger-500' : ''}
      />
      {error && <p className="text-xs text-danger-500">{error}</p>}
    </div>
  )
}

export default FormTextarea
