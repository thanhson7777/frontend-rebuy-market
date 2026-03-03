import React, { useState } from 'react'
import { Paper, InputBase, Button, Box } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { useNavigate } from 'react-router-dom'

function SearchBar() {
  const [keyword, setKeyword] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (keyword.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(keyword.trim())}`)
    }
  }

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', px: { xs: 0, md: 4 } }}>
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
          borderColor: 'primary.main',
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
    </Box>
  )
}

export default SearchBar