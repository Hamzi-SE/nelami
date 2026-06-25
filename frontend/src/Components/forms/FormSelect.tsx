import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Field, FieldLabel, FieldError, FieldDescription } from '@/components/ui/field'

interface FormSelectOption {
  label: string
  value: string
}

interface FormSelectProps {
  label: string
  name: string
  placeholder?: string
  options: FormSelectOption[]
  description?: string
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
  description,
  error,
  required = false,
  className,
  value,
  onValueChange,
  disabled = false,
}: FormSelectProps) => {
  return (
    <Field data-invalid={!!error} className={className}>
      <FieldLabel htmlFor={name}>
        {label}
        {required && <span className="text-danger-500 ml-0.5">*</span>}
      </FieldLabel>
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger id={name} aria-invalid={!!error}>
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
      {description && <FieldDescription>{description}</FieldDescription>}
      {error && <FieldError errors={[{ message: error }]} />}
    </Field>
  )
}

export default FormSelect
