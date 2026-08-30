import NextLink from 'next/link';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

function SprintAILogoMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#071A2F" />
      <path d="M20 5H12.5L9 16.5H14.5L11 27L23 13.5H16.5L20 5Z" fill="#3B82F6" />
    </svg>
  );
}

const footerLinks = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms',   href: '/terms'   },
];

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'white',
        borderTop: '1px solid #F0F4F8',
        py: { xs: 6, md: 8 },
      }}
    >
      <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
        {/* Logo + brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.25, mb: 1.5 }}>
          <SprintAILogoMark />
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: '1.15rem',
              color: '#071A2F',
              letterSpacing: '-0.03em',
            }}
          >
            SprintAI
          </Typography>
        </Box>

        <Typography sx={{ color: '#64748B', fontSize: '0.95rem', mb: 4 }}>
          Study smarter. Move faster.
        </Typography>

        {/* Divider */}
        <Box sx={{ height: '1px', bgcolor: '#F0F4F8', mb: 4 }} />

        {/* Links */}
        <Box
          component="nav"
          aria-label="Footer navigation"
          sx={{ display: 'flex', justifyContent: 'center', gap: 4, mb: 3 }}
        >
          {footerLinks.map(({ label, href }) => (
            <NextLink key={label} href={href}>
              <Typography
                sx={{
                  color: '#64748B',
                  fontSize: '0.9rem',
                  '&:hover': { color: '#123B6D' },
                  transition: 'color 0.2s ease',
                }}
              >
                {label}
              </Typography>
            </NextLink>
          ))}
        </Box>

        <Typography sx={{ color: '#94A3B8', fontSize: '0.82rem' }}>
          © 2026 SprintAI. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
