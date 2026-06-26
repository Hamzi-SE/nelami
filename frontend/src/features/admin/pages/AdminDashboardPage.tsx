import { Outlet, Navigate } from 'react-router-dom'
import { useAppSelector } from '@/store/typedHooks'
import AdminSidebar from '@/components/layout/sidebar/AdminSidebar'
import MetaData from '@/utils/MetaData'
import { toast } from 'sonner'
import { useEffect } from 'react'

const AdminDashboardPage = () => {
  const { user, isAuthenticated, loading } = useAppSelector((state) => state.user)

  useEffect(() => {
    if (isAuthenticated && user?.role !== 'admin') {
      toast.error('Only admin can access this page')
    }
  }, [isAuthenticated, user?.role])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-danger-500 border-t-transparent" />
      </div>
    )
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="text-center py-16">
        <p className="text-danger-500 text-lg font-bold">Access Denied — Admin Only</p>
      </div>
    )
  }

  return (
    <>
      <MetaData title="Admin Dashboard - Nelami" />
      <div className="bg-neutral-50 min-h-[calc(100vh-64px)]">
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  )
}

export default AdminDashboardPage
