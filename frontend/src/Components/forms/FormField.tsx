import { Input } from '@/components/ui/input'
import { Field, FieldLabel, FieldError, FieldDescription } from '@/components/ui/field'
import { cn } from '@/lib/utils'

interface FormFieldProps {
  label: string
  name: string
  type?: string
  placeholder?: string
  description?: string
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
  description,
  error,
  required = false,
  className,
  value,
  onChange,
  onBlur,
}: FormFieldProps) => {
  return (
    <Field data-invalid={!!error} className={className}>
      <FieldLabel htmlFor={name}>
        {label}
        {required && <span className="text-danger-500 ml-0.5">*</span>}
      </FieldLabel>
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={!!error}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {error && <FieldError errors={[{ message: error }]} />}
    </Field>
  )
}

export default FormField
