import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface FormSelectOption {
  label: string
  value: string
}

interface FormSelectProps {
  label: string
  name: string
  placeholder?: string
  options: FormSelectOption[]
  error?: string
  required?: boolean
  className?: string
  value?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
}

const FormSelect = ({
  label,
  name,
  placeholder = 'Select an option',
  options,
  error,
  required = false,
  className,
  value,
  onValueChange,
  disabled = false,
}: FormSelectProps) => {
  return (
    <div className={cn('space-y-1.5', className)}>
      <Label htmlFor={name} className="text-sm font-medium text-neutral-700">
        {label}
        {required && <span className="text-danger-500 ml-0.5">*</span>}
      </Label>
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger
          id={name}
          className={error ? 'border-danger-500 focus-visible:ring-danger-500' : ''}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-danger-500">{error}</p>}
    </div>
  )
}

export default FormSelect
