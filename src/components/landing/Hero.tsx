'use client';
import NextLink from 'next/link';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

// The demo preview inside the browser card — replace with <video> when ready.
function DemoPreview() {
  const rows = [
    { name: 'Lecture Notes.pdf' },
    { name: 'System Design.docx' },
    { name: 'Database Chapter 3.pdf' },
  ];
  return (
    <Box sx={{ px: { xs: 2.5, md: 3.5 }, pt: { xs: 2.5, md: 3 }, pb: 2.5 }}>
      {rows.map((row, i) => (
        <Box
          key={i}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: 1.5,
            mb: 1.25,
            bgcolor: 'white',
            borderRadius: '10px',
            border: '1px solid #E5E7EB',
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '7px',
              bgcolor: '#EAF2FB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 20" fill="none" aria-hidden="true">
              <path d="M9 0H2C1 0 0 1 0 2v16c0 1 1 2 2 2h12c1 0 2-1 2-2V5L9 0z" fill="#1E5AA8" opacity="0.25" />
              <path d="M9 0v5h5" stroke="#1E5AA8" strokeWidth="1.5" fill="none" />
            </svg>
          </Box>
          <Typography sx={{ fontSize: '0.84rem', color: '#374151', fontWeight: 500 }}>
            {row.name}
          </Typography>
        </Box>
      ))}
      <Box
        sx={{
          mt: 2,
          p: 1.5,
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #071A2F 0%, #123B6D 100%)',
          textAlign: 'center',
        }}
      >
        <Typography sx={{ color: 'white', fontSize: '0.85rem', fontWeight: 600 }}>
          ✦ Generating study notes...
        </Typography>
      </Box>
    </Box>
  );
}

function VideoPlaceholderCard() {
  return (
    <Box
      sx={{
        position: 'relative',
        maxWidth: { xs: '100%', md: 420 },
        ml: { md: 'auto' },
      }}
    >
      <Box
        aria-label="SprintAI product demo"
        sx={{
          position: 'relative',
          zIndex: 1,
          bgcolor: '#F9FAFB',
          borderRadius: '16px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 20px 50px rgba(7,26,47,0.1), 0 4px 12px rgba(0,0,0,0.04)',
          overflow: 'hidden',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 28px 60px rgba(7,26,47,0.14)',
          },
        }}
      >
        {/* Browser chrome bar */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            px: 1.75,
            py: 1.25,
            borderBottom: '1px solid #F0F0F0',
            bgcolor: '#FAFAFA',
          }}
        >
          {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
            <Box key={c} sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: c }} />
          ))}
          <Box sx={{ ml: 1, px: 2, py: 0.4, bgcolor: '#F0F0F0', borderRadius: '5px', flex: 1, maxWidth: 180 }}>
            <Typography sx={{ fontSize: '0.68rem', color: '#94A3B8', textAlign: 'center' }}>
              sprintai.app/notes/...
            </Typography>
          </Box>
        </Box>
        <DemoPreview />
      </Box>
    </Box>
  );
}

export default function Hero() {
  return (
    <Box
      component="section"
      aria-label="Hero"
      sx={{
        minHeight: { xs: 'auto', md: '85vh' },
        display: 'flex',
        alignItems: 'center',
        pt: { xs: 6, md: 4 },
        pb: { xs: 6, md: 4 },
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' },
            gap: { xs: 5, md: 6 },
            alignItems: 'center',
          }}
        >
          {/* Left column */}
          <Box>
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: '2.6rem', sm: '3.2rem', md: '3.8rem', lg: '4.2rem' },
                fontWeight: 800,
                letterSpacing: '-0.04em',
                lineHeight: 1.08,
                color: '#071A2F',
                mb: 2.5,
              }}
            >
              Learn smarter.
              <br />
              <Box component="span" sx={{ color: '#3B82F6' }}>
                Study faster.
              </Box>
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: '0.98rem', md: '1.08rem' },
                color: '#64748B',
                lineHeight: 1.75,
                mb: 4,
                maxWidth: 420,
              }}
            >
              Upload your documents and notes, and let SprintAI turn them into
              focused, interactive study material — so you understand more in less time.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1.75 }}>
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
                  px: { xs: 3.5, md: 4 },
                  py: { xs: 1.4, md: 1.6 },
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1.5,
                  boxShadow: '0 4px 18px rgba(7,26,47,0.2)',
                  '&:hover': {
                    bgcolor: '#123B6D',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 28px rgba(7,26,47,0.26)',
                  },
                  transition: 'all 0.25s ease',
                }}
              >
                Get started
                <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '0.85rem' }} />
              </Button>

              <Typography sx={{ fontSize: '0.84rem', color: '#94A3B8' }}>
                Turn your notes into learning. No credit card required.
              </Typography>
            </Box>
          </Box>

          {/* Right column */}
          <VideoPlaceholderCard />
        </Box>
      </Container>
    </Box>
  );
}
