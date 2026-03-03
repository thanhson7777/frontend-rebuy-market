import { useState } from 'react'
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logoutUserAPI } from '~/redux/user/userSlice'

import {
  Box, Drawer, AppBar, Toolbar, List, Typography, Divider,
  IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Avatar, Menu, MenuItem, Tooltip, Button
} from '@mui/material'
import { useTheme } from '@mui/material/styles'

import MenuIcon from '@mui/icons-material/Menu'
import DashboardIcon from '@mui/icons-material/Dashboard'
import InventoryIcon from '@mui/icons-material/Inventory'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import PeopleIcon from '@mui/icons-material/People'
import LogoutIcon from '@mui/icons-material/Logout'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import CategoryIcon from '@mui/icons-material/Category'
import StorefrontIcon from '@mui/icons-material/Storefront'
import ArticleIcon from '@mui/icons-material/Article'
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel'
import ContactSupportIcon from '@mui/icons-material/ContactSupport'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

const drawerWidth = 260

const MENU_ITEMS = [
  { text: 'Tổng quan', icon: <DashboardIcon />, path: '/admin' },
  { text: 'Danh mục', icon: <CategoryIcon />, path: '/admin/categories' },
  { text: 'Sản phẩm', icon: <InventoryIcon />, path: '/admin/products' },
  { text: 'Đơn hàng', icon: <ReceiptLongIcon />, path: '/admin/orders' },
  { text: 'Tin tức & Blog', icon: <ArticleIcon />, path: '/admin/articles' },
  { text: 'Quản lý Banner', icon: <ViewCarouselIcon />, path: '/admin/banners' },
  { text: 'Liên hệ', icon: <ContactSupportIcon />, path: '/admin/contacts' },
  { text: 'Khách hàng', icon: <PeopleIcon />, path: '/admin/users' },
  { text: 'Mã giảm giá', icon: <LocalOfferIcon />, path: '/admin/coupons' }
]

function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const dispatch = useDispatch()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget)
  const handleMenuClose = () => setAnchorEl(null)

  const handleLogout = async () => {
    dispatch(logoutUserAPI())
    navigate('/login')
  }

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, bgcolor: '#1e1e2f', color: '#fff' }}>
        <StorefrontIcon sx={{ color: theme.palette.warning.main, fontSize: 30 }} />
        <Typography variant="h6" fontWeight="bold" noWrap>
          SECOND-HAND
        </Typography>
      </Toolbar>
      <Divider />

      <List sx={{ flexGrow: 1, bgcolor: '#27293d', color: '#b2b2bf', pt: 2, overflowY: 'auto' }}>
        {MENU_ITEMS.map((item) => {
          const isActive = item.path === '/admin'
            ? location.pathname === '/admin'
            : location.pathname.startsWith(item.path)

          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => {
                  navigate(item.path)
                  setMobileOpen(false)
                }}
                sx={{
                  mx: 2, borderRadius: 2,
                  bgcolor: isActive ? theme.palette.primary.main : 'transparent',
                  color: isActive ? '#fff' : 'inherit',
                  '&:hover': { bgcolor: isActive ? theme.palette.primary.main : 'rgba(255,255,255,0.08)' }
                }}
              >
                <ListItemIcon sx={{ color: isActive ? '#fff' : 'inherit', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: isActive ? 'bold' : 'medium' }} />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
      <Box sx={{ p: 2, bgcolor: '#27293d' }}>
        <Button
          fullWidth variant="contained" color="info" startIcon={<OpenInNewIcon />} onClick={() => navigate('/')}
        >
          Xem Website
        </Button>
      </Box>
    </Box>
  )

  const currentMenu = MENU_ITEMS.find(i =>
    i.path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(i.path)
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f5f7' }}>
      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: '#fff',
          color: '#333'
        }}
      >
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: 'none' } }}>
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            {currentMenu ? currentMenu.text : 'Bảng điều khiển'}
          </Typography>

          <Tooltip title="Tài khoản">
            <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
              <Avatar sx={{ bgcolor: theme.palette.primary.main }}>AD</Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem
              component={Link}
              to="/admin/profile"
              onClick={handleMenuClose}
              sx={{ textDecoration: 'none', color: 'inherit' }}
            >
              <AccountCircleIcon sx={{ mr: 1, color: 'text.primary' }} />
              Hồ sơ
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
              <LogoutIcon sx={{ mr: 1 }} />
              Đăng xuất
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none' } }}
        >
          {drawerContent}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none' } }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, mt: 8 }}>
        <Outlet />
      </Box>
    </Box>
  )
}

export default AdminLayout