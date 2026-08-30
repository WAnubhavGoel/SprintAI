'use client';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const testimonials = [
  {
    quote:
      'SprintAI completely changed how I revise. I upload my lecture notes and within minutes I have a structured summary and a quiz. My exam prep used to take days — now it takes hours.',
    name: 'Priya M.',
    role: 'Computer Science Student',
  },
  {
    quote:
      "I struggled to make sense of dense textbook chapters. SprintAI breaks them into clear, organized notes that actually make sense. It's like having a personal tutor available 24/7.",
    name: 'James L.',
    role: 'Engineering Student',
  },
  {
    quote:
      'The quiz feature is incredible. After uploading a PDF, I get 10 targeted questions that test real understanding — not just surface recall. It genuinely helps me retain the material.',
    name: 'Aisha K.',
    role: 'Medical Student',
  },
  {
    quote:
      'I used to feel overwhelmed by the volume of reading each week. SprintAI gives me the key points I need to focus on. My grades have improved noticeably since I started using it.',
    name: 'Tom R.',
    role: 'Business Student',
  },
  {
    quote:
      "Being able to ask questions directly about my uploaded notes is a game changer. I don't have to search through endless pages — SprintAI finds the answer in seconds.",
    name: 'Sofia D.',
    role: 'Law Student',
  },
];

const VISIBLE = 3;

export default function Testimonials() {
  const [start, setStart] = useState(0);

  const canPrev = start > 0;
  const canNext = start + VISIBLE < testimonials.length;

  return (
    <Box
      component="section"
      aria-label="User testimonials"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: '#F7F9FC',
        borderTop: '1px solid #F0F4F8',
      }}
    >
      <Container maxWidth="xl">
        {/* Heading */}
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
          <Typography
            component="h2"
            sx={{
              fontSize: { xs: '2rem', md: '3rem', lg: '3.5rem' },
              fontWeight: 800,
              color: '#071A2F',
              letterSpacing: '-0.03em',
              mb: 1.5,
            }}
          >
            See what our users say
          </Typography>
          <Typography sx={{ color: '#64748B', fontSize: '1.05rem' }}>
            Built to make studying easier.
          </Typography>
        </Box>

        {/* Cards */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' },
            gap: 3,
          }}
        >
          {testimonials.slice(start, start + VISIBLE).map((t, i) => (
            <Box
              key={`${start}-${i}`}
              sx={{
                bgcolor: 'white',
                borderRadius: '16px',
                border: '1px solid #DCE4EE',
                boxShadow: '0 2px 12px rgba(0,0,0,0.045)',
                p: 3.5,
                display: 'flex',
                flexDirection: 'column',
                gap: 2.5,
                transition: 'transform 0.22s ease, box-shadow 0.22s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 32px rgba(18,59,109,0.1)',
                },
              }}
            >
              <Typography
                sx={{
                  color: '#374151',
                  lineHeight: 1.75,
                  fontSize: '0.95rem',
                  flex: 1,
                  fontStyle: 'italic',
                }}
              >
                "{t.quote}"
              </Typography>
              <Box>
                <Typography sx={{ fontWeight: 700, color: '#111827', fontSize: '0.9rem' }}>
                  — {t.name}
                </Typography>
                <Typography sx={{ fontSize: '0.78rem', color: '#64748B' }}>{t.role}</Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 4, gap: 2 }}>
          {/* Pagination dots */}
          <Box sx={{ display: 'flex', gap: 0.75, flex: 1 }} role="tablist" aria-label="Testimonial pages">
            {testimonials.map((_, i) => {
              const active = i >= start && i < start + VISIBLE;
              return (
                <Box
                  key={i}
                  role="tab"
                  aria-selected={active}
                  tabIndex={0}
                  onClick={() => setStart(Math.min(i, testimonials.length - VISIBLE))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ')
                      setStart(Math.min(i, testimonials.length - VISIBLE));
                  }}
                  sx={{
                    width: active ? 24 : 8,
                    height: 8,
                    borderRadius: '4px',
                    bgcolor: active ? '#123B6D' : '#DCE4EE',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    outline: 'none',
                    '&:focus-visible': { ring: 2, ringColor: '#3B82F6' },
                  }}
                />
              );
            })}
          </Box>

          <IconButton
            onClick={() => setStart((s) => s - 1)}
            disabled={!canPrev}
            aria-label="Previous testimonials"
            sx={{
              bgcolor: canPrev ? 'white' : '#F7F9FC',
              border: '1px solid #DCE4EE',
              color: canPrev ? '#123B6D' : '#CBD5E1',
              width: 40,
              height: 40,
              '&:hover': { bgcolor: '#EAF2FB' },
            }}
          >
            <FontAwesomeIcon icon={faChevronLeft} style={{ fontSize: '0.8rem' }} />
          </IconButton>

          <IconButton
            onClick={() => setStart((s) => s + 1)}
            disabled={!canNext}
            aria-label="Next testimonials"
            sx={{
              bgcolor: canNext ? '#123B6D' : '#F7F9FC',
              border: '1px solid',
              borderColor: canNext ? 'transparent' : '#DCE4EE',
              color: canNext ? 'white' : '#CBD5E1',
              width: 40,
              height: 40,
              '&:hover': { bgcolor: canNext ? '#071A2F' : '#F7F9FC' },
            }}
          >
            <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: '0.8rem' }} />
          </IconButton>
        </Box>
      </Container>
    </Box>
  );
}
