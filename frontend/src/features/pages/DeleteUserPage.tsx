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
import { Input } from '@/components/ui/input'
import customFetch from '@/lib/api'
import { useAppDispatch, useAppSelector } from '@/store/typedHooks'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface DeleteUserPageProps {
  open: boolean
  userId: string | null
  onOpenChange: (open: boolean) => void
  onDeleted?: (userId: string) => void
}

const DeleteUserPage = ({ open, userId, onOpenChange, onDeleted }: DeleteUserPageProps) => {
  const dispatch = useAppDispatch()
  const { loading } = useAppSelector((state) => state.profile)
  const { user } = useAppSelector((state) => state.user)
  const [confirmText, setConfirmText] = useState('')

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') {
      toast.error('Type DELETE to confirm')
      return
    }

    if (!userId) return

    dispatch({ type: 'DELETE_USER_REQUEST' })
    if (user?._id === userId) {
      dispatch({
        type: 'DELETE_USER_FAIL',
        payload: "You can't delete your own account",
      })
      toast.error("You can't delete yourself")
      return
    }

    try {
      const res = await customFetch(`/api/v1/admin/user/${userId}`, {
        method: 'DELETE',
      })
      const data = await res.json()

      if (res.status === 200) {
        dispatch({ type: 'DELETE_USER_SUCCESS' })
        toast.success(data.message)
        onDeleted?.(userId)
        onOpenChange(false)
      } else {
        dispatch({ type: 'DELETE_USER_FAIL', payload: data.message })
        toast.error(data.message)
      }
    } catch (error) {
      dispatch({ type: 'DELETE_USER_FAIL', payload: 'Something went wrong' })
      toast.error('Something went wrong')
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-danger-100 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-danger-500" />
            </div>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            This action is permanent and cannot be undone. Deleting this user will remove their account and related
            records.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-neutral-700">
            Type <span className="font-semibold text-danger-600">DELETE</span> to confirm
          </label>
          <Input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type DELETE here"
            disabled={loading}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-danger-500 hover:bg-danger-600"
            disabled={loading || confirmText !== 'DELETE'}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Delete User
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteUserPage
