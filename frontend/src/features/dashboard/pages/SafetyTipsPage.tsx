import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShieldCheck } from 'lucide-react'

const tips = [
  'Meet seller at a public place',
  'Check the item thoroughly before buying',
  'Pay only after collecting the item',
  'Be cautious of deals that seem too good to be true',
  'Keep all communication within the platform',
  'Report suspicious activity immediately',
]

const SafetyTipsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ShieldCheck className="h-5 w-5 text-primary-500" />
        <h1 className="text-xl font-semibold text-neutral-900">Safety Tips</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stay Safe While Trading</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="mt-0.5 h-5 w-5 rounded-full bg-success-100 flex items-center justify-center shrink-0">
                  <ShieldCheck className="h-3 w-3 text-success-600" />
                </span>
                <span className="text-sm text-neutral-700">{tip}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

export default SafetyTipsPage
