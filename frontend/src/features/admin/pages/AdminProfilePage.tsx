import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppSelector } from '@/store/typedHooks'
import { Mail, MapPin, Phone, Shield, User } from 'lucide-react'
import { Link } from 'react-router-dom'

const AdminProfilePage = () => {
  const { user } = useAppSelector((state) => state.user)

  const fields = [
    { label: 'Name', value: user?.name, icon: User },
    { label: 'Email', value: user?.email, icon: Mail },
    { label: 'Phone Number', value: user?.phoneNo || 'Not provided', icon: Phone },
    { label: 'Address', value: user?.address || 'Not provided', icon: MapPin },
    { label: 'City', value: user?.city || 'Not provided', icon: MapPin },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Profile</CardTitle>
          <Link to="/admin/dashboard/edit-profile">
            <Button variant="outline" size="sm">
              Edit Profile
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar & Name */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="h-16 w-16 rounded-full bg-danger-100 flex items-center justify-center overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar.url} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  <Shield className="h-8 w-8 text-danger-500" />
                )}
              </div>
              <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-success-500 border-2 border-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">{user?.name}</h3>
              <p className="text-sm text-danger-600 font-medium capitalize">{user?.role}</p>
            </div>
          </div>

          {/* Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map((field) => {
              const Icon = field.icon
              return (
                <div key={field.label} className="flex items-start gap-3 p-3 rounded-lg bg-neutral-50">
                  <Icon className="h-4 w-4 text-neutral-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-neutral-500">{field.label}</p>
                    <p className="text-sm font-medium text-neutral-900">{field.value}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminProfilePage
