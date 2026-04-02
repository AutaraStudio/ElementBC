'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { SanityNavLink } from '@/lib/sanity/queries';

const fallbackNavLinks: SanityNavLink[] = [
  { label: 'Home', url: '/' },
  { label: 'Projects', url: '/projects' },
  { label: 'About & Team', url: '/about' },
  { label: 'Services', url: '#' },
  { label: 'Contact', url: '#' },
];

interface FooterProps {
  navLinks?: SanityNavLink[];
  legalLinks?: SanityNavLink[];
  builtByText?: string;
  builtByUrl?: string;
}

export default function Footer({ navLinks: sanityNavLinks, legalLinks, builtByText, builtByUrl }: FooterProps) {
  const pathname = usePathname();
  const footerNavLinks = sanityNavLinks ?? fallbackNavLinks;

  return (
    <section className="footer_main-wrap u-theme-buff">
      <div className="footer_main_bg-wrap u-cover-absolute">
        <div className="footer_main_bg-svg u-position-absolute">
          <svg width="100%" viewBox="0 0 644 1153" fill="none" xmlns="http://www.w3.org/2000/svg" data-footer-svg="" data-svg-stagger="" data-svg-trigger=".footer_main-wrap" className="global_svg">
            <path data-svg-path="" d="M561.532 0V96.0106H551.769V0H561.532Z" fill="currentColor" />
            <path data-svg-path="" d="M586.423 0V96.0106H579.176V0H586.423Z" fill="currentColor" />
            <path data-svg-path="" d="M611.51 0V96.0106H606.42V0H611.51Z" fill="currentColor" />
            <path data-svg-path="" d="M636.819 0V96.0106H633.444V0H636.819Z" fill="currentColor" />
            <path data-svg-path="" d="M121.034 0V96.0106H102.696V0H121.034Z" fill="currentColor" />
            <path data-svg-path="" d="M146.757 0V96.0106H129.304V0H146.757Z" fill="currentColor" />
            <path data-svg-path="" d="M171.598 0V96.0106H156.8V0H171.598Z" fill="currentColor" />
            <path data-svg-path="" d="M195.88 0V96.0106H184.816V0H195.88Z" fill="currentColor" />
            <path data-svg-path="" d="M219.971 0V96.0106H213.057V0H219.971Z" fill="currentColor" />
            <path data-svg-path="" d="M244.312 0V96.0106H241.076V0H244.312Z" fill="currentColor" />
            <path data-svg-path="" d="M269.204 0V96.0106H268.484V0H269.204Z" fill="currentColor" />
            <path data-svg-path="" d="M321.84 0V96.0106H320.512V0H321.84Z" fill="currentColor" />
            <path data-svg-path="" d="M349.499 0V96.0106H345.185V0H349.499Z" fill="currentColor" />
            <path data-svg-path="" d="M377.654 0V96.0106H369.356V0H377.654Z" fill="currentColor" />
            <path data-svg-path="" d="M405.786 0V96.0106H393.561V0H405.786Z" fill="currentColor" />
            <path data-svg-path="" d="M433.413 0V96.0106H418.256V0H433.413Z" fill="currentColor" />
            <path data-svg-path="" d="M460.272 0V96.0106H443.704V0H460.272Z" fill="currentColor" />
            <path data-svg-path="" d="M486.381 0V96.0106H469.924V0H486.381Z" fill="currentColor" />
            <path data-svg-path="" d="M511.718 0V96.0106H496.92V0H511.718Z" fill="currentColor" />
            <path data-svg-path="" d="M536.664 0V96.0106H524.3V0H536.664Z" fill="currentColor" />
            <path data-svg-path="" d="M94.3705 0V96.0106H77.0283V0H94.3705Z" fill="currentColor" />
            <path data-svg-path="" d="M11.7567 0V96.0106H2.68457V0H11.7567Z" fill="currentColor" />
            <path data-svg-path="" d="M39.4427 0V96.0106H27.3281V0H39.4427Z" fill="currentColor" />
            <path data-svg-path="" d="M67.0471 0V96.0106H52.0283V0H67.0471Z" fill="currentColor" />
            <path data-svg-path="" d="M399.782 96.0117V192.022H399.561V96.0117H399.782Z" fill="currentColor" />
            <path data-svg-path="" d="M426.914 96.0117V192.022H424.756V96.0117H426.914Z" fill="currentColor" />
            <path data-svg-path="" d="M454.767 96.0117V192.022H449.208V96.0117H454.767Z" fill="currentColor" />
            <path data-svg-path="" d="M482.981 96.0117V192.022H473.328V96.0117H482.981Z" fill="currentColor" />
            <path data-svg-path="" d="M511 96.0117V192.022H497.641V96.0117H511Z" fill="currentColor" />
            <path data-svg-path="" d="M538.382 96.0117V192.022H522.588V96.0117H538.382Z" fill="currentColor" />
            <path data-svg-path="" d="M564.99 96.0117V192.022H548.284V96.0117H564.99Z" fill="currentColor" />
            <path data-svg-path="" d="M590.822 96.0117V192.022H574.78V96.0117H590.822Z" fill="currentColor" />
            <path data-svg-path="" d="M615.991 96.0117V192.022H601.968V96.0117H615.991Z" fill="currentColor" />
            <path data-svg-path="" d="M640.886 96.0117V192.022H629.38V96.0117H640.886Z" fill="currentColor" />
            <path data-svg-path="" d="M34.7112 96.0117V192.022H32.0283V96.0117H34.7112Z" fill="currentColor" />
            <path data-svg-path="" d="M61.8436 96.0117V192.022H57.2246V96.0117H61.8436Z" fill="currentColor" />
            <path data-svg-path="" d="M89.2838 96.0117V192.022H82.1201V96.0117H89.2838Z" fill="currentColor" />
            <path data-svg-path="" d="M116.916 96.0117V192.022H106.82V96.0117H116.916Z" fill="currentColor" />
            <path data-svg-path="" d="M144.602 96.0117V192.022H131.464V96.0117H144.602Z" fill="currentColor" />
            <path data-svg-path="" d="M172.12 96.0117V192.022H156.244V96.0117H172.12Z" fill="currentColor" />
            <path data-svg-path="" d="M199.311 96.0117V192.022H181.416V96.0117H199.311Z" fill="currentColor" />
            <path data-svg-path="" d="M225.644 96.0117V192.022H207.389V96.0117H225.644Z" fill="currentColor" />
            <path data-svg-path="" d="M251.058 96.0117V192.022H234.324V96.0117H251.058Z" fill="currentColor" />
            <path data-svg-path="" d="M275.676 96.0117V192.022H262.012V96.0117H275.676Z" fill="currentColor" />
            <path data-svg-path="" d="M299.849 96.0117V192.022H290.168V96.0117H299.849Z" fill="currentColor" />
            <path data-svg-path="" d="M323.967 96.0117V192.022H318.38V96.0117H323.967Z" fill="currentColor" />
            <path data-svg-path="" d="M348.448 96.0117V192.022H346.208V96.0117H348.448Z" fill="currentColor" />
            <path data-svg-path="" d="M373.645 96.0117V192.022H373.368V96.0117H373.645Z" fill="currentColor" />
            <path data-svg-path="" d="M478.168 192.021V288.032H478.141V192.021H478.168Z" fill="currentColor" />
            <path data-svg-path="" d="M504.664 192.021V288.032H503.973V192.021H504.664Z" fill="currentColor" />
            <path data-svg-path="" d="M532.073 192.021V288.032H528.893V192.021H532.073Z" fill="currentColor" />
            <path data-svg-path="" d="M560.091 192.021V288.032H553.176V192.021H560.091Z" fill="currentColor" />
            <path data-svg-path="" d="M588.305 192.021V288.032H577.324V192.021H588.305Z" fill="currentColor" />
            <path data-svg-path="" d="M616.131 192.021V288.032H601.804V192.021H616.131Z" fill="currentColor" />
            <path data-svg-path="" d="M643.264 192.021V288.032H627V192.021H643.264Z" fill="currentColor" />
            <path data-svg-path="" d="M222.075 192.021V288.032H210.956V192.021H222.075Z" fill="currentColor" />
            <path data-svg-path="" d="M249.73 192.021V288.032H235.624V192.021H249.73Z" fill="currentColor" />
            <path data-svg-path="" d="M277.171 192.021V288.032H260.521V192.021H277.171Z" fill="currentColor" />
            <path data-svg-path="" d="M304.139 192.021V288.032H285.884V192.021H304.139Z" fill="currentColor" />
            <path data-svg-path="" d="M330.163 192.021V288.032H312.185V192.021H330.163Z" fill="currentColor" />
            <path data-svg-path="" d="M355.253 192.021V288.032H339.404V192.021H355.253Z" fill="currentColor" />
            <path data-svg-path="" d="M379.704 192.021V288.032H367.312V192.021H379.704Z" fill="currentColor" />
            <path data-svg-path="" d="M403.818 192.021V288.032H395.521V192.021H403.818Z" fill="currentColor" />
            <path data-svg-path="" d="M427.995 192.021V288.032H423.652V192.021H427.995Z" fill="currentColor" />
            <path data-svg-path="" d="M452.695 192.021V288.032H451.284V192.021H452.695Z" fill="currentColor" />
            <path data-svg-path="" d="M33.579 192.021V288.032H33.1641V192.021H33.579Z" fill="currentColor" />
            <path data-svg-path="" d="M59.7981 192.021V288.032H59.3003V192.021H59.7981Z" fill="currentColor" />
            <path data-svg-path="" d="M86.1299 192.021V288.032H85.2725V192.021H86.1299Z" fill="currentColor" />
            <path data-svg-path="" d="M112.739 192.021V288.032H110.996V192.021H112.739Z" fill="currentColor" />
            <path data-svg-path="" d="M139.648 192.021V288.032H136.412V192.021H139.648Z" fill="currentColor" />
            <path data-svg-path="" d="M166.893 192.021V288.032H161.5V192.021H166.893Z" fill="currentColor" />
            <path data-svg-path="" d="M194.417 192.021V288.032H186.312V192.021H194.417Z" fill="currentColor" />
            <path data-svg-path="" d="M373.145 480.081V384.043H373.532V480.081H373.145Z" fill="currentColor" />
            <path data-svg-path="" d="M346.704 480.081V384.043H347.672V480.081H346.704Z" fill="currentColor" />
            <path data-svg-path="" d="M320.208 480.081V384.043H321.84V480.081H320.208Z" fill="currentColor" />
            <path data-svg-path="" d="M293.656 480.081V384.043H296.063V480.081H293.656Z" fill="currentColor" />
            <path data-svg-path="" d="M267.185 480.081V384.043H270.227V480.081H267.185Z" fill="currentColor" />
            <path data-svg-path="" d="M240.824 480.081V384.043H244.226V480.081H240.824Z" fill="currentColor" />
            <path data-svg-path="" d="M214.632 480.081V384.043H218.117V480.081H214.632Z" fill="currentColor" />
            <path data-svg-path="" d="M188.524 480.081V384.043H191.899V480.081H188.524Z" fill="currentColor" />
            <path data-svg-path="" d="M162.524 480.081V384.043H165.567V480.081H162.524Z" fill="currentColor" />
            <path data-svg-path="" d="M136.58 480.081V384.043H139.18V480.081H136.58Z" fill="currentColor" />
            <path data-svg-path="" d="M110.692 480.081V384.043H112.739V480.081H110.692Z" fill="currentColor" />
            <path data-svg-path="" d="M84.8281 480.081V384.043H86.294V480.081H84.8281Z" fill="currentColor" />
            <path data-svg-path="" d="M58.9121 480.081V384.043H59.8801V480.081H58.9121Z" fill="currentColor" />
            <path data-svg-path="" d="M32.9404 480.081V384.043H33.4936V480.081H32.9404Z" fill="currentColor" />
            <path data-svg-path="" d="M399.477 480.081V384.043H399.56V480.081H399.477Z" fill="currentColor" />
            <path data-svg-path="" d="M630.096 480.081V384.043H639.86V480.081H630.096Z" fill="currentColor" />
            <path data-svg-path="" d="M605.204 480.081V384.043H612.451V480.081H605.204Z" fill="currentColor" />
            <path data-svg-path="" d="M580.116 480.081V384.043H585.205V480.081H580.116Z" fill="currentColor" />
            <path data-svg-path="" d="M554.809 480.081V384.043H558.183V480.081H554.809Z" fill="currentColor" />
            <path data-svg-path="" d="M529.28 480.081V384.043H531.382V480.081H529.28Z" fill="currentColor" />
            <path data-svg-path="" d="M503.612 480.081V384.043H504.719V480.081H503.612Z" fill="currentColor" />
            <path data-svg-path="" d="M477.78 480.081V384.043H478.25V480.081H477.78Z" fill="currentColor" />
            <path data-svg-path="" d="M451.78 480.081V384.043H451.919V480.081H451.78Z" fill="currentColor" />
            <path data-svg-path="" d="M32.0283 384.044V288.033H34.4346V384.044H32.0283Z" fill="currentColor" />
            <path data-svg-path="" d="M109.973 384.044V288.033H113.458V384.044H109.973Z" fill="currentColor" />
            <path data-svg-path="" d="M83.916 384.044V288.033H87.1798V384.044H83.916Z" fill="currentColor" />
            <path data-svg-path="" d="M57.916 384.044V288.033H60.8479V384.044H57.916Z" fill="currentColor" />
            <path data-svg-path="" d="M525.88 384.044V288.033H534.787V384.044H525.88Z" fill="currentColor" />
            <path data-svg-path="" d="M500.933 384.044V288.033H507.405V384.044H500.933Z" fill="currentColor" />
            <path data-svg-path="" d="M475.788 384.044V288.033H480.241V384.044H475.788Z" fill="currentColor" />
            <path data-svg-path="" d="M450.396 384.044V288.033H453.301V384.044H450.396Z" fill="currentColor" />
            <path data-svg-path="" d="M424.812 384.044V288.033H426.555V384.044H424.812Z" fill="currentColor" />
            <path data-svg-path="" d="M399.088 384.044V288.033H399.946V384.044H399.088Z" fill="currentColor" />
            <path data-svg-path="" d="M373.172 384.044V288.033H373.504V384.044H373.172Z" fill="currentColor" />
            <path data-svg-path="" d="M347.148 384.044V288.033H347.231V384.044H347.148Z" fill="currentColor" />
            <path data-svg-path="" d="M294.788 384.044V288.033H294.926V384.044H294.788Z" fill="currentColor" />
            <path data-svg-path="" d="M268.428 384.044V288.033H268.981V384.044H268.428Z" fill="currentColor" />
            <path data-svg-path="" d="M241.96 384.044V288.033H243.122V384.044H241.96Z" fill="currentColor" />
            <path data-svg-path="" d="M215.408 384.044V288.033H217.317V384.044H215.408Z" fill="currentColor" />
            <path data-svg-path="" d="M188.884 384.044V288.033H191.54V384.044H188.884Z" fill="currentColor" />
            <path data-svg-path="" d="M162.44 384.044V288.033H165.649V384.044H162.44Z" fill="currentColor" />
            <path data-svg-path="" d="M136.136 384.044V288.033H139.594V384.044H136.136Z" fill="currentColor" />
            <path data-svg-path="" d="M626.641 384.044V288.033H643.347V384.044H626.641Z" fill="currentColor" />
            <path data-svg-path="" d="M600.809 384.044V288.033H616.851V384.044H600.809Z" fill="currentColor" />
            <path data-svg-path="" d="M575.636 384.044V288.033H589.687V384.044H575.636Z" fill="currentColor" />
            <path data-svg-path="" d="M550.744 384.044V288.033H562.25V384.044H550.744Z" fill="currentColor" />
            <path data-svg-path="" d="M243.399 480.08V576.091H241.988V480.08H243.399Z" fill="currentColor" />
            <path data-svg-path="" d="M269.286 480.08V576.091H268.428V480.08H269.286Z" fill="currentColor" />
            <path data-svg-path="" d="M295.286 480.08V576.091H294.732V480.08H295.286Z" fill="currentColor" />
            <path data-svg-path="" d="M321.368 480.08V576.091H320.98V480.08H321.368Z" fill="currentColor" />
            <path data-svg-path="" d="M347.59 480.08V576.091H347.092V480.08H347.59Z" fill="currentColor" />
            <path data-svg-path="" d="M373.922 480.08V576.091H373.064V480.08H373.922Z" fill="currentColor" />
            <path data-svg-path="" d="M400.527 480.08V576.091H398.812V480.08H400.527Z" fill="currentColor" />
            <path data-svg-path="" d="M427.44 480.08V576.091H424.204V480.08H427.44Z" fill="currentColor" />
            <path data-svg-path="" d="M454.686 480.08V576.091H449.292V480.08H454.686Z" fill="currentColor" />
            <path data-svg-path="" d="M482.205 480.08V576.091H474.101V480.08H482.205Z" fill="currentColor" />
            <path data-svg-path="" d="M509.864 480.08V576.091H498.772V480.08H509.864Z" fill="currentColor" />
            <path data-svg-path="" d="M537.523 480.08V576.091H523.444V480.08H537.523Z" fill="currentColor" />
            <path data-svg-path="" d="M564.987 480.08V576.091H548.309V480.08H564.987Z" fill="currentColor" />
            <path data-svg-path="" d="M591.927 480.08V576.091H573.7V480.08H591.927Z" fill="currentColor" />
            <path data-svg-path="" d="M617.955 480.08V576.091H600.004V480.08H617.955Z" fill="currentColor" />
            <path data-svg-path="" d="M643.069 480.08V576.091H627.22V480.08H643.069Z" fill="currentColor" />
            <path data-svg-path="" d="M192.09 480.08V576.091H188.632V480.08H192.09Z" fill="currentColor" />
            <path data-svg-path="" d="M217.676 480.08V576.091H215.38V480.08H217.676Z" fill="currentColor" />
            <path data-svg-path="" d="M11.0931 480.08V576.091H3.34863V480.08H11.0931Z" fill="currentColor" />
            <path data-svg-path="" d="M37.534 480.08V576.091H29.2363V480.08H37.534Z" fill="currentColor" />
            <path data-svg-path="" d="M63.725 480.08V576.091H55.3721V480.08H63.725Z" fill="currentColor" />
            <path data-svg-path="" d="M89.6982 480.08V576.091H81.7324V480.08H89.6982Z" fill="currentColor" />
            <path data-svg-path="" d="M115.448 480.08V576.091H108.284V480.08H115.448Z" fill="currentColor" />
            <path data-svg-path="" d="M141.062 480.08V576.091H135.004V480.08H141.062Z" fill="currentColor" />
            <path data-svg-path="" d="M166.589 480.08V576.091H161.804V480.08H166.589Z" fill="currentColor" />
            <path data-svg-path="" d="M587.337 576.092V672.102H578.265V576.092H587.337Z" fill="currentColor" />
            <path data-svg-path="" d="M615.023 576.092V672.102H602.908V576.092H615.023Z" fill="currentColor" />
            <path data-svg-path="" d="M642.655 576.092V672.102H627.636V576.092H642.655Z" fill="currentColor" />
            <path data-svg-path="" d="M505.41 576.092V672.102H503.225V576.092H505.41Z" fill="currentColor" />
            <path data-svg-path="" d="M532.432 576.092V672.102H528.532V576.092H532.432Z" fill="currentColor" />
            <path data-svg-path="" d="M559.759 576.092V672.102H553.508V576.092H559.759Z" fill="currentColor" />
            <path data-svg-path="" d="M62.5656 576.092V672.102H56.5083V576.092H62.5656Z" fill="currentColor" />
            <path data-svg-path="" d="M89.3114 576.092V672.102H82.1201V576.092H89.3114Z" fill="currentColor" />
            <path data-svg-path="" d="M115.862 576.092V672.102H107.868V576.092H115.862Z" fill="currentColor" />
            <path data-svg-path="" d="M142.221 576.092V672.102H133.84V576.092H142.221Z" fill="currentColor" />
            <path data-svg-path="" d="M168.331 576.092V672.102H160.061V576.092H168.331Z" fill="currentColor" />
            <path data-svg-path="" d="M194.221 576.092V672.102H186.477V576.092H194.221Z" fill="currentColor" />
            <path data-svg-path="" d="M219.916 576.092V672.102H213.112V576.092H219.916Z" fill="currentColor" />
            <path data-svg-path="" d="M245.499 576.092V672.102H239.856V576.092H245.499Z" fill="currentColor" />
            <path data-svg-path="" d="M271.003 576.092V672.102H266.688V576.092H271.003Z" fill="currentColor" />
            <path data-svg-path="" d="M296.531 576.092V672.102H293.488V576.092H296.531Z" fill="currentColor" />
            <path data-svg-path="" d="M322.144 576.092V672.102H320.181V576.092H322.144Z" fill="currentColor" />
            <path data-svg-path="" d="M347.922 576.092V672.102H346.732V576.092H347.922Z" fill="currentColor" />
            <path data-svg-path="" d="M373.864 576.092V672.102H373.145V576.092H373.864Z" fill="currentColor" />
            <path data-svg-path="" d="M399.891 576.092V672.102H399.42V576.092H399.891Z" fill="currentColor" />
            <path data-svg-path="" d="M426.031 576.092V672.102H425.616V576.092H426.031Z" fill="currentColor" />
            <path data-svg-path="" d="M452.277 576.092V672.102H451.696V576.092H452.277Z" fill="currentColor" />
            <path data-svg-path="" d="M478.691 576.092V672.102H477.612V576.092H478.691Z" fill="currentColor" />
            <path data-svg-path="" d="M8.87893 576.092V672.102H5.53223V576.092H8.87893Z" fill="currentColor" />
            <path data-svg-path="" d="M35.7341 576.092V672.102H31.0044V576.092H35.7341Z" fill="currentColor" />
            <path data-svg-path="" d="M400.999 672.104V768.114H398.316V672.104H400.999Z" fill="currentColor" />
            <path data-svg-path="" d="M426.668 672.104V768.114H424.98V672.104H426.668Z" fill="currentColor" />
            <path data-svg-path="" d="M452.5 672.104V768.114H451.477V672.104H452.5Z" fill="currentColor" />
            <path data-svg-path="" d="M478.473 672.104V768.114H477.836V672.104H478.473Z" fill="currentColor" />
            <path data-svg-path="" d="M504.527 672.104V768.114H504.112V672.104H504.527Z" fill="currentColor" />
            <path data-svg-path="" d="M530.691 672.104V768.114H530.248V672.104H530.691Z" fill="currentColor" />
            <path data-svg-path="" d="M556.996 672.104V768.114H556.304V672.104H556.996Z" fill="currentColor" />
            <path data-svg-path="" d="M583.492 672.104V768.114H582.136V672.104H583.492Z" fill="currentColor" />
            <path data-svg-path="" d="M610.296 672.104V768.114H607.641V672.104H610.296Z" fill="currentColor" />
            <path data-svg-path="" d="M637.455 672.104V768.114H632.836V672.104H637.455Z" fill="currentColor" />
            <path data-svg-path="" d="M324.413 672.104V768.114H317.94V672.104H324.413Z" fill="currentColor" />
            <path data-svg-path="" d="M349.94 672.104V768.114H344.74V672.104H349.94Z" fill="currentColor" />
            <path data-svg-path="" d="M375.44 672.104V768.114H371.54V672.104H375.44Z" fill="currentColor" />
            <path data-svg-path="" d="M33.6886 672.104V768.114H33.0801V672.104H33.6886Z" fill="currentColor" />
            <path data-svg-path="" d="M60.2426 672.104V768.114H58.832V672.104H60.2426Z" fill="currentColor" />
            <path data-svg-path="" d="M86.9613 672.104V768.114H84.4443V672.104H86.9613Z" fill="currentColor" />
            <path data-svg-path="" d="M113.762 672.104V768.114H109.973V672.104H113.762Z" fill="currentColor" />
            <path data-svg-path="" d="M140.617 672.104V768.114H135.444V672.104H140.617Z" fill="currentColor" />
            <path data-svg-path="" d="M167.42 672.104V768.114H160.948V672.104H167.42Z" fill="currentColor" />
            <path data-svg-path="" d="M194.112 672.104V768.114H186.616V672.104H194.112Z" fill="currentColor" />
            <path data-svg-path="" d="M220.608 672.104V768.114H212.448V672.104H220.608Z" fill="currentColor" />
            <path data-svg-path="" d="M246.885 672.104V768.114H238.504V672.104H246.885Z" fill="currentColor" />
            <path data-svg-path="" d="M272.912 672.104V768.114H264.78V672.104H272.912Z" fill="currentColor" />
            <path data-svg-path="" d="M298.744 672.104V768.114H291.276V672.104H298.744Z" fill="currentColor" />
            <path data-svg-path="" d="M58.2202 1152.18V1056.14H60.7371V1152.18H58.2202Z" fill="currentColor" />
            <path data-svg-path="" d="M32.6084 1152.18V1056.14H34.019V1152.18H32.6084Z" fill="currentColor" />
            <path data-svg-path="" d="M315.616 1152.18V1056.14H326.597V1152.18H315.616Z" fill="currentColor" />
            <path data-svg-path="" d="M287.792 1152.18V1056.14H302.12V1152.18H287.792Z" fill="currentColor" />
            <path data-svg-path="" d="M260.656 1152.18V1056.14H276.92V1152.18H260.656Z" fill="currentColor" />
            <path data-svg-path="" d="M234.3 1152.18V1056.14H250.951V1152.18H234.3Z" fill="currentColor" />
            <path data-svg-path="" d="M208.712 1152.18V1056.14H224.201V1152.18H208.712Z" fill="currentColor" />
            <path data-svg-path="" d="M183.685 1152.18V1056.14H196.906V1152.18H183.685Z" fill="currentColor" />
            <path data-svg-path="" d="M158.816 1152.18V1056.14H169.437V1152.18H158.816Z" fill="currentColor" />
            <path data-svg-path="" d="M133.952 1152.18V1056.14H142.001V1152.18H133.952Z" fill="currentColor" />
            <path data-svg-path="" d="M108.948 1152.18V1056.14H114.674V1152.18H108.948Z" fill="currentColor" />
            <path data-svg-path="" d="M83.6963 1152.18V1056.14H87.5962V1152.18H83.6963Z" fill="currentColor" />
            <path data-svg-path="" d="M626.752 1152.18V1056.14H643.403V1152.18H626.752Z" fill="currentColor" />
            <path data-svg-path="" d="M599.784 1152.18V1056.14H618.039V1152.18H599.784Z" fill="currentColor" />
            <path data-svg-path="" d="M573.784 1152.18V1056.14H591.735V1152.18H573.784Z" fill="currentColor" />
            <path data-svg-path="" d="M548.668 1152.18V1056.14H564.517V1152.18H548.668Z" fill="currentColor" />
            <path data-svg-path="" d="M524.22 1152.18V1056.14H536.639V1152.18H524.22Z" fill="currentColor" />
            <path data-svg-path="" d="M500.128 1152.18V1056.14H508.398V1152.18H500.128Z" fill="currentColor" />
            <path data-svg-path="" d="M475.928 1152.18V1056.14H480.271V1152.18H475.928Z" fill="currentColor" />
            <path data-svg-path="" d="M451.229 1152.18V1056.14H452.639V1152.18H451.229Z" fill="currentColor" />
            <path data-svg-path="" d="M425.752 1152.18V1056.14H425.779V1152.18H425.752Z" fill="currentColor" />
            <path data-svg-path="" d="M399.284 1152.18V1056.14H399.948V1152.18H399.284Z" fill="currentColor" />
            <path data-svg-path="" d="M371.872 1152.18V1056.14H375.025V1152.18H371.872Z" fill="currentColor" />
            <path data-svg-path="" d="M343.828 1152.18V1056.14H350.743V1152.18H343.828Z" fill="currentColor" />
            <path data-svg-path="" d="M4.62012 1056.15V960.135H9.6817V1056.15H4.62012Z" fill="currentColor" />
            <path data-svg-path="" d="M238.477 1056.15V960.135H246.774V1056.15H238.477Z" fill="currentColor" />
            <path data-svg-path="" d="M210.344 1056.15V960.135H222.569V1056.15H210.344Z" fill="currentColor" />
            <path data-svg-path="" d="M182.716 1056.15V960.135H197.873V1056.15H182.716Z" fill="currentColor" />
            <path data-svg-path="" d="M155.856 1056.15V960.135H172.424V1056.15H155.856Z" fill="currentColor" />
            <path data-svg-path="" d="M129.748 1056.15V960.135H146.205V1056.15H129.748Z" fill="currentColor" />
            <path data-svg-path="" d="M104.412 1056.15V960.135H119.21V1056.15H104.412Z" fill="currentColor" />
            <path data-svg-path="" d="M79.4644 1056.15V960.135H91.8279V1056.15H79.4644Z" fill="currentColor" />
            <path data-svg-path="" d="M54.6006 1056.15V960.135H64.3642V1056.15H54.6006Z" fill="currentColor" />
            <path data-svg-path="" d="M29.7041 1056.15V960.135H36.9231V1056.15H29.7041Z" fill="currentColor" />
            <path data-svg-path="" d="M521.756 1056.15V960.135H539.098V1056.15H521.756Z" fill="currentColor" />
            <path data-svg-path="" d="M495.068 1056.15V960.135H513.434V1056.15H495.068Z" fill="currentColor" />
            <path data-svg-path="" d="M469.372 1056.15V960.135H486.825V1056.15H469.372Z" fill="currentColor" />
            <path data-svg-path="" d="M444.532 1056.15V960.135H459.33V1056.15H444.532Z" fill="currentColor" />
            <path data-svg-path="" d="M420.22 1056.15V960.135H431.311V1056.15H420.22Z" fill="currentColor" />
            <path data-svg-path="" d="M396.16 1056.15V960.135H403.047V1056.15H396.16Z" fill="currentColor" />
            <path data-svg-path="" d="M371.82 1056.15V960.135H375.056V1056.15H371.82Z" fill="currentColor" />
            <path data-svg-path="" d="M346.924 1056.15V960.135H347.643V1056.15H346.924Z" fill="currentColor" />
            <path data-svg-path="" d="M321.092 1056.15V960.135H321.119V1056.15H321.092Z" fill="currentColor" />
            <path data-svg-path="" d="M294.292 1056.15V960.135H295.62V1056.15H294.292Z" fill="currentColor" />
            <path data-svg-path="" d="M266.632 1056.15V960.135H270.947V1056.15H266.632Z" fill="currentColor" />
            <path data-svg-path="" d="M631.952 1056.15V960.135H638.203V1056.15H631.952Z" fill="currentColor" />
            <path data-svg-path="" d="M604.376 1056.15V960.135H613.449V1056.15H604.376Z" fill="currentColor" />
            <path data-svg-path="" d="M576.688 1056.15V960.135H588.803V1056.15H576.688Z" fill="currentColor" />
            <path data-svg-path="" d="M549.084 1056.15V960.135H564.103V1056.15H549.084Z" fill="currentColor" />
            <path data-svg-path="" d="M105.132 960.134V864.123H118.492V960.134H105.132Z" fill="currentColor" />
            <path data-svg-path="" d="M77.748 960.134V864.123H93.5413V960.134H77.748Z" fill="currentColor" />
            <path data-svg-path="" d="M51.1406 960.134V864.123H67.819V960.134H51.1406Z" fill="currentColor" />
            <path data-svg-path="" d="M25.2803 960.134V864.123H41.3501V960.134H25.2803Z" fill="currentColor" />
            <path data-svg-path="" d="M0.13623 960.134V864.123H14.1869V960.134H0.13623Z" fill="currentColor" />
            <path data-svg-path="" d="M161.36 960.134V864.123H166.92V960.134H161.36Z" fill="currentColor" />
            <path data-svg-path="" d="M133.148 960.134V864.123H142.801V960.134H133.148Z" fill="currentColor" />
            <path data-svg-path="" d="M416.82 960.134V864.123H434.716V960.134H416.82Z" fill="currentColor" />
            <path data-svg-path="" d="M390.46 960.134V864.123H408.743V960.134H390.46Z" fill="currentColor" />
            <path data-svg-path="" d="M365.068 960.134V864.123H381.802V960.134H365.068Z" fill="currentColor" />
            <path data-svg-path="" d="M340.452 960.134V864.123H354.116V960.134H340.452Z" fill="currentColor" />
            <path data-svg-path="" d="M316.28 960.134V864.123H325.961V960.134H316.28Z" fill="currentColor" />
            <path data-svg-path="" d="M292.16 960.134V864.123H297.747V960.134H292.16Z" fill="currentColor" />
            <path data-svg-path="" d="M267.685 960.134V864.123H269.897V960.134H267.685Z" fill="currentColor" />
            <path data-svg-path="" d="M242.484 960.134V864.123H242.761V960.134H242.484Z" fill="currentColor" />
            <path data-svg-path="" d="M216.349 960.134V864.123H216.57V960.134H216.349Z" fill="currentColor" />
            <path data-svg-path="" d="M189.216 960.134V864.123H191.374V960.134H189.216Z" fill="currentColor" />
            <path data-svg-path="" d="M634.716 960.134V864.123H635.435V960.134H634.716Z" fill="currentColor" />
            <path data-svg-path="" d="M608.248 960.134V864.123H609.603V960.134H608.248Z" fill="currentColor" />
            <path data-svg-path="" d="M581.416 960.134V864.123H584.071V960.134H581.416Z" fill="currentColor" />
            <path data-svg-path="" d="M554.284 960.134V864.123H558.903V960.134H554.284Z" fill="currentColor" />
            <path data-svg-path="" d="M526.849 960.134V864.123H534.012V960.134H526.849Z" fill="currentColor" />
            <path data-svg-path="" d="M499.216 960.134V864.123H509.312V960.134H499.216Z" fill="currentColor" />
            <path data-svg-path="" d="M471.528 960.134V864.123H484.666V960.134H471.528Z" fill="currentColor" />
            <path data-svg-path="" d="M444.008 960.134V864.123H459.857V960.134H444.008Z" fill="currentColor" />
            <path data-svg-path="" d="M285.964 864.124V768.113H303.915V864.124H285.964Z" fill="currentColor" />
            <path data-svg-path="" d="M260.853 864.124V768.113H276.701V864.124H260.853Z" fill="currentColor" />
            <path data-svg-path="" d="M236.428 864.124V768.113H248.819V864.124H236.428Z" fill="currentColor" />
            <path data-svg-path="" d="M212.309 864.124V768.113H220.606V864.124H212.309Z" fill="currentColor" />
            <path data-svg-path="" d="M188.136 864.124V768.113H192.479V864.124H188.136Z" fill="currentColor" />
            <path data-svg-path="" d="M163.437 864.124V768.113H164.819V864.124H163.437Z" fill="currentColor" />
            <path data-svg-path="" d="M137.937 864.124V768.113H137.992V864.124H137.937Z" fill="currentColor" />
            <path data-svg-path="" d="M111.464 864.124V768.113H112.128V864.124H111.464Z" fill="currentColor" />
            <path data-svg-path="" d="M84.0566 864.124V768.113H87.2098V864.124H84.0566Z" fill="currentColor" />
            <path data-svg-path="" d="M56.0083 864.124V768.113H62.9507V864.124H56.0083Z" fill="currentColor" />
            <path data-svg-path="" d="M27.8242 864.124V768.113H38.8048V864.124H27.8242Z" fill="currentColor" />
            <path data-svg-path="" d="M0 864.124V768.113H14.3273V864.124H0Z" fill="currentColor" />
            <path data-svg-path="" d="M338.96 864.124V768.113H355.611V864.124H338.96Z" fill="currentColor" />
            <path data-svg-path="" d="M311.992 864.124V768.113H330.219V864.124H311.992Z" fill="currentColor" />
            <path data-svg-path="" d="M608.632 864.124V768.113H609.185V864.124H608.632Z" fill="currentColor" />
            <path data-svg-path="" d="M582.552 864.124V768.113H582.939V864.124H582.552Z" fill="currentColor" />
            <path data-svg-path="" d="M556.332 864.124V768.113H556.83V864.124H556.332Z" fill="currentColor" />
            <path data-svg-path="" d="M530 864.124V768.113H530.858V864.124H530Z" fill="currentColor" />
            <path data-svg-path="" d="M503.393 864.124V768.113H505.108V864.124H503.393Z" fill="currentColor" />
            <path data-svg-path="" d="M476.48 864.124V768.113H479.717V864.124H476.48Z" fill="currentColor" />
            <path data-svg-path="" d="M449.236 864.124V768.113H454.63V864.124H449.236Z" fill="currentColor" />
            <path data-svg-path="" d="M421.716 864.124V768.113H429.82V864.124H421.716Z" fill="currentColor" />
            <path data-svg-path="" d="M394.057 864.124V768.113H405.148V864.124H394.057Z" fill="currentColor" />
            <path data-svg-path="" d="M366.396 864.124V768.113H380.475V864.124H366.396Z" fill="currentColor" />
            <path data-svg-path="" d="M634.66 864.124V768.113H635.49V864.124H634.66Z" fill="currentColor" />
          </svg>
        </div>
      </div>

      <div className="footer_main-contain u-container">
        <div className="footer_main-layout u-grid-custom u-min-height-screen">
          <div className="footer_main-col u-column-span-5">
            <div className="footer_main_col-inner u-height-full u-flex-vertical-nowrap u-justify-content-end u-gap-6">

              <ul data-stagger-start="top 95%" data-stagger="" role="list" className="footer_main_nav-list u-flex-vertical-nowrap u-gap-4">
                {footerNavLinks.map(({ label, url }) => {
                  const isActive = url !== '#' && pathname === url;
                  return (
                    <li key={url + label} data-stagger-item="" className="footer_main_nav-item">
                      <Link
                        href={url}
                        aria-current={isActive ? 'page' : undefined}
                        className={`footer_main_nav-link w-inline-block${isActive ? ' w--current' : ''}`}
                      >
                        <div className="footer_main_nav-text u-text-style-h2 u-text-transform-uppercase">
                          {label === 'About & Team' ? <>About &amp; Team</> : label}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="footer_main_legal-wrap">
                <div data-stagger-start="top 95%" data-stagger="" className="footer_main_legal-inner u-flex-horizontal-nowrap u-alignment-start u-gap-3">
                  {legalLinks ? legalLinks.map(({ label, url }) => (
                    <a key={url + label} href={url} className="footer_main_legal-link u-text-style-x-small u-text-transform-uppercase">{label}</a>
                  )) : (
                    <>
                      <a href="#" className="footer_main_legal-link u-text-style-x-small u-text-transform-uppercase">Privacy Policy</a>
                      <a href="#" className="footer_main_legal-link u-text-style-x-small u-text-transform-uppercase">Terms &amp; Conditions</a>
                    </>
                  )}
                  {(builtByText || builtByUrl) && (
                    <a href={builtByUrl ?? '#'} className="footer_main_legal-link u-text-style-x-small u-text-transform-uppercase">{builtByText ?? 'Built by'}</a>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <div data-wf--spacer--variant="small" className="u-section-spacer w-variant-d422cbd0-f212-c815-68df-63414354c21d u-ignore-trim" />
    </section>
  );
}
