import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

const Newsletter = () => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const postUrl = `https://gmail.us14.list-manage.com/subscribe/post?u=${process.env.REACT_APP_MAILCHIMP_U}&id=${process.env.REACT_APP_MAILCHIMP_ID}`

  useEffect(() => {
    if (status === 'success') setEmail('')
  }, [status])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || email.indexOf('@') === -1) return

    setLoading(true)
    const formData = new URLSearchParams()
    formData.append('EMAIL', email)

    fetch(postUrl, {
      method: 'POST',
      body: formData.toString(),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.result || 'success')
        setMessage(data.msg || 'Subscribed successfully!')
        setLoading(false)
      })
      .catch(() => {
        setStatus('error')
        setMessage('Something went wrong. Please try again.')
        setLoading(false)
      })
  }

  return (
    <div className="border-t border-neutral-200 bg-neutral-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto text-center">
          <h3 className="text-lg font-semibold text-neutral-900 mb-1">Subscribe To Our Newsletter</h3>
          <p className="text-sm text-neutral-500 mb-4">Get in touch with our latest offers and products</p>

          {status === 'success' && <div className="text-sm text-success-600 mb-3">{message}</div>}
          {status === 'error' && <div className="text-sm text-danger-600 mb-3">{message}</div>}

          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Subscribe'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Newsletter
