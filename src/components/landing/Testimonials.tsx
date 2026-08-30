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
        py: { xs: 7, md: 10 },
        borderTop: '1px solid #F0F0F0',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 7 } }}>
          <Typography
            component="h2"
            sx={{
              fontSize: { xs: '1.85rem', md: '2.75rem', lg: '3rem' },
              fontWeight: 800,
              color: '#071A2F',
              letterSpacing: '-0.03em',
              mb: 1.25,
            }}
          >
            See what our users say
          </Typography>
          <Typography sx={{ color: '#64748B', fontSize: '1rem' }}>
            Built to make studying easier.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' },
            gap: 2.5,
          }}
        >
          {testimonials.slice(start, start + VISIBLE).map((t, i) => (
            <Box
              key={`${start}-${i}`}
              sx={{
                bgcolor: 'white',
                borderRadius: '14px',
                border: '1px solid #E5E7EB',
                boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                transition: 'transform 0.22s ease, box-shadow 0.22s ease',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 10px 28px rgba(18,59,109,0.09)',
                },
              }}
            >
              <Typography
                sx={{
                  color: '#374151',
                  lineHeight: 1.7,
                  fontSize: '0.92rem',
                  flex: 1,
                  fontStyle: 'italic',
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </Typography>
              <Box>
                <Typography sx={{ fontWeight: 700, color: '#111827', fontSize: '0.88rem' }}>
                  — {t.name}
                </Typography>
                <Typography sx={{ fontSize: '0.76rem', color: '#64748B' }}>{t.role}</Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 3.5, gap: 1.5 }}>
          <Box sx={{ display: 'flex', gap: 0.6, flex: 1 }} role="tablist" aria-label="Testimonial pages">
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
                    width: active ? 22 : 8,
                    height: 8,
                    borderRadius: '4px',
                    bgcolor: active ? '#071A2F' : '#DCE4EE',
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
              bgcolor: canPrev ? 'white' : 'transparent',
              border: '1px solid #E5E7EB',
              color: canPrev ? '#071A2F' : '#CBD5E1',
              width: 36,
              height: 36,
              '&:hover': { bgcolor: '#EAF2FB' },
            }}
          >
            <FontAwesomeIcon icon={faChevronLeft} style={{ fontSize: '0.75rem' }} />
          </IconButton>

          <IconButton
            onClick={() => setStart((s) => s + 1)}
            disabled={!canNext}
            aria-label="Next testimonials"
            sx={{
              bgcolor: canNext ? '#071A2F' : 'transparent',
              border: '1px solid',
              borderColor: canNext ? 'transparent' : '#E5E7EB',
              color: canNext ? 'white' : '#CBD5E1',
              width: 36,
              height: 36,
              '&:hover': { bgcolor: canNext ? '#123B6D' : 'transparent' },
            }}
          >
            <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: '0.75rem' }} />
          </IconButton>
        </Box>
      </Container>
    </Box>
  );
}
