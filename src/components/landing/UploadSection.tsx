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
        border: '1px solid #DCE4EE',
        boxShadow: '0 8px 40px rgba(18,59,109,0.08)',
        p: { xs: 3, md: 4 },
        maxWidth: 480,
        ml: { md: 'auto' },
        transition: 'box-shadow 0.3s ease',
        '&:hover': { boxShadow: '0 14px 50px rgba(18,59,109,0.12)' },
      }}
    >
      {/* Dashed drop zone */}
      <Box
        role="presentation"
        aria-label="File upload area"
        sx={{
          border: '2px dashed #DCE4EE',
          borderRadius: '14px',
          p: 3.5,
          mb: 3,
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
        <Box sx={{ color: '#3B82F6', fontSize: '2.2rem', mb: 1.5, lineHeight: 1 }}>
          <FontAwesomeIcon icon={faCloudArrowUp} />
        </Box>
        <Typography sx={{ fontWeight: 700, color: '#111827', fontSize: '1rem', mb: 0.5 }}>
          Upload your study material
        </Typography>
        <Typography sx={{ fontSize: '0.83rem', color: '#64748B' }}>
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
            gap: 2,
            p: 2,
            mb: i < fileTypes.length - 1 ? 1.5 : 0,
            borderRadius: '12px',
            border: '1px solid #DCE4EE',
            bgcolor: '#FAFCFF',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
              borderColor: '#3B82F6',
              boxShadow: '0 4px 14px rgba(59,130,246,0.1)',
            },
          }}
        >
          <Box
            aria-hidden="true"
            sx={{
              width: 44,
              height: 44,
              borderRadius: '10px',
              bgcolor: '#EAF2FB',
              color: '#123B6D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              fontSize: '1.2rem',
            }}
          >
            <FontAwesomeIcon icon={item.icon} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 700, color: '#111827', fontSize: '0.95rem', mb: 0.25 }}>
              {item.label}
            </Typography>
            <Typography sx={{ fontSize: '0.8rem', color: '#64748B' }}>
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
        py: { xs: 8, md: 12 },
        bgcolor: 'white',
        borderTop: '1px solid #F0F4F8',
      }}
    >
      <Container maxWidth="xl">
        {/* Section heading */}
        <Typography
          component="h2"
          sx={{
            textAlign: 'center',
            fontSize: { xs: '2rem', md: '3rem', lg: '3.5rem' },
            fontWeight: 800,
            color: '#071A2F',
            letterSpacing: '-0.03em',
            mb: { xs: 6, md: 10 },
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
            gap: { xs: 6, md: 10 },
            alignItems: 'center',
          }}
        >
          {/* Left: feature list */}
          <Box>
            <Box sx={{ borderLeft: '3px solid #3B82F6', pl: 3, mb: 4 }}>
              <Typography
                component="h3"
                sx={{ fontWeight: 700, color: '#111827', fontSize: '1.2rem', mb: 1 }}
              >
                Upload your study material
              </Typography>
              <Typography sx={{ color: '#64748B', lineHeight: 1.8, fontSize: '1rem' }}>
                Add your PDFs, lecture slides, or notes — anything you study
                from. SprintAI reads and understands your actual material.
              </Typography>
            </Box>

            <Box sx={{ borderLeft: '3px solid #DCE4EE', pl: 3 }}>
              <Typography
                component="h3"
                sx={{ fontWeight: 700, color: '#64748B', fontSize: '1.1rem', mb: 1 }}
              >
                Learn the smart way
              </Typography>
              <Typography sx={{ color: '#94A3B8', lineHeight: 1.8, fontSize: '1rem' }}>
                Get exhaustive study notes, a targeted quiz, and an AI that
                answers your specific questions — all grounded in your own
                material.
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
