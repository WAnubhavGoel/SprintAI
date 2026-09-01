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
        Top-to-middle Navy Blue gradient wash — matches Turbo.ai reference
        starts richer at the top and softly fades down into the coarse paper base
      */}
      <Box
        sx={{
          background: `linear-gradient(
            180deg,
            rgba(180, 210, 245, 0.72) 0%,
            rgba(198, 222, 248, 0.52) 22%,
            rgba(218, 234, 252, 0.32) 48%,
            rgba(238, 245, 254, 0.12) 75%,
            rgba(247, 249, 252, 0) 100%
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
