import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// Muted blue-gray — matches the reference's greyed-out logo treatment
const C = '#9aafc4';

// ── SVG logo components ────────────────────────────────────────────────────────
// Each logo approximates the visual weight of the real wordmark.
// The muted color is intentional — matching the reference's greyed-out aesthetic.

function LogoMIT() {
  return (
    <svg viewBox="0 0 78 42" height="38" aria-label="MIT" style={{ display: 'block' }}>
      <text x="2" y="36" fontFamily='"Arial Black", "Arial Bold", Arial, sans-serif'
        fontSize="34" fontWeight="900" fill={C} letterSpacing="3">MIT</text>
    </svg>
  );
}

function LogoGoogle() {
  return (
    <svg viewBox="0 0 118 40" height="36" aria-label="Google" style={{ display: 'block' }}>
      <text x="0" y="30" fontFamily='Arial, sans-serif' fontSize="28" fontWeight="700" fill={C}>Google</text>
    </svg>
  );
}

function LogoPrinceton() {
  return (
    <svg viewBox="0 0 152 46" height="42" aria-label="Princeton University" style={{ display: 'block' }}>
      <text x="0" y="20" fontFamily='Georgia, serif' fontSize="15" fontWeight="700" fill={C} letterSpacing="0.5">PRINCETON</text>
      <text x="0" y="40" fontFamily='Georgia, serif' fontSize="15" fontWeight="400" fill={C} letterSpacing="1.5">UNIVERSITY</text>
    </svg>
  );
}

function LogoGoldman() {
  return (
    <svg viewBox="0 0 108 46" height="42" aria-label="Goldman Sachs" style={{ display: 'block' }}>
      <text x="0" y="20" fontFamily='Arial, sans-serif' fontSize="15" fontWeight="700" fill={C} letterSpacing="0.3">Goldman</text>
      <text x="0" y="40" fontFamily='Arial, sans-serif' fontSize="15" fontWeight="700" fill={C} letterSpacing="0.3">Sachs</text>
    </svg>
  );
}

function LogoMcKinsey() {
  return (
    <svg viewBox="0 0 148 46" height="42" aria-label="McKinsey and Company" style={{ display: 'block' }}>
      <text x="0" y="20" fontFamily='Arial, sans-serif' fontSize="15" fontWeight="700" fill={C}>McKinsey</text>
      <text x="0" y="40" fontFamily='Arial, sans-serif' fontSize="13" fontWeight="400" fill={C} letterSpacing="0.5">&amp; Company</text>
    </svg>
  );
}

function LogoDeloitte() {
  return (
    <svg viewBox="0 0 130 40" height="36" aria-label="Deloitte" style={{ display: 'block' }}>
      <text x="0" y="30" fontFamily='Arial, sans-serif' fontSize="26" fontWeight="700" fill={C}>Deloitte</text>
      <circle cx="121" cy="30" r="3.5" fill={C} />
    </svg>
  );
}

function LogoDuke() {
  return (
    <svg viewBox="0 0 108 46" height="42" aria-label="Duke University" style={{ display: 'block' }}>
      <text x="0" y="20" fontFamily='Georgia, serif' fontSize="18" fontWeight="700" fill={C} letterSpacing="1">DUKE</text>
      <text x="0" y="40" fontFamily='Georgia, serif' fontSize="13" fontWeight="400" fill={C} letterSpacing="1">UNIVERSITY</text>
    </svg>
  );
}

function LogoOxford() {
  return (
    <svg viewBox="0 0 168 46" height="42" aria-label="University of Oxford" style={{ display: 'block' }}>
      <text x="0" y="20" fontFamily='Georgia, serif' fontSize="12" fontWeight="400" fill={C} letterSpacing="1.5">UNIVERSITY OF</text>
      <text x="0" y="40" fontFamily='Georgia, serif' fontSize="20" fontWeight="700" fill={C} letterSpacing="1">OXFORD</text>
    </svg>
  );
}

function LogoTexas() {
  return (
    <svg viewBox="0 0 128 46" height="42" aria-label="University of Texas" style={{ display: 'block' }}>
      {/* Shield outline */}
      <path d="M8 4 L22 4 L22 26 L15 34 L8 26 Z" stroke={C} strokeWidth="1.8" fill="none" />
      <text x="28" y="20" fontFamily='Georgia, serif' fontSize="16" fontWeight="700" fill={C} letterSpacing="1">TEXAS</text>
      <text x="28" y="38" fontFamily='Georgia, serif' fontSize="10" fontWeight="400" fill={C} letterSpacing="0.5">University</text>
    </svg>
  );
}

// Ordered set of logos — rendered twice for seamless loop
const logoComponents = [
  <LogoTexas key="texas" />,
  <LogoGoogle key="google" />,
  <LogoPrinceton key="princeton" />,
  <LogoGoldman key="goldman" />,
  <LogoMIT key="mit" />,
  <LogoMcKinsey key="mckinsey" />,
  <LogoDeloitte key="deloitte" />,
  <LogoDuke key="duke" />,
  <LogoOxford key="oxford" />,
];

export default function TrustedBy() {
  return (
    <Box
      component="section"
      aria-label="Trusted by students at leading institutions"
      sx={{
        py: { xs: 3.5, md: 4.5 },
        bgcolor: 'white',
        borderTop: '1px solid #F0F4F8',
        borderBottom: '1px solid #F0F4F8',
      }}
    >
      {/* Heading */}
      <Typography
        sx={{
          textAlign: 'center',
          fontSize: '0.67rem',
          fontWeight: 700,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#94A3B8',
          mb: 3,
          px: 2,
        }}
      >
        Trusted by students at leading institutions worldwide
      </Typography>

      {/*
        Marquee wrapper — full viewport width, clips overflow.
        Left and right fade gradients via CSS mask-image.
        The track is duplicated (2× logos) so the loop is seamless.
        animation: marquee (defined in globals.css) 38s linear infinite
      */}
      <Box
        className="marquee-wrapper"
        sx={{
          position: 'relative',
          overflow: 'hidden',
          // Fade edges so logos softly appear/disappear
          maskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
        }}
      >
        {/* Marquee track — two identical sets for seamless infinite scroll */}
        <Box
          className="marquee-track"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '4.5rem',
            width: 'max-content',
            animation: 'marquee 38s linear infinite',
            py: 0.5,
          }}
        >
          {/* Set 1 */}
          {logoComponents.map((logo, i) => (
            <Box key={`a-${i}`} sx={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
              {logo}
            </Box>
          ))}
          {/* Set 2 — exact duplicate for seamless loop (aria-hidden: screen readers skip) */}
          {logoComponents.map((logo, i) => (
            <Box key={`b-${i}`} aria-hidden="true" sx={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
              {logo}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
