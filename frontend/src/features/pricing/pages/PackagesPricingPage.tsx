import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import MetaData from '@/lib/MetaData'
import { useAppDispatch, useAppSelector } from '@/store/typedHooks'
import { Check, Crown, Gem, Loader2, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const packageIcons = {
  Free: Star,
  Gold: Crown,
  Platinum: Gem,
}

const PackagesPricingPage = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user, loading: userLoading } = useAppSelector((state) => state.user)
  const data = useAppSelector((state) => state?.data?.data)
  const dataLoading = useAppSelector((state) => state?.data?.loading)

  const { packages } = data || { packages: [] }

  const handlePackageClick = (pkgName: string, pkgPrice: number, pkgDesc: string, pkgId: number) => {
    dispatch({
      type: 'PLAN_PURCHASE',
      payload: {
        packageName: pkgName,
        packagePrice: pkgPrice,
        packageDescription: pkgDesc,
        packageId: pkgId,
      },
    })
    navigate('/checkout')
  }

  if (!userLoading && user && user?.role === 'buyer') {
    toast.error(`${user?.role} can't access this page`)
    navigate('/')
    return null
  }

  if (userLoading || dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    )
  }

  return (
    <>
      <MetaData title="Packages - Nelami" />

      <section className="bg-neutral-50 border-b border-neutral-200">
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold text-neutral-900">Choose Your Plan</h1>
          <p className="text-neutral-500 mt-2 max-w-lg mx-auto">
            Select the package that best fits your needs. Upgrade anytime to unlock more features.
          </p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg: any, index: number) => {
              const isCurrentPlan = user?.userPackage === pkg.name
              const Icon = packageIcons[pkg.name as keyof typeof packageIcons] || Star
              const features = pkg.description ? pkg.description.split(',').map((item: string) => item.trim()) : []

              return (
                <Card
                  key={index}
                  className={`relative flex flex-col ${
                    isCurrentPlan
                      ? 'border-primary-500 ring-2 ring-primary-500/20 shadow-lg overflow-visible'
                      : 'border-neutral-200'
                  }`}
                >
                  {isCurrentPlan && (
                    <Badge className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary-500 text-white hover:bg-primary-500 px-3 py-0.5 rounded-full whitespace-nowrap z-10">
                      Current Plan
                    </Badge>
                  )}
                  <CardHeader className="text-center pb-2">
                    <div
                      className={`mx-auto h-12 w-12 rounded-xl flex items-center justify-center mb-3 ${
                        index === 0 ? 'bg-neutral-100' : index === 1 ? 'bg-amber-100' : 'bg-violet-100'
                      }`}
                    >
                      <Icon
                        className={`h-6 w-6 ${
                          index === 0 ? 'text-neutral-600' : index === 1 ? 'text-amber-600' : 'text-violet-600'
                        }`}
                      />
                    </div>
                    <CardTitle className="text-xl">{pkg.name}</CardTitle>
                    <div className="mt-2">
                      <span className="text-3xl font-bold text-neutral-900">Rs. {pkg.price?.toLocaleString()}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <ul className="space-y-3 mb-6 flex-1">
                      {features.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-neutral-600">
                          <Check className="h-4 w-4 text-success-500 mt-0.5 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    {isCurrentPlan ? (
                      <Button variant="outline" className="w-full" disabled>
                        Current Plan
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        variant={index === 1 ? 'default' : 'outline'}
                        onClick={() =>
                          index === 0
                            ? navigate('/SignUp')
                            : handlePackageClick(pkg.name, pkg.price, pkg.description, index + 1)
                        }
                      >
                        {index === 0 ? 'Get Started for Free' : 'Purchase'}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Custom Package */}
          <Card className="mt-8 border-neutral-200">
            <CardContent className="py-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <h3 className="text-xl font-bold text-neutral-900">Custom Package</h3>
                  <p className="text-neutral-500 mt-1">
                    Need something tailored? Get in touch with us for a custom quote.
                  </p>
                </div>
                <Button variant="outline" onClick={() => navigate('/contact')}>
                  Contact Us
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  )
}

export default PackagesPricingPage
