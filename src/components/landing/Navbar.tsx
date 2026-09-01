'use client';
import { useState, useEffect } from 'react';
import NextLink from 'next/link';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

function SprintAILogoMark() {
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#071A2F" />
      <path d="M20 5H12.5L9 16.5H14.5L11 27L23 13.5H16.5L20 5Z" fill="#3B82F6" />
    </svg>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box
      component="nav"
      aria-label="Main navigation"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        bgcolor: scrolled ? 'rgba(247,245,255,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: '1px solid',
        borderColor: scrolled ? '#E5E7EB' : 'transparent',
        boxShadow: scrolled ? '0 1px 20px rgba(0,0,0,0.04)' : 'none',
        transition: 'background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.5 }}>
          <NextLink href="/" aria-label="SprintAI home">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SprintAILogoMark />
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: '1.05rem',
                  color: '#071A2F',
                  letterSpacing: '-0.03em',
                }}
              >
                SprintAI
              </Typography>
            </Box>
          </NextLink>

          <Button
            component={NextLink}
            href="/dashboard"
            variant="contained"
            aria-label="Go to dashboard"
            sx={{
              bgcolor: '#071A2F',
              color: 'white',
              borderRadius: '50px',
              px: 2.75,
              py: 0.9,
              fontSize: '0.85rem',
              fontWeight: 700,
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#123B6D',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 14px rgba(18,59,109,0.2)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            Dashboard
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
