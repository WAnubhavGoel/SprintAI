import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import UploadSection from '@/components/landing/UploadSection';
import Testimonials from '@/components/landing/Testimonials';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <main>
      {/* Top-to-middle Navy Blue gradient wash matching Turbo.ai reference */}
      <div className="bg-gradient-to-b from-[#b4d2f5]/70 via-[#dceafc]/35 to-transparent">
        <Navbar />
        <Hero />
      </div>
      <UploadSection />
      <Testimonials />
      <CTASection />
      <Footer />
    </main>
  );
}
