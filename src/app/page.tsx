import Box from '@mui/material/Box';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import UploadSection from '@/components/landing/UploadSection';
import Testimonials from '@/components/landing/Testimonials';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <main>
      {/*
        Navy blue gradient zone — covers the navbar + hero section exactly like
        turbo.ai's purple wash covers its top half. Fades smoothly to the page
        background (#f7f9fc) so the transition to white sections is invisible.
      */}
      <Box
        sx={{
          background: `linear-gradient(
            180deg,
            #c0d8f2 0%,
            #cfe1f6 18%,
            #dceaf9 38%,
            #ecf4fc 58%,
            #f7f9fc 78%
          )`,
        }}
      >
        <Navbar />
        <Hero />
      </Box>
      <UploadSection />
      <Testimonials />
      <CTASection />
      <Footer />
    </main>
  );
}
