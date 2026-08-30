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
        py: { xs: 8, md: 10 },
        bgcolor: '#F7F9FC',
        borderTop: '1px solid #F0F4F8',
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            bgcolor: 'white',
            borderRadius: '24px',
            border: '1px solid #DCE4EE',
            boxShadow: '0 8px 48px rgba(18,59,109,0.08)',
            p: { xs: 5, sm: 7, md: 9 },
            textAlign: 'center',
          }}
        >
          <Typography
            component="h2"
            sx={{
              fontSize: { xs: '2rem', sm: '2.75rem', md: '3.25rem' },
              fontWeight: 800,
              color: '#071A2F',
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              mb: 2.5,
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
              fontSize: { xs: '1rem', md: '1.1rem' },
              lineHeight: 1.75,
              mb: 4.5,
              maxWidth: 480,
              mx: 'auto',
            }}
          >
            Turn your study material into a focused learning experience
            with SprintAI.
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
              px: { xs: 4, md: 5.5 },
              py: { xs: 1.6, md: 2 },
              fontSize: { xs: '1rem', md: '1.05rem' },
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.5,
              boxShadow: '0 4px 20px rgba(7,26,47,0.2)',
              '&:hover': {
                bgcolor: '#123B6D',
                transform: 'translateY(-2px)',
                boxShadow: '0 10px 32px rgba(7,26,47,0.26)',
              },
              transition: 'all 0.25s ease',
            }}
          >
            Get started
            <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '0.9rem' }} />
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
