import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface FormFieldProps {
  label: string
  name: string
  type?: string
  placeholder?: string
  error?: string
  required?: boolean
  className?: string
  value?: string | number
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
}

const FormField = ({
  label,
  name,
  type = 'text',
  placeholder,
  error,
  required = false,
  className,
  value,
  onChange,
  onBlur,
}: FormFieldProps) => {
  return (
    <div className={cn('space-y-1.5', className)}>
      <Label htmlFor={name} className="text-sm font-medium text-neutral-700">
        {label}
        {required && <span className="text-danger-500 ml-0.5">*</span>}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={error ? 'border-danger-500 focus-visible:ring-danger-500' : ''}
      />
      {error && <p className="text-xs text-danger-500">{error}</p>}
    </div>
  )
}

export default FormField
