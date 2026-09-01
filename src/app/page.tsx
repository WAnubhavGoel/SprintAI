import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import UploadSection from '@/components/landing/UploadSection';
import Testimonials from '@/components/landing/Testimonials';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <UploadSection />
      <Testimonials />
      <CTASection />
      <Footer />
    </main>
  );
}
