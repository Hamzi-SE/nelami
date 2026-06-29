import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import customFetch from '@/lib/api'
import MetaData from '@/lib/MetaData'
import { zodResolver } from '@hookform/resolvers/zod'
import { Clock, Loader2, Mail, Phone } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email'),
  message: z.string().min(1, 'Message is required'),
})

type ContactFormData = z.infer<typeof contactSchema>

const ContactPage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  })

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true)
    try {
      const res = await customFetch('/api/v1/message/toAdmin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await res.json()
      if (res.status === 200) {
        toast.success(result.message)
        reset()
        navigate('/', { replace: true })
      } else {
        toast.error(result.message)
      }
    } catch {
      toast.error('Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <MetaData title="Contact - Nelami" />

      {/* Breadcrumb */}
      <section className="bg-neutral-50 border-b border-neutral-200">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-neutral-900">Contact Us</h1>
          <nav className="flex items-center gap-1.5 mt-1 text-sm text-neutral-500">
            <Link to="/" className="hover:text-primary-500">
              Home
            </Link>
            <span>/</span>
            <span className="text-neutral-700">Contact</span>
          </nav>
        </div>
      </section>

      <section className="py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-neutral-900 mb-4">Send us a Message</h2>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Controller
                      name="name"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="name">Your Name</FieldLabel>
                          <Input {...field} id="name" placeholder="Enter your name" />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />

                    <Controller
                      name="email"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="email">Email Address</FieldLabel>
                          <Input {...field} id="email" type="email" placeholder="Enter your email" />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />

                    <Controller
                      name="message"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="message">Message</FieldLabel>
                          <Textarea
                            {...field}
                            id="message"
                            placeholder="Write your message..."
                            rows={6}
                            minLength={10}
                            maxLength={3000}
                            className="min-h-25"
                          />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />

                    <Button type="submit" disabled={isSubmitting || loading}>
                      {(isSubmitting || loading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <Card className="border-primary-200 bg-primary-50">
                <CardContent className="p-5 flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Phone</p>
                    <p className="text-sm text-neutral-600 mt-0.5">+92 315-608-8777</p>
                    <p className="text-xs text-neutral-500 mt-1">Available 24/7 for assistance.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-secondary-200 bg-secondary-50">
                <CardContent className="p-5 flex items-start gap-3">
                  <Clock className="h-5 w-5 text-secondary-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Office Hours</p>
                    <p className="text-sm text-neutral-600 mt-0.5">Mon-Sat (10:00 AM - 7:00 PM)</p>
                    <p className="text-xs text-neutral-500 mt-1">Feel free to contact us during these hours.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-success-200 bg-success-50">
                <CardContent className="p-5 flex items-start gap-3">
                  <Mail className="h-5 w-5 text-success-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Email</p>
                    <p className="text-sm text-neutral-600 mt-0.5">nelami@ihamza.dev</p>
                    <p className="text-xs text-neutral-500 mt-1">We&apos;ll get back to you soon.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default ContactPage
