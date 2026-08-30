import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

// Company/university names rendered as styled text logos.
// These could later be replaced with actual SVG logos.
const logos = [
  'Oxford',
  'Texas',
  'Google',
  'Princeton',
  'Goldman Sachs',
  'MIT',
  'McKinsey',
  'Deloitte',
  'Duke',
];

export default function TrustedBy() {
  return (
    <Box
      component="section"
      aria-label="Trusted by leading institutions"
      sx={{
        py: { xs: 3, md: 4 },
        borderTop: '1px solid #F0F0F0',
        borderBottom: '1px solid #F0F0F0',
      }}
    >
      <Container maxWidth="lg">
        <Typography
          sx={{
            textAlign: 'center',
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: '#94A3B8',
            mb: 3,
          }}
        >
          Trusted by students at leading institutions worldwide
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: { xs: 3, sm: 4, md: 5 },
            flexWrap: 'wrap',
            overflow: 'hidden',
          }}
        >
          {logos.map((name) => (
            <Typography
              key={name}
              sx={{
                fontSize: { xs: '0.8rem', sm: '0.95rem', md: '1.05rem' },
                fontWeight: 700,
                color: '#CBD5E1',
                letterSpacing: '-0.01em',
                whiteSpace: 'nowrap',
                userSelect: 'none',
              }}
            >
              {name}
            </Typography>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
