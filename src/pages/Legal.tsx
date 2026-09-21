import { Link } from 'react-router-dom';
import { SITE } from '../lib/constants';
import { useSEO } from '../lib/seo';
import { PageHero } from '../components/ui';

export function Privacy() {
  useSEO({ title: 'Privacy Policy', description: 'Privacy policy of Star Institute of Professionals: how we collect, use and protect your personal information.', path: '/privacy' });
  return (
    <main id="main-content">
      <PageHero eyebrow="Legal" title="Privacy Policy" text="Last updated: September 2026." />
      <article className="container-x py-12 max-w-3xl prose-sip">
        <p>Star Institute of Professionals (“the Institute”, “we”) respects your privacy. This policy explains what personal information we collect through this website, how we use it, and your rights.</p>
        <h3>Information we collect</h3>
        <ul><li>Application details: name, contact information, academic history and programme choices.</li><li>Enquiries: name, email, phone and message content.</li><li>Graduation requests: student names, admission number and completion details.</li><li>Technical data: basic analytics such as pages visited (no advertising trackers).</li></ul>
        <h3>How we use it</h3>
        <ul><li>To process applications, enquiries and graduation requests.</li><li>To contact you about admissions, fees and reporting dates.</li><li>To improve our website and services.</li></ul>
        <p>We do not sell your personal information. Data is shared only with staff who need it to serve you, or where required by law.</p>
        <h3>Data security & retention</h3>
        <p>Submissions are transmitted securely and stored in access-controlled systems. Application records are retained per institutional policy; contact messages are kept only as long as needed to resolve your enquiry.</p>
        <h3>Your rights</h3>
        <p>You may request access, correction or deletion of your personal data by contacting {SITE.email} or visiting {SITE.address}.</p>
        <h3>Contact</h3>
        <p>Questions about this policy: <Link to="/contact" className="underline font-semibold">contact us</Link>.</p>
      </article>
    </main>
  );
}

export function Terms() {
  useSEO({ title: 'Terms of Use', description: 'Terms of use for the Star Institute of Professionals website.', path: '/terms' });
  return (
    <main id="main-content">
      <PageHero eyebrow="Legal" title="Terms of Use" text="Last updated: September 2026." />
      <article className="container-x py-12 max-w-3xl prose-sip">
        <p>By using this website you agree to these terms. If you do not agree, please do not use the site.</p>
        <h3>Website content</h3>
        <p>Programme details, fees and intake dates are published for guidance and may change. Confirmed information is issued by the admissions and accounts offices. Fee structures are labelled with the semester/year they apply to.</p>
        <h3>Applications</h3>
        <p>Submitting an online application does not guarantee admission. The Institute will contact applicants with admission decisions and next steps. Provide accurate information; false details may lead to cancellation.</p>
        <h3>Acceptable use</h3>
        <ul><li>Do not submit false, offensive or unlawful content through our forms.</li><li>Do not attempt to disrupt the website or access restricted areas.</li></ul>
        <h3>Intellectual property</h3>
        <p>Text, branding and imagery on this site belong to Star Institute of Professionals unless stated otherwise. You may download published PDFs for personal use.</p>
        <h3>External links</h3>
        <p>Links to external sites (eLearning portal, maps, social media) are provided for convenience; we are not responsible for their content.</p>
        <h3>Contact</h3>
        <p>Questions: <Link to="/contact" className="underline font-semibold">contact us</Link>.</p>
      </article>
    </main>
  );
}

export function Accessibility() {
  useSEO({ title: 'Accessibility Statement', description: 'Accessibility statement for the Star Institute of Professionals website: WCAG commitment, features and feedback.', path: '/accessibility' });
  return (
    <main id="main-content">
      <PageHero eyebrow="Legal" title="Accessibility Statement" text="Our commitment to an accessible digital experience." />
      <article className="container-x py-12 max-w-3xl prose-sip">
        <p>Star Institute of Professionals is committed to making this website usable by everyone, following the Web Content Accessibility Guidelines (WCAG) 2.1, Level AA.</p>
        <h3>Accessibility features</h3>
        <ul><li>Semantic HTML with proper headings, landmarks and skip-to-content link.</li><li>Full keyboard navigation with visible focus indicators.</li><li>Labelled form fields with clear error messages.</li><li>Sufficient colour contrast and resizable text.</li><li>Reduced-motion support for users who prefer it.</li><li>Alternative text for meaningful images.</li></ul>
        <h3>Feedback</h3>
        <p>If you encounter an accessibility barrier, please <Link to="/contact" className="underline font-semibold">contact us</Link> at {SITE.email} or {SITE.phone} and we will work to provide the content in an accessible format.</p>
      </article>
    </main>
  );
}
