export const SITE = {
  name: 'Star Institute of Professionals',
  short: 'Star Institute',
  tagline: 'Inspired by Excellence … Driven by Professionalism',
  address: 'Maganjo House, 3rd & 4th Floors, Nyerere Avenue, Mombasa, Kenya',
  postal: 'P.O. Box 88169-80100, Mombasa',
  phone: '+254 704 978 271',
  phoneHref: 'tel:+254704978271',
  phoneAlt: '+254 41 222 0919',
  phoneAltHref: 'tel:+254412220919',
  email: 'starinstitute.msa@gmail.com',
  email2: 'info@sips.co.ke',
  elearning: 'https://softdatasolutions.co.ke/sipselearning',
  facebook: 'https://web.facebook.com/profile.php?id=100064088527608',
  instagram: 'https://www.instagram.com/starinstitute.msa/',
  legacySite: 'https://sips.co.ke/',
  founded: 2013,
  operations: '1st July 2013',
  hours: 'Mon–Fri 8:00 AM – 5:00 PM, Sat 8:00 AM – 1:00 PM',
  hoursShort: 'Mon–Fri 8:00–5:00 · Sat 8:00–1:00',
  mapEmbed:
    'https://www.google.com/maps?q=Maganjo+House,+Nyerere+Avenue,+Mombasa,+Kenya&output=embed',
};

export const NAV = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  {
    label: 'Courses',
    href: '/courses',
    children: [
      { label: 'Accounting & Finance', href: '/courses?category=Accounting+%26+Finance' },
      { label: 'Management', href: '/courses?category=Management' },
      { label: 'ICT & Computing', href: '/courses?category=ICT+%26+Computing' },
      { label: 'Cisco Network Academy', href: '/courses?category=Cisco+Network+Academy' },
      { label: 'Beauty & Cosmetology', href: '/courses?category=Beauty+%26+Cosmetology' },
      { label: 'Engineering', href: '/courses?category=Engineering' },
    ],
  },
  {
    label: 'Admissions',
    href: '/admissions',
    children: [
      { label: 'Admissions', href: '/admissions' },
      { label: 'Apply Now', href: '/apply' },
      { label: 'Fees & Downloads', href: '/downloads' },
      { label: 'Graduation Request', href: '/graduation' },
    ],
  },
  { label: 'Student Life', href: '/student-life' },
  {
    label: 'News & Events',
    href: '/news',
    children: [
      { label: 'News', href: '/news' },
      { label: 'Events', href: '/events' },
      { label: 'Gallery', href: '/gallery' },
    ],
  },
  { label: 'Facilities', href: '/facilities' },
  { label: 'Contact', href: '/contact' },
];

export const COURSE_CATEGORIES = [
  'Accounting & Finance',
  'Management',
  'ICT & Computing',
  'Cisco Network Academy',
  'Beauty & Cosmetology',
  'Engineering',
  'Consultancy & Training',
] as const;

export const CATEGORY_IMAGES: Record<string, string> = {
  'Accounting & Finance': '/images/accounting.jpg',
  Management: '/images/training.jpg',
  'ICT & Computing': '/images/lab.jpg',
  'Cisco Network Academy': '/images/networking.jpg',
  'Beauty & Cosmetology': '/images/beauty.jpg',
  Engineering: '/images/engineering.jpg',
  'Consultancy & Training': '/images/classroom.jpg',
};

export function categoryImage(category: string, fallback?: string | null): string {
  return fallback || CATEGORY_IMAGES[category] || '/images/classroom.jpg';
}
