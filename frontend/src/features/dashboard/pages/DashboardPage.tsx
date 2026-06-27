import DashboardSidebar from '@/components/layout/sidebar/DashboardSidebar'
import MetaData from '@/lib/MetaData'
import { useAppSelector } from '@/store/typedHooks'
import { Outlet } from 'react-router-dom'

const DashboardPage = () => {
  const { user, isAuthenticated, loading } = useAppSelector((state) => state.user)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center py-16">
        <p className="text-danger-500 text-lg font-bold">Please Login To Access Dashboard</p>
      </div>
    )
  }

  return (
    <>
      <MetaData title="Dashboard - Nelami" />
      <div className="bg-neutral-50 min-h-[calc(100vh-64px)]">
        <div className="flex">
          <DashboardSidebar />
          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  )
}

export default DashboardPage
