import { useState, useEffect } from 'react'
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Tabs, Tab, Select, MenuItem,
  IconButton, Collapse, Grid, Avatar, CircularProgress, Switch,
  TextField, InputAdornment, Button, Chip, Pagination, Tooltip,
  Divider
} from '@mui/material'

import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import SearchIcon from '@mui/icons-material/Search'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import PersonIcon from '@mui/icons-material/Person'
import BlockIcon from '@mui/icons-material/Block'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'

import { toast } from 'react-toastify'
import { useConfirm } from 'material-ui-confirm'
import { useSelector } from 'react-redux'

import { fetchAdminUsersAPI, updateAdminUserRoleAPI } from '~/apis'
import { selectCurrentUser } from '~/redux/user/userSlice'

const formatDate = (timestamp) => {
  if (!timestamp) return ''
  const d = new Date(timestamp)
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`
}

const UserRow = ({ row, currentUserId, isExpanded, onToggleExpand, onReload }) => {
  const isCurrentUser = row._id === currentUserId
  const [editRole, setEditRole] = useState(row.role || 'client')
  const confirm = useConfirm()

  const handleToggleStatus = (e) => {
    e.stopPropagation()
    if (isCurrentUser) return toast.warning('Bạn không thể tự khóa tài khoản của mình!')

    const newIsActive = e.target.checked
    const actionText = newIsActive ? 'MỞ KHÓA' : 'KHÓA'

    confirm({
      title: `${actionText} tài khoản?`,
      description: `Bạn có chắc chắn muốn ${actionText.toLowerCase()} tài khoản của "${row.email}" không?`,
      confirmationText: 'Đồng ý',
      cancellationText: 'Hủy',
      confirmationButtonProps: { color: newIsActive ? 'primary' : 'error', variant: 'contained' }
    })
      .then(async () => {
        try {
          await toast.promise(
            updateAdminUserRoleAPI(row._id, { isActive: newIsActive }),
            { pending: 'Đang xử lý...', success: `${actionText} thành công!`, error: 'Thao tác thất bại!' }
          )
          onReload()
        } catch (error) { console.error(error) }
      })
      .catch(() => { })
  }

  const handleSaveRole = async () => {
    if (isCurrentUser) return toast.warning('Bạn không thể tự đổi quyền của mình!')
    if (editRole === row.role) return onToggleExpand(null)

    const isPromoting = editRole === 'admin'

    confirm({
      title: 'Xác nhận thay đổi phân quyền',
      description: isPromoting
        ? `CẢNH BÁO: Cấp quyền "Quản trị viên" sẽ cho phép người này truy cập hệ thống quản trị. Bạn có chắc chắn?`
        : `Hạ quyền người này xuống "Khách hàng"?`,
      confirmationText: 'Lưu thay đổi',
      cancellationText: 'Hủy',
      confirmationButtonProps: { color: 'primary', variant: 'contained' }
    })
      .then(async () => {
        try {
          await toast.promise(
            updateAdminUserRoleAPI(row._id, { role: editRole }),
            { pending: 'Đang cập nhật...', success: 'Cập nhật phân quyền thành công!', error: 'Lỗi cập nhật!' }
          )
          onToggleExpand(null)
          onReload()
        } catch (error) { console.error(error) }
      })
      .catch(() => { })
  }

  return (
    <>
      <TableRow
        hover
        sx={{
          cursor: 'pointer',
          '& > *': { borderBottom: 'unset' },
          bgcolor: isCurrentUser ? '#f1f5f9' : 'inherit'
        }}
        onClick={() => onToggleExpand(isExpanded ? null : row._id)}
      >
        <TableCell width="40px">
          <IconButton size="small">
            <KeyboardArrowDownIcon sx={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
          </IconButton>
        </TableCell>

        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar src={row.avatar} alt={row.displayName} sx={{ border: '1px solid #e2e8f0' }}>
              {!row.avatar && <PersonIcon />}
            </Avatar>
            <Box>
              <Typography fontWeight="bold" fontSize="14px">
                {row.displayName || row.fullName || 'Chưa cập nhật tên'}
                {isCurrentUser && <span style={{ color: '#1976D2', fontStyle: 'italic', fontWeight: 'normal', marginLeft: '6px' }}>(Bạn)</span>}
              </Typography>
              <Typography fontSize="13px" color="text.secondary">{row.email}</Typography>
            </Box>
          </Box>
        </TableCell>

        <TableCell>
          <Chip
            icon={row.role === 'admin' ? <AdminPanelSettingsIcon /> : <PersonIcon />}
            label={row.role === 'admin' ? 'Quản trị' : 'Khách hàng'}
            color={row.role === 'admin' ? 'primary' : 'default'}
            size="small"
            sx={{ fontWeight: 'bold' }}
          />
        </TableCell>

        <TableCell>{formatDate(row.createdAt)}</TableCell>

        <TableCell onClick={(e) => e.stopPropagation()}>
          <Tooltip title={row.isActive === false ? 'Tài khoản đang bị khóa' : 'Tài khoản đang hoạt động'}>
            <Switch
              color="primary"
              checked={row.isActive !== false}
              onChange={handleToggleStatus}
              disabled={isCurrentUser}
            />
          </Tooltip>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>

            <Box sx={{ p: 3, my: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0', boxShadow: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)' }}>

              <Typography variant="subtitle1" fontWeight="bold" color="primary.main" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <ManageAccountsIcon /> Thiết lập hệ thống cho: <span style={{ color: 'inherit' }}>{row.email}</span>
              </Typography>

              <Grid container spacing={3} alignItems="flex-start">

                <Grid item xs={12} md={5}>
                  <Paper elevation={0} sx={{ p: 2, border: '1px solid #cbd5e1', borderRadius: 2, height: '100%' }}>
                    <Typography variant="body2" color="text.secondary" mb={1} textTransform="uppercase" fontWeight="bold">Thông tin liên hệ</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography variant="body2"><strong>Họ tên:</strong> {row.fullName || '---'}</Typography>
                      <Typography variant="body2"><strong>SĐT:</strong> {row.phone || '---'}</Typography>
                      <Typography variant="body2"><strong>Địa chỉ:</strong> {row.address || '---'}</Typography>
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={7}>
                  <Paper elevation={0} sx={{ p: 2, border: '1px solid #cbd5e1', borderRadius: 2, height: '100%' }}>
                    <Typography variant="body2" color="text.secondary" mb={1} textTransform="uppercase" fontWeight="bold">Vai trò hệ thống (Role)</Typography>

                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                      <Select
                        color="primary"
                        size="small"
                        sx={{ minWidth: 200, bgcolor: 'white' }}
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value)}
                        disabled={isCurrentUser}
                      >
                        <MenuItem value="admin">Quản trị viên (Admin)</MenuItem>
                        <MenuItem value="client">Khách hàng (client)</MenuItem>
                      </Select>

                      <Button
                        variant="contained"
                        color="primary"
                        disabled={isCurrentUser || editRole === row.role}
                        onClick={handleSaveRole}
                        sx={{ boxShadow: 'none' }}
                      >
                        Lưu Phân Quyền
                      </Button>
                    </Box>

                    {isCurrentUser ? (
                      <Typography variant="caption" color="error.main" sx={{ display: 'block', mt: 1, fontStyle: 'italic' }}>
                        * Bạn không thể tự thay đổi quyền của chính mình.
                      </Typography>
                    ) : (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                        * Quản trị viên có toàn quyền truy cập trang Admin.
                      </Typography>
                    )}
                  </Paper>
                </Grid>

              </Grid>

            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

function UserLayout() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentTab, setCurrentTab] = useState('ALL')
  const [expandedRowId, setExpandedRowId] = useState(null)

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')

  const currentUser = useSelector(selectCurrentUser)
  const currentUserId = currentUser?._id

  const loadUsers = async () => {
    try {
      setLoading(true)
      const params = { page: page, limit: 10 }

      if (currentTab === 'admin') params.role = 'admin'
      if (currentTab === 'client') params.role = 'client'
      if (currentTab === 'blocked') params.isActive = 'false'
      if (searchQuery) params.keyword = searchQuery

      const res = await fetchAdminUsersAPI(params)
      if (res && res.data) {
        setUsers(res.data.users || [])
        setTotalPages(res.data.pagination?.totalPages || 1)
      }
    } catch (error) {
      console.error('Lỗi lấy user:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadUsers() }, [page, currentTab])

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      setPage(1)
      loadUsers()
    }
  }

  if (loading && users.length === 0) return <CircularProgress color="primary" sx={{ display: 'block', mx: 'auto', mt: 10 }} />

  return (
    <Box sx={{ pb: 5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PeopleAltIcon color="primary" fontSize="large" />
          <Typography variant="h5" fontWeight="bold">Quản lý Khách Hàng</Typography>
        </Box>
        <TextField
          color="primary"
          placeholder="Tìm tên, email..."
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearch}
          InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }}
          sx={{ width: '300px', bgcolor: '#fff', borderRadius: 1 }}
        />
      </Box>
      <Paper elevation={1} sx={{ mb: 3, borderRadius: 2 }}>
        <Tabs
          value={currentTab}
          onChange={(e, newVal) => { setCurrentTab(newVal); setPage(1); setExpandedRowId(null); }}
          textColor="primary"
          indicatorColor="primary"
          variant="scrollable"
        >
          <Tab label="TẤT CẢ" value="ALL" sx={{ fontWeight: 'bold' }} />
          <Tab icon={<AdminPanelSettingsIcon fontSize="small" />} iconPosition="start" label="QUẢN TRỊ VIÊN" value="admin" sx={{ fontWeight: 'bold' }} />
          <Tab icon={<PersonIcon fontSize="small" />} iconPosition="start" label="KHÁCH HÀNG" value="client" sx={{ fontWeight: 'bold' }} />
          <Tab icon={<BlockIcon fontSize="small" />} iconPosition="start" label="BỊ KHÓA" value="blocked" sx={{ fontWeight: 'bold', color: currentTab === 'blocked' ? 'error.main' : 'inherit' }} />
        </Tabs>
      </Paper>

      <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell width="40px" />
              <TableCell sx={{ fontWeight: 'bold' }}>Tài Khoản</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Phân Quyền</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Ngày Tham Gia</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Trạng Thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length > 0 ? (
              users.map((row) => (
                <UserRow
                  key={row._id}
                  row={row}
                  currentUserId={currentUserId}
                  isExpanded={expandedRowId === row._id}
                  onToggleExpand={setExpandedRowId}
                  onReload={loadUsers}
                />
              ))
            ) : (
              <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6, color: 'text.secondary' }}>Không tìm thấy tài khoản nào phù hợp!</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, val) => { setPage(val); setExpandedRowId(null); }}
            size="large"
            color="primary"
          />
        </Box>
      )}
    </Box>
  )
}

export default UserLayout