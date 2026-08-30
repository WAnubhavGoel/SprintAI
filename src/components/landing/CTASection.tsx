'use client';
import NextLink from 'next/link';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

export default function CTASection() {
  return (
    <Box
      component="section"
      aria-label="Get started"
      sx={{
        py: { xs: 7, md: 9 },
        borderTop: '1px solid #F0F0F0',
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            bgcolor: 'white',
            borderRadius: '22px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 6px 40px rgba(18,59,109,0.07)',
            p: { xs: 4, sm: 6, md: 8 },
            textAlign: 'center',
          }}
        >
          <Typography
            component="h2"
            sx={{
              fontSize: { xs: '1.85rem', sm: '2.5rem', md: '3rem' },
              fontWeight: 800,
              color: '#071A2F',
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              mb: 2,
            }}
          >
            Ready to{' '}
            <Box component="span" sx={{ color: '#3B82F6' }}>
              study smarter?
            </Box>
          </Typography>

          <Typography
            sx={{
              color: '#64748B',
              fontSize: { xs: '0.95rem', md: '1.05rem' },
              lineHeight: 1.75,
              mb: 4,
              maxWidth: 440,
              mx: 'auto',
            }}
          >
            Turn your study material into a focused learning experience with SprintAI.
          </Typography>

          <Button
            component={NextLink}
            href="/signup"
            variant="contained"
            size="large"
            aria-label="Get started with SprintAI"
            sx={{
              bgcolor: '#071A2F',
              color: 'white',
              borderRadius: '50px',
              px: { xs: 3.5, md: 5 },
              py: { xs: 1.4, md: 1.75 },
              fontSize: { xs: '0.95rem', md: '1rem' },
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.5,
              boxShadow: '0 4px 18px rgba(7,26,47,0.18)',
              '&:hover': {
                bgcolor: '#123B6D',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 28px rgba(7,26,47,0.24)',
              },
              transition: 'all 0.25s ease',
            }}
          >
            Get started
            <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '0.85rem' }} />
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
