import { Textarea } from '@/components/ui/textarea'
import { Field, FieldLabel, FieldError, FieldDescription } from '@/components/ui/field'

interface FormTextareaProps {
  label: string
  name: string
  placeholder?: string
  description?: string
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
  description,
  error,
  required = false,
  className,
  rows = 4,
  value,
  onChange,
  onBlur,
}: FormTextareaProps) => {
  return (
    <Field data-invalid={!!error} className={className}>
      <FieldLabel htmlFor={name}>
        {label}
        {required && <span className="text-danger-500 ml-0.5">*</span>}
      </FieldLabel>
      <Textarea
        id={name}
        name={name}
        placeholder={placeholder}
        rows={rows}
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

export default FormTextarea
