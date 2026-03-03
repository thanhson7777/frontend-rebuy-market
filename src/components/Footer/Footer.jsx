import React from 'react'
import {
  Box, Container, Grid, Typography, Stack,
  Link, IconButton, Divider
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import YouTubeIcon from '@mui/icons-material/YouTube'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PhoneIcon from '@mui/icons-material/Phone'
import EmailIcon from '@mui/icons-material/Email'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import bctLogo from '~/assets/bo-cong-thuong.jpg'
const FooterTitle = ({ children }) => (
  <Typography
    variant="subtitle1"
    sx={{
      fontWeight: 700,
      mb: 2.5,
      color: 'white',
      textTransform: 'uppercase',
      letterSpacing: 1
    }}
  >
    {children}
  </Typography>
)

const FooterLink = ({ to, children }) => (
  <Link
    component={RouterLink}
    to={to}
    sx={{
      color: '#94a3b8',
      textDecoration: 'none',
      fontSize: '14px',
      transition: 'all 0.2s',
      '&:hover': {
        color: 'white',
        paddingLeft: '5px'
      }
    }}
  >
    {children}
  </Link>
)

function Footer() {
  return (
    <Box
      sx={{
        bgcolor: '#0f172a',
        color: '#94a3b8',
        pt: 8,
        pb: 3,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>

          <Grid item xs={12} md={4}>
            <Stack spacing={2}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                REBUY <Box component="span" sx={{ fontWeight: 400, color: 'white' }}>MARKET</Box>
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
                Nền tảng mua bán đồ cũ ký gửi uy tín số 1 Việt Nam. Chúng tôi cam kết minh bạch về tình trạng sản phẩm và bảo vệ quyền lợi người mua tối đa.
              </Typography>
              <Stack direction="row" spacing={1}>
                {[FacebookIcon, InstagramIcon, YouTubeIcon].map((Icon, index) => (
                  <IconButton
                    key={index}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.05)',
                      color: 'white',
                      '&:hover': { bgcolor: 'primary.main' }
                    }}
                  >
                    <Icon fontSize="small" />
                  </IconButton>
                ))}
              </Stack>
            </Stack>
          </Grid>

          <Grid item xs={6} md={2.5}>
            <FooterTitle>Hỗ trợ khách hàng</FooterTitle>
            <Stack spacing={1.5}>
              <FooterLink to="/chinh-sach-bao-hanh">Chính sách bảo hành</FooterLink>
              <FooterLink to="/chinh-sach-doi-tra">Chính sách đổi trả</FooterLink>
              <FooterLink to="/huong-dan-mua-hang">Hướng dẫn mua hàng</FooterLink>
              <FooterLink to="/cau-hoi-thuong-gap">Câu hỏi thường gặp</FooterLink>
            </Stack>
          </Grid>

          <Grid item xs={6} md={2.5}>
            <FooterTitle>Danh mục</FooterTitle>
            <Stack spacing={1.5}>
              <FooterLink to="/category/dien-thoai">Điện thoại cũ</FooterLink>
              <FooterLink to="/category/laptop">Laptop cũ</FooterLink>
              <FooterLink to="/category/tablet">Máy tính bảng</FooterLink>
              <FooterLink to="/category/phu-kien">Phụ kiện zin</FooterLink>
            </Stack>
          </Grid>

          <Grid item xs={12} md={3}>
            <FooterTitle>Liên hệ với chúng tôi</FooterTitle>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1.5}>
                <LocationOnIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                <Typography variant="body2">99 Ninh Kiều, Cần Thơ, Việt Nam</Typography>
              </Stack>
              <Stack direction="row" spacing={1.5}>
                <PhoneIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                <Typography variant="body2">036.379.8364</Typography>
              </Stack>
              <Stack direction="row" spacing={1.5}>
                <EmailIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                <Typography variant="body2">support@rebuymarket.vn</Typography>
              </Stack>

              <Box sx={{ mt: 1 }}>
                <img
                  src={bctLogo}
                  alt="Bộ Công Thương"
                  style={{ height: 40 }}
                />
              </Box>
            </Stack>
          </Grid>

        </Grid>

        <Divider sx={{ my: 6, borderColor: 'rgba(255,255,255,0.1)' }} />

        {/* BẢN QUYỀN & THANH TOÁN */}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Typography variant="caption">
            © 2026 **Rebuy Market**. Tất cả quyền được bảo lưu. Thiết kế bởi Anh Kiet.
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            <VerifiedUserIcon sx={{ fontSize: 16, color: '#4ade80' }} />
            <Typography variant="caption">Giao dịch an toàn & Bảo mật</Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}

export default Footer