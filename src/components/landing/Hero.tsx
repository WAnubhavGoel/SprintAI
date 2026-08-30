'use client';
import NextLink from 'next/link';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

// Decorative document rows shown inside the video placeholder card.
// Replace this entire inner box with a <video /> or iframe later.
function DemoPreview() {
  const rows = [
    { name: 'Lecture Notes.pdf', color: '#EAF2FB' },
    { name: 'System Design.docx', color: '#F0F4FF' },
    { name: 'Database Chapter 3.pdf', color: '#EAF2FB' },
  ];
  return (
    <Box sx={{ px: { xs: 3, md: 4 }, pt: { xs: 3, md: 4 }, pb: 3 }}>
      {rows.map((row, i) => (
        <Box
          key={i}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: 1.5,
            mb: 1.5,
            bgcolor: 'white',
            borderRadius: '10px',
            border: '1px solid #DCE4EE',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: '8px',
              bgcolor: row.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 20" fill="none" aria-hidden="true">
              <path d="M9 0H2C1 0 0 1 0 2v16c0 1 1 2 2 2h12c1 0 2-1 2-2V5L9 0z" fill="#1E5AA8" opacity="0.2" />
              <path d="M9 0v5h5" stroke="#1E5AA8" strokeWidth="1.5" fill="none" />
            </svg>
          </Box>
          <Typography sx={{ fontSize: '0.85rem', color: '#374151', fontWeight: 500 }}>
            {row.name}
          </Typography>
        </Box>
      ))}
      <Box
        sx={{
          mt: 2.5,
          p: 1.75,
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #123B6D 0%, #1E5AA8 100%)',
          textAlign: 'center',
        }}
      >
        <Typography sx={{ color: 'white', fontSize: '0.88rem', fontWeight: 600, letterSpacing: '0.01em' }}>
          ✦ Generating study notes...
        </Typography>
      </Box>
    </Box>
  );
}

// Polished placeholder card for the demo video.
// To insert the real video, replace <DemoPreview /> with a <video> or iframe.
function VideoPlaceholderCard() {
  return (
    <Box
      sx={{
        position: 'relative',
        // Soft blue glow behind the card
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: '-30px',
          borderRadius: '28px',
          background: 'radial-gradient(ellipse at 60% 40%, rgba(59,130,246,0.14) 0%, transparent 65%)',
          zIndex: 0,
          pointerEvents: 'none',
        },
      }}
    >
      <Box
        aria-label="SprintAI product demo"
        sx={{
          position: 'relative',
          zIndex: 1,
          bgcolor: 'white',
          borderRadius: '20px',
          border: '1px solid #DCE4EE',
          boxShadow: '0 20px 60px rgba(18,59,109,0.11), 0 4px 16px rgba(0,0,0,0.05)',
          overflow: 'hidden',
          // To insert a 16:10 video, set this container's aspect ratio and place <video> inside.
          minHeight: { xs: 260, md: 340 },
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 28px 70px rgba(18,59,109,0.15)',
          },
        }}
      >
        {/* Header bar */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            px: 2,
            py: 1.5,
            borderBottom: '1px solid #F0F4F8',
            bgcolor: '#FAFCFF',
          }}
        >
          {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
            <Box key={c} sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: c }} />
          ))}
          <Box sx={{ ml: 1, px: 2, py: 0.5, bgcolor: '#F0F4F8', borderRadius: '6px', flex: 1, maxWidth: 200 }}>
            <Typography sx={{ fontSize: '0.72rem', color: '#94A3B8', textAlign: 'center' }}>
              sprintai.app/notes/...
            </Typography>
          </Box>
        </Box>
        {/* Demo content — replace with video */}
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
        minHeight: '88vh',
        display: 'flex',
        alignItems: 'center',
        background: 'radial-gradient(ellipse 90% 70% at 50% -10%, rgba(59,130,246,0.07) 0%, transparent 65%), #F7F9FC',
        pt: { xs: 6, md: 4 },
        pb: { xs: 8, md: 6 },
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: { xs: 7, md: 8, lg: 10 },
            alignItems: 'center',
          }}
        >
          {/* Left: headline + CTA */}
          <Box>
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: '2.75rem', sm: '3.5rem', md: '4.25rem', lg: '5rem' },
                fontWeight: 800,
                letterSpacing: '-0.04em',
                lineHeight: 1.08,
                color: '#071A2F',
                mb: 3,
              }}
            >
              Learn smarter.{' '}
              <Box component="span" sx={{ color: '#3B82F6' }}>
                Study faster.
              </Box>
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: '1.05rem', md: '1.15rem' },
                color: '#64748B',
                lineHeight: 1.75,
                mb: 4.5,
                maxWidth: 440,
              }}
            >
              Upload your documents and notes, and let SprintAI turn them into
              focused, interactive study material — so you understand more in
              less time.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
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
                  px: { xs: 3.5, md: 4.5 },
                  py: { xs: 1.5, md: 1.85 },
                  fontSize: { xs: '1rem', md: '1.05rem' },
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1.5,
                  boxShadow: '0 4px 20px rgba(7,26,47,0.22)',
                  '&:hover': {
                    bgcolor: '#123B6D',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 10px 30px rgba(7,26,47,0.28)',
                  },
                  transition: 'all 0.25s ease',
                }}
              >
                Get started
                <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '0.9rem' }} />
              </Button>

              <Typography sx={{ fontSize: '0.875rem', color: '#94A3B8' }}>
                Turn your notes into learning. No credit card required.
              </Typography>
            </Box>
          </Box>

          {/* Right: product demo / video placeholder */}
          <VideoPlaceholderCard />
        </Box>
      </Container>
    </Box>
  );
}
