import React, { useState, useEffect, useRef } from 'react'
import { Paper, InputBase, Button, Box, Popper, Fade, Typography, Avatar, ClickAwayListener } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { useNavigate } from 'react-router-dom'
import { searchProductsAPI } from '~/apis'

function SearchBar() {
  const [keyword, setKeyword] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const keywordRef = useRef(keyword)
  keywordRef.current = keyword
  const navigate = useNavigate()

  const trimmedKeyword = keyword.trim()
  const canShowDropdown = trimmedKeyword.length >= 2
  const open = Boolean(anchorEl) && canShowDropdown && (loading || hasSearched)

  useEffect(() => {
    if (trimmedKeyword.length < 2) {
      setSuggestions([])
      setHasSearched(false)
      return
    }

    setHasSearched(false)
    const searchKeyword = trimmedKeyword
    const debounceTimer = setTimeout(async () => {
      setLoading(true)
      try {
        const products = await searchProductsAPI(searchKeyword)
        if (keywordRef.current.trim() === searchKeyword) {
          setSuggestions(products || [])
          setHasSearched(true)
        }
      } catch (error) {
        console.error('Lỗi tìm kiếm:', error)
        if (keywordRef.current.trim() === searchKeyword) {
          setSuggestions([])
          setHasSearched(true)
        }
      } finally {
        if (keywordRef.current.trim() === searchKeyword) {
          setLoading(false)
        }
      }
    }, 1000)

    return () => clearTimeout(debounceTimer)
  }, [keyword])

  const handleSearch = (e) => {
    e.preventDefault()
    if (!trimmedKeyword) return
    if (hasSearched && suggestions.length === 0) return
    setAnchorEl(null)
    navigate(`/products?keyword=${encodeURIComponent(trimmedKeyword)}`)
  }

  const handleSuggestionClick = (product) => {
    setAnchorEl(null)
    navigate(`/product/${product._id}`)
  }

  const handleInputFocus = (e) => {
    const form = e.currentTarget.closest('form')
    setAnchorEl(form || e.currentTarget)
  }

  const handleInputBlur = () => {
    setTimeout(() => {
      setAnchorEl(null)
    }, 200)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0)
  }

  return (
    <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', px: { xs: 0, md: 4 }, position: 'relative' }}>
        <Paper
          component="form"
          onSubmit={handleSearch}
          elevation={0}
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            maxWidth: 600,
            borderRadius: 8,
            border: '2px solid',
            borderColor: open ? 'primary.main' : 'primary.main',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            '&:focus-within': {
              boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.2)'
            }
          }}
        >
          <InputBase
            sx={{ ml: 2, flex: 1, py: 0.5, fontSize: '15px' }}
            placeholder="Bạn đang tìm đồ cũ gì hôm nay?..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disableElevation
            sx={{
              borderRadius: 0,
              px: { xs: 2, md: 3 },
              height: '100%',
              minWidth: 'auto'
            }}
          >
            <SearchIcon />
          </Button>
        </Paper>

        <Popper
          open={open}
          anchorEl={anchorEl}
          placement="bottom-start"
          transition
          style={{ zIndex: 1300, width: anchorEl ? (anchorEl.offsetWidth || 600) : undefined }}
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper
                elevation={3}
                sx={{
                  mt: 1,
                  maxHeight: 400,
                  overflow: 'auto',
                  borderRadius: 2,
                  '&::-webkit-scrollbar': { width: '6px' },
                  '&::-webkit-scrollbar-thumb': { bgcolor: '#cbd5e1', borderRadius: '3px' }
                }}
              >
                {loading ? (
                  <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">Đang tìm kiếm...</Typography>
                  </Box>
                ) : suggestions.length > 0 ? (
                  suggestions.map((product) => (
                    <Box
                      key={product._id}
                      onClick={() => handleSuggestionClick(product)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 1.5,
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                        '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.08)' }
                      }}
                    >
                      <Avatar
                        src={product.image?.[0] || ''}
                        variant="rounded"
                        sx={{ width: 50, height: 50, bgcolor: 'grey.200' }}
                      >
                        <SearchIcon />
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          fontWeight="600"
                          noWrap
                          sx={{ color: 'text.primary' }}
                        >
                          {product.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap>
                          {product.sku && `SKU: ${product.sku}`}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        color="primary.main"
                        sx={{ whiteSpace: 'nowrap' }}
                      >
                        {formatPrice(product.price)}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">Không tìm thấy sản phẩm nào</Typography>
                  </Box>
                )}
              </Paper>
            </Fade>
          )}
        </Popper>
      </Box>
    </ClickAwayListener>
  )
}

export default SearchBar
