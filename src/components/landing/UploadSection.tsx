'use client';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faNoteSticky, faCloudArrowUp } from '@fortawesome/free-solid-svg-icons';

const fileTypes = [
  {
    icon: faFilePdf,
    label: 'PDF Documents',
    desc: 'Textbooks, lecture slides, study guides',
  },
  {
    icon: faNoteSticky,
    label: 'Your Notes',
    desc: 'Handwritten or typed notes in any format',
  },
];

function UploadCard() {
  return (
    <Box
      sx={{
        bgcolor: 'white',
        borderRadius: '20px',
        border: '1px solid #E5E7EB',
        boxShadow: '0 8px 36px rgba(18,59,109,0.07)',
        p: { xs: 2.5, md: 3.5 },
        maxWidth: 420,
        ml: { md: 'auto' },
        transition: 'box-shadow 0.3s ease',
        '&:hover': { boxShadow: '0 14px 50px rgba(18,59,109,0.11)' },
      }}
    >
      {/* Dashed drop zone */}
      <Box
        role="presentation"
        aria-label="File upload area"
        sx={{
          border: '2px dashed #DCE4EE',
          borderRadius: '14px',
          p: 3,
          mb: 2.5,
          textAlign: 'center',
          background: 'linear-gradient(135deg, #F7F9FC 0%, #EAF2FB 100%)',
          transition: 'border-color 0.2s ease, background 0.2s ease',
          cursor: 'pointer',
          '&:hover': {
            borderColor: '#3B82F6',
            background: 'linear-gradient(135deg, #EAF2FB 0%, #DBEAFE 100%)',
          },
        }}
      >
        <Box sx={{ color: '#3B82F6', fontSize: '2rem', mb: 1.25, lineHeight: 1 }}>
          <FontAwesomeIcon icon={faCloudArrowUp} />
        </Box>
        <Typography sx={{ fontWeight: 700, color: '#111827', fontSize: '0.95rem', mb: 0.5 }}>
          Upload your study material
        </Typography>
        <Typography sx={{ fontSize: '0.8rem', color: '#64748B' }}>
          Drag & drop or click to browse
        </Typography>
      </Box>

      {/* File type rows */}
      {fileTypes.map((item, i) => (
        <Box
          key={i}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.75,
            p: 1.75,
            mb: i < fileTypes.length - 1 ? 1.25 : 0,
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
            bgcolor: '#FAFCFF',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
              borderColor: '#3B82F6',
              boxShadow: '0 4px 14px rgba(59,130,246,0.08)',
            },
          }}
        >
          <Box
            aria-hidden="true"
            sx={{
              width: 40,
              height: 40,
              borderRadius: '10px',
              bgcolor: '#EAF2FB',
              color: '#123B6D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              fontSize: '1.1rem',
            }}
          >
            <FontAwesomeIcon icon={item.icon} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 700, color: '#111827', fontSize: '0.9rem', mb: 0.15 }}>
              {item.label}
            </Typography>
            <Typography sx={{ fontSize: '0.78rem', color: '#64748B' }}>
              {item.desc}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export default function UploadSection() {
  return (
    <Box
      component="section"
      aria-label="Upload your study material"
      sx={{
        py: { xs: 7, md: 10 },
        bgcolor: 'white',
        borderTop: '1px solid #F0F0F0',
      }}
    >
      <Container maxWidth="lg">
        {/* Section heading */}
        <Typography
          component="h2"
          sx={{
            textAlign: 'center',
            fontSize: { xs: '1.85rem', md: '2.75rem', lg: '3rem' },
            fontWeight: 800,
            color: '#071A2F',
            letterSpacing: '-0.03em',
            mb: { xs: 5, md: 8 },
          }}
        >
          SprintAI makes learning{' '}
          <Box component="span" sx={{ color: '#3B82F6' }}>
            simple.
          </Box>
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: { xs: 5, md: 6 },
            alignItems: 'center',
          }}
        >
          {/* Left: feature list */}
          <Box>
            <Box sx={{ borderLeft: '3px solid #3B82F6', pl: 2.5, mb: 3.5 }}>
              <Typography
                component="h3"
                sx={{ fontWeight: 700, color: '#111827', fontSize: '1.15rem', mb: 0.75 }}
              >
                Upload your study material
              </Typography>
              <Typography sx={{ color: '#64748B', lineHeight: 1.75, fontSize: '0.95rem' }}>
                Add your PDFs, lecture slides, or notes — anything you study
                from. SprintAI reads and understands your actual material.
              </Typography>
            </Box>

            <Box sx={{ borderLeft: '3px solid #DCE4EE', pl: 2.5 }}>
              <Typography
                component="h3"
                sx={{ fontWeight: 700, color: '#64748B', fontSize: '1.05rem', mb: 0.75 }}
              >
                Learn the smart way
              </Typography>
              <Typography sx={{ color: '#94A3B8', lineHeight: 1.75, fontSize: '0.95rem' }}>
                Get exhaustive study notes, a targeted quiz, and an AI that
                answers your specific questions — all grounded in your own material.
              </Typography>
            </Box>
          </Box>

          {/* Right: visual upload card */}
          <UploadCard />
        </Box>
      </Container>
    </Box>
  );
}
