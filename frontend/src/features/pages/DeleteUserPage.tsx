import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import customFetch from '@/lib/api'
import { useAppDispatch, useAppSelector } from '@/store/typedHooks'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

const DeleteUserPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading } = useAppSelector((state) => state.profile)
  const { user } = useAppSelector((state) => state.user)
  const { id } = useParams()

  const handleDelete = async () => {
    dispatch({ type: 'DELETE_USER_REQUEST' })
    if (user?._id === id) {
      dispatch({
        type: 'DELETE_USER_FAIL',
        payload: "You can't delete your own account",
      })
      toast.error("You can't delete yourself")
      return
    }

    try {
      const res = await customFetch(`/api/v1/admin/user/${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()

      if (res.status === 200) {
        dispatch({ type: 'DELETE_USER_SUCCESS' })
        toast.success(data.message)
        navigate(user?.role === 'admin' ? '/admin/dashboard' : '/dashboard')
      } else {
        dispatch({ type: 'DELETE_USER_FAIL', payload: data.message })
        toast.error(data.message)
        navigate('/dashboard')
      }
    } catch (error) {
      dispatch({ type: 'DELETE_USER_FAIL', payload: 'Something went wrong' })
      toast.error('Something went wrong')
    }
  }

  const handleGoBack = () => {
    if (user?.role === 'admin') {
      navigate('/admin/dashboard')
    } else {
      navigate('/dashboard')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    )
  }

  return (
    <AlertDialog open={true}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-danger-100 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-danger-500" />
            </div>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            Are you sure you want to delete this user? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleGoBack}>Go Back</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-danger-500 hover:bg-danger-600">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteUserPage
