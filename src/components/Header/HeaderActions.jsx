import React, { useState } from 'react'
import {
  Box, IconButton, Badge, Avatar, Menu, MenuItem,
  ListItemIcon, Divider, Button, Tooltip, Typography
} from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import LogoutIcon from '@mui/icons-material/Logout'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'

import { selectCurrentUser, logoutUserAPI } from '~/redux/user/userSlice'
import { selectCurrentCarts } from '~/redux/carts/cartSlice'
import { useConfirm } from 'material-ui-confirm'

function HeaderActions() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const confirmLogout = useConfirm()

  const currentUser = useSelector(selectCurrentUser)
  const currentCartRaw = useSelector(selectCurrentCarts)
  const currentCart = currentCartRaw?.data || currentCartRaw || {}

  const cartCount = currentCart?.items?.length || 0

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget)
  const handleCloseMenu = () => setAnchorEl(null)

  const handleLogout = () => {
    confirmLogout({
      title: 'Xác nhận đăng xuất',
      description: 'Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?',
      confirmationText: 'Đăng xuất',
      cancellationText: 'Hủy bỏ'
    }).then(() => {
      handleCloseMenu()
      dispatch(logoutUserAPI())
      navigate('/')
    })
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>

      <Tooltip title="Giỏ hàng của bạn">
        <IconButton
          component={Link}
          to="/cart"
          color="primary"
          sx={{
            bgcolor: 'rgba(25, 118, 210, 0.04)',
            '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.12)' }
          }}
        >
          <Badge
            badgeContent={cartCount}
            color="error"
            max={99}
            sx={{ '& .MuiBadge-badge': { fontWeight: 'bold' } }}
          >
            <ShoppingCartOutlinedIcon sx={{ fontSize: 28 }} />
          </Badge>
        </IconButton>
      </Tooltip>
      {currentUser ? (
        <>
          <Tooltip title="Tài khoản của tôi">
            <IconButton
              onClick={handleOpenMenu}
              sx={{ p: 0.5, border: '2px solid', borderColor: 'transparent', transition: '0.2s', '&:hover': { borderColor: 'primary.main' } }}
            >
              <Avatar
                src={currentUser.avatar}
                alt={currentUser.displayName}
                sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}
              >
                {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : <PersonOutlineIcon />}
              </Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleCloseMenu}
            onClick={handleCloseMenu}
            PaperProps={{
              elevation: 3,
              sx: { overflow: 'visible', mt: 1.5, minWidth: 200, borderRadius: 2, '&:before': { content: '""', display: 'block', position: 'absolute', top: 0, right: 14, width: 10, height: 10, bgcolor: 'background.paper', transform: 'translateY(-50%) rotate(45deg)', zIndex: 0 } }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle2" fontWeight="bold">Xin chào,</Typography>
              <Typography variant="body2" color="primary.main" fontWeight="bold" noWrap>{currentUser.displayName || currentUser.email}</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />

            <MenuItem component={Link} to="/profile">
              <ListItemIcon><AccountCircleIcon fontSize="small" color="primary" /></ListItemIcon>
              Tài khoản của tôi
            </MenuItem>

            <MenuItem component={Link} to="/my-orders">
              <ListItemIcon><ReceiptLongIcon fontSize="small" color="primary" /></ListItemIcon>
              Đơn mua của tôi
            </MenuItem>

            <Divider sx={{ my: 1 }} />
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
              <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
              Đăng xuất
            </MenuItem>
          </Menu>
        </>
      ) : (
        <Button
          component={Link}
          to="/login"
          variant="outlined"
          color="primary"
          startIcon={<PersonOutlineIcon />}
          sx={{
            borderRadius: 8,
            fontWeight: 'bold',
            textTransform: 'none',
            display: { xs: 'none', sm: 'flex' }
          }}
        >
          Đăng nhập
        </Button>
      )}
      {!currentUser && (
        <IconButton
          component={Link}
          to="/login"
          color="primary"
          sx={{ display: { xs: 'flex', sm: 'none' } }}
        >
          <PersonOutlineIcon sx={{ fontSize: 28 }} />
        </IconButton>
      )}

    </Box>
  )
}

export default HeaderActions