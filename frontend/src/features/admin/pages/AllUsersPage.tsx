import EmptyState from '@/components/shared/EmptyState'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import customFetch from '@/lib/api'
import { useAppDispatch } from '@/store/typedHooks'
import { Eye, Search, Trash2, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

interface UserItem {
  _id: string
  name: string
  email: string
  phoneNo?: string
  role: string
  avatar?: { url: string }
  createdAt: string
}

const AllUsersPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [users, setUsers] = useState<UserItem[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserItem[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      dispatch({ type: 'ALL_USERS_REQUEST' })
      try {
        const res = await customFetch('/api/v1/admin/users', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        const data = await res.json()
        if (res.status === 200) {
          dispatch({ type: 'ALL_USERS_SUCCESS', payload: data.users })
          setUsers(data.users || [])
          setFilteredUsers(data.users || [])
        } else {
          dispatch({ type: 'ALL_USERS_FAIL', payload: data.message })
          toast.error(data.message)
        }
      } catch (error) {
        dispatch({ type: 'ALL_USERS_FAIL', payload: 'Something went wrong' })
        toast.error('Something went wrong')
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [dispatch])

  useEffect(() => {
    const result = users
      .filter((user) => {
        if (!search) return true
        const query = search.toLowerCase()
        return user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query)
      })
      .sort((a, b) => a.name.localeCompare(b.name))
    setFilteredUsers(result)
  }, [search, users])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Card>
          <CardContent className="p-4 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="h-5 w-5 text-primary-500" />
        <h1 className="text-xl font-semibold text-neutral-900">All Users</h1>
        <Badge variant="secondary">{filteredUsers.length}</Badge>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <CardTitle className="text-base">User Management</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredUsers.length === 0 ? (
            <EmptyState
              icon={<Users className="h-12 w-12" />}
              title="No Users Found"
              description={search ? 'Try adjusting your search.' : 'No users registered yet.'}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Avatar</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Email</TableHead>
                  <TableHead className="hidden md:table-cell">Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="stagger-rows">
                {filteredUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <div className="h-9 w-9 rounded-full overflow-hidden bg-neutral-100">
                        {user.avatar?.url ? (
                          <img src={user.avatar.url} alt={user.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-xs font-medium text-neutral-500">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-neutral-600">{user.email}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-neutral-600">
                      {user.phoneNo || '—'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.role === 'admin' ? 'destructive' : user.role === 'seller' ? 'default' : 'secondary'
                        }
                        className={user.role === 'seller' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' : ''}
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {user.role === 'seller' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => window.open(`/user/${user._id}`, '_blank')}
                            title="View Profile"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-danger-500 hover:text-danger-600 hover:bg-danger-50"
                          onClick={() => navigate(`/admin/delete-user/${user._id}`)}
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default AllUsersPage
