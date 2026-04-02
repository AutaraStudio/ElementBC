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

interface NavbarProps {
  navLinks?: SanityNavLink[];
}

export default function Navbar({ navLinks: sanityNavLinks }: NavbarProps) {
  const pathname = usePathname();
  const navLinks = sanityNavLinks ?? fallbackNavLinks;

  return (
    <div className="nav_main-wrap u-position-fixed u-width-full u-pointer-off">
      <div className="u-embed-css w-embed">
        <style>{`
/* Menu wrapper — hidden by default */
[data-nav-menu] {
  clip-path: inset(0 0 100% 0);
  visibility: hidden;
  pointer-events: none;
}
/* When menu is open, allow pointer events */
[data-nav-menu].is-open {
  visibility: visible;
  pointer-events: auto;
}
/* Menu list items — hidden by default (GSAP animates these) */
[data-nav-item] {
  opacity: 0;
  filter: blur(12px);
  will-change: opacity, filter, transform;
}
/* SVG background paths — hidden by default (GSAP animates these) */
[data-nav-path] {
  opacity: 0;
  will-change: opacity;
}
/* Menu link text */
[data-nav-link-text] {
  will-change: transform, opacity;
}
/* Logo letters — prevent FOUC */
[data-nav-letter] {
  opacity: 0;
  filter: blur(8px);
  will-change: opacity, filter;
}
        `}</style>
      </div>

      <div className="nav_main-contain u-container">
        <div className="nav_main-layout u-grid-custom u-theme-charcoal">

          <div className="nav_main-col u-column-start-1 u-column-span-2 u-flex-horizontal-nowrap u-gap-3">
            <Link
              data-nav-logo=""
              href="/"
              aria-current={pathname === '/' ? 'page' : undefined}
              className={`nav_logo-link u-pointer-on w-inline-block${pathname === '/' ? ' w--current' : ''}`}
            >
              <svg width="100%" viewBox="0 0 177 33" fill="none" xmlns="http://www.w3.org/2000/svg" data-nav-svg="" className="nav_logo-svg">
                <path d="M19.9056 0.505233V3.83078C19.9056 4.11352 19.677 4.3424 19.3945 4.3424H0.512051C-0.0561726 4.3424 -0.200753 5.1334 0.330485 5.33199L9.72466 8.88978C9.78182 8.91334 9.84234 8.92344 9.90623 8.92344H19.3979C19.6803 8.92344 19.909 9.15232 19.909 9.43506V13.5045H0.512051C-0.0561726 13.5045 -0.200753 14.2921 0.330485 14.4941L9.72466 18.0519C9.78182 18.0754 9.84234 18.0855 9.90623 18.0855H19.3979C19.6803 18.0855 19.909 18.3144 19.909 18.5971V22.6666H0.512051C-0.0561726 22.6666 -0.200753 23.4576 0.330485 23.6595L24.9154 32.9663C24.9725 32.9899 25.0331 33 25.0969 33H46.6894C46.9719 33 47.2005 32.7711 47.2005 32.4884V28.7758C47.2005 28.5637 47.066 28.3718 46.8676 28.2978L37.7155 24.8342C37.1843 24.6323 37.3289 23.8413 37.8971 23.8413H46.6861C46.9685 23.8413 47.1971 23.6124 47.1971 23.3297V19.617C47.1971 19.405 47.0626 19.2131 46.8643 19.1391L37.7122 15.6755C37.1809 15.4736 37.3255 14.6826 37.8937 14.6826H46.6827C46.9651 14.6826 47.1938 14.4537 47.1938 14.1709V10.455C47.1938 10.2429 47.0593 10.051 46.8609 9.97698L20.5949 0.033998C20.262 -0.0939076 19.9022 0.155176 19.9022 0.511966" fill="currentColor" data-nav-svg-icon="" className="nav_logo-path" />
                <path d="M65.9767 28.0041C63.5234 28.0041 61.614 27.3001 60.2487 25.8921C58.8834 24.4628 58.2007 22.5001 58.2007 20.0041C58.2007 18.3615 58.51 16.9428 59.1287 15.7481C59.7687 14.5322 60.654 13.6042 61.7847 12.9642C62.9367 12.3028 64.302 11.9722 65.8807 11.9722C68.1207 11.9722 69.8807 12.6655 71.1607 14.0522C72.4621 15.4388 73.1127 17.3375 73.1127 19.7481C73.1127 19.9188 73.1127 20.0895 73.1127 20.2601C73.1127 20.4308 73.1021 20.6121 73.0807 20.8041H59.5447V18.8521H71.3527L70.5847 19.6521C70.5847 18.5001 70.3927 17.5081 70.0087 16.6761C69.6461 15.8441 69.1127 15.2148 68.4087 14.7882C67.7047 14.3402 66.862 14.1162 65.8807 14.1162C64.814 14.1162 63.8967 14.3615 63.1287 14.8522C62.382 15.3215 61.7954 15.9935 61.3687 16.8681C60.9634 17.7428 60.7607 18.7881 60.7607 20.0041C60.7607 21.8388 61.2194 23.2681 62.1367 24.2921C63.054 25.2948 64.3447 25.7961 66.0087 25.7961C67.0327 25.7961 67.9073 25.5935 68.6327 25.1881C69.3581 24.7615 69.9767 24.1748 70.4887 23.4281L72.7287 24.3561C71.2994 26.7881 69.0487 28.0041 65.9767 28.0041Z" fill="currentColor" data-nav-letter="" className="nav_logo-path" />
                <path d="M77.1606 27.6201V5.66809L79.8486 4.99609V27.6201H77.1606Z" fill="currentColor" data-nav-letter="" className="nav_logo-path" />
                <path d="M91.9767 28.0041C89.5234 28.0041 87.6141 27.3001 86.2487 25.8921C84.8834 24.4628 84.2007 22.5001 84.2007 20.0041C84.2007 18.3615 84.5101 16.9428 85.1287 15.7481C85.7687 14.5322 86.6541 13.6042 87.7847 12.9642C88.9367 12.3028 90.3021 11.9722 91.8807 11.9722C94.1207 11.9722 95.8807 12.6655 97.1607 14.0522C98.4621 15.4388 99.1127 17.3375 99.1127 19.7481C99.1127 19.9188 99.1127 20.0895 99.1127 20.2601C99.1127 20.4308 99.1021 20.6121 99.0807 20.8041H85.5447V18.8521H97.3527L96.5847 19.6521C96.5847 18.5001 96.3927 17.5081 96.0087 16.6761C95.6461 15.8441 95.1127 15.2148 94.4087 14.7882C93.7047 14.3402 92.8621 14.1162 91.8807 14.1162C90.8141 14.1162 89.8967 14.3615 89.1287 14.8522C88.3821 15.3215 87.7954 15.9935 87.3687 16.8681C86.9634 17.7428 86.7607 18.7881 86.7607 20.0041C86.7607 21.8388 87.2194 23.2681 88.1367 24.2921C89.0541 25.2948 90.3447 25.7961 92.0087 25.7961C93.0327 25.7961 93.9074 25.5935 94.6327 25.1881C95.3581 24.7615 95.9767 24.1748 96.4887 23.4281L98.7287 24.3561C97.2994 26.7881 95.0487 28.0041 91.9767 28.0041Z" fill="currentColor" data-nav-letter="" className="nav_logo-path" />
                <path d="M103.161 27.6201V12.3562H105.305L105.849 15.4281V27.6201H103.161ZM113.049 27.6201V17.7961C113.049 16.7081 112.75 15.8761 112.153 15.3001C111.577 14.7028 110.766 14.4042 109.721 14.4042C108.889 14.4042 108.142 14.5855 107.481 14.9482C106.841 15.3108 106.265 15.8548 105.753 16.5801L104.953 15.0441C106.105 12.9962 107.865 11.9722 110.233 11.9722C111.961 11.9722 113.305 12.4735 114.265 13.4762C115.246 14.4788 115.737 15.8441 115.737 17.5721V27.6201H113.049ZM122.905 27.6201V17.7961C122.905 16.7081 122.606 15.8761 122.009 15.3001C121.433 14.7028 120.622 14.4042 119.577 14.4042C118.702 14.4042 117.891 14.6282 117.145 15.0761C116.398 15.5028 115.747 16.1321 115.193 16.9641L114.265 15.2681C114.905 14.1588 115.715 13.3375 116.697 12.8042C117.699 12.2495 118.841 11.9722 120.121 11.9722C121.87 11.9722 123.214 12.4628 124.153 13.4442C125.113 14.4255 125.593 15.8015 125.593 17.5721V27.6201H122.905Z" fill="currentColor" data-nav-letter="" className="nav_logo-path" />
                <path d="M136.977 28.0041C134.523 28.0041 132.614 27.3001 131.249 25.8921C129.883 24.4628 129.201 22.5001 129.201 20.0041C129.201 18.3615 129.51 16.9428 130.129 15.7481C130.769 14.5322 131.654 13.6042 132.785 12.9642C133.937 12.3028 135.302 11.9722 136.881 11.9722C139.121 11.9722 140.881 12.6655 142.161 14.0522C143.462 15.4388 144.113 17.3375 144.113 19.7481C144.113 19.9188 144.113 20.0895 144.113 20.2601C144.113 20.4308 144.102 20.6121 144.081 20.8041H130.545V18.8521H142.353L141.585 19.6521C141.585 18.5001 141.393 17.5081 141.009 16.6761C140.646 15.8441 140.113 15.2148 139.409 14.7882C138.705 14.3402 137.862 14.1162 136.881 14.1162C135.814 14.1162 134.897 14.3615 134.129 14.8522C133.382 15.3215 132.795 15.9935 132.369 16.8681C131.963 17.7428 131.761 18.7881 131.761 20.0041C131.761 21.8388 132.219 23.2681 133.137 24.2921C134.054 25.2948 135.345 25.7961 137.009 25.7961C138.033 25.7961 138.907 25.5935 139.633 25.1881C140.358 24.7615 140.977 24.1748 141.489 23.4281L143.729 24.3561C142.299 26.7881 140.049 28.0041 136.977 28.0041Z" fill="currentColor" data-nav-letter="" className="nav_logo-path" />
                <path d="M148.161 27.6201V12.3562H150.305L150.849 15.4281V27.6201H148.161ZM158.817 27.6201V17.9881C158.817 16.8575 158.497 15.9828 157.857 15.3641C157.238 14.7242 156.374 14.4042 155.265 14.4042C153.43 14.4042 151.926 15.1935 150.753 16.7721L149.953 15.2361C151.275 13.0602 153.217 11.9722 155.777 11.9722C157.59 11.9722 158.998 12.4842 160.001 13.5082C161.004 14.5322 161.505 15.9508 161.505 17.7641V27.6201H158.817Z" fill="currentColor" data-nav-letter="" className="nav_logo-path" />
                <path d="M172.753 28.0042C171.153 28.0042 169.905 27.5669 169.009 26.6922C168.134 25.8176 167.697 24.5696 167.697 22.9482V8.10022L170.385 7.42822V22.8202C170.385 23.7162 170.62 24.4096 171.089 24.9002C171.58 25.3696 172.273 25.6042 173.169 25.6042C173.553 25.6042 173.937 25.5509 174.321 25.4442C174.726 25.3376 175.121 25.1989 175.505 25.0282L176.241 27.2362C175.196 27.7482 174.033 28.0042 172.753 28.0042ZM164.657 14.7242V12.3562H175.473V14.7242H164.657Z" fill="currentColor" data-nav-letter="" className="nav_logo-path" />
              </svg>
            </Link>
          </div>

          <div className="nav_main-col u-column-start-11 u-column-span-2 u-flex-vertical-nowrap u-align-items-end u-gap-3">
            <a data-nav-toggle="" href="#" className="nav_main-link u-pointer-on w-inline-block">
              <div className="nav_main_link-text u-text-style-main">MENU</div>
            </a>
          </div>

        </div>
      </div>

      <div data-mega-theme="dark" data-nav-menu="" className="nav_mega-wrap u-position-fixed u-padding-top-large u-padding-bottom-small u-theme-charcoal">

        <div className="nav_mega_bg-wrap u-position-absolute">
          <svg width="100%" viewBox="0 0 934 769" fill="none" xmlns="http://www.w3.org/2000/svg" className="nav_mega_bg-svg">
            <path data-nav-path="" d="M873.551 0V96.0106H871.504V0H873.551Z" fill="currentColor" />
            <path data-nav-path="" d="M899.437 0V96.0106H897.944V0H899.437Z" fill="currentColor" />
            <path data-nav-path="" d="M925.328 0V96.0106H924.36V0H925.328Z" fill="currentColor" />
            <path data-nav-path="" d="M664.032 0V96.0106H662.4V0H664.032Z" fill="currentColor" />
            <path data-nav-path="" d="M690.586 0V96.0106H688.18V0H690.586Z" fill="currentColor" />
            <path data-nav-path="" d="M717.082 0V96.0106H714.012V0H717.082Z" fill="currentColor" />
            <path data-nav-path="" d="M743.414 0V96.0106H740.012V0H743.414Z" fill="currentColor" />
            <path data-nav-path="" d="M769.609 0V96.0106H766.124V0H769.609Z" fill="currentColor" />
            <path data-nav-path="" d="M795.718 0V96.0106H792.344V0H795.718Z" fill="currentColor" />
            <path data-nav-path="" d="M821.718 0V96.0106H818.676V0H821.718Z" fill="currentColor" />
            <path data-nav-path="" d="M847.66 0V96.0106H845.06V0H847.66Z" fill="currentColor" />
            <path data-nav-path="" d="M354.143 0V96.0106H344.38V0H354.143Z" fill="currentColor" />
            <path data-nav-path="" d="M379.034 0V96.0106H371.788V0H379.034Z" fill="currentColor" />
            <path data-nav-path="" d="M404.121 0V96.0106H399.032V0H404.121Z" fill="currentColor" />
            <path data-nav-path="" d="M429.43 0V96.0106H426.056V0H429.43Z" fill="currentColor" />
            <path data-nav-path="" d="M454.958 0V96.0106H452.856V0H454.958Z" fill="currentColor" />
            <path data-nav-path="" d="M480.626 0V96.0106H479.52V0H480.626Z" fill="currentColor" />
            <path data-nav-path="" d="M12.5827 0V96.0106H5.66797V0H12.5827Z" fill="currentColor" />
            <path data-nav-path="" d="M36.9241 0V96.0106H33.688V0H36.9241Z" fill="currentColor" />
            <path data-nav-path="" d="M61.8151 0V96.0106H61.0959V0H61.8151Z" fill="currentColor" />
            <path data-nav-path="" d="M114.451 0V96.0106H113.124V0H114.451Z" fill="currentColor" />
            <path data-nav-path="" d="M142.111 0V96.0106H137.796V0H142.111Z" fill="currentColor" />
            <path data-nav-path="" d="M170.266 0V96.0106H161.968V0H170.266Z" fill="currentColor" />
            <path data-nav-path="" d="M198.397 0V96.0106H186.172V0H198.397Z" fill="currentColor" />
            <path data-nav-path="" d="M226.025 0V96.0106H210.868V0H226.025Z" fill="currentColor" />
            <path data-nav-path="" d="M252.884 0V96.0106H236.316V0H252.884Z" fill="currentColor" />
            <path data-nav-path="" d="M278.993 0V96.0106H262.536V0H278.993Z" fill="currentColor" />
            <path data-nav-path="" d="M304.33 0V96.0106H289.532V0H304.33Z" fill="currentColor" />
            <path data-nav-path="" d="M329.275 0V96.0106H316.912V0H329.275Z" fill="currentColor" />
            <path data-nav-path="" d="M821.801 96.0117V192.022H818.592V96.0117H821.801Z" fill="currentColor" />
            <path data-nav-path="" d="M848.074 96.0117V192.022H844.644V96.0117H848.074Z" fill="currentColor" />
            <path data-nav-path="" d="M874.269 96.0117V192.022H870.784V96.0117H874.269Z" fill="currentColor" />
            <path data-nav-path="" d="M900.324 96.0117V192.022H897.06V96.0117H900.324Z" fill="currentColor" />
            <path data-nav-path="" d="M458.362 96.0117V192.022H449.456V96.0117H458.362Z" fill="currentColor" />
            <path data-nav-path="" d="M483.308 96.0117V192.022H476.836V96.0117H483.308Z" fill="currentColor" />
            <path data-nav-path="" d="M508.453 96.0117V192.022H504V96.0117H508.453Z" fill="currentColor" />
            <path data-nav-path="" d="M533.844 96.0117V192.022H530.94V96.0117H533.844Z" fill="currentColor" />
            <path data-nav-path="" d="M559.427 96.0117V192.022H557.712V96.0117H559.427Z" fill="currentColor" />
            <path data-nav-path="" d="M585.149 96.0117V192.022H584.292V96.0117H585.149Z" fill="currentColor" />
            <path data-nav-path="" d="M219.525 96.0117V192.022H217.368V96.0117H219.525Z" fill="currentColor" />
            <path data-nav-path="" d="M247.379 96.0117V192.022H241.82V96.0117H247.379Z" fill="currentColor" />
            <path data-nav-path="" d="M275.593 96.0117V192.022H265.94V96.0117H275.593Z" fill="currentColor" />
            <path data-nav-path="" d="M303.611 96.0117V192.022H290.252V96.0117H303.611Z" fill="currentColor" />
            <path data-nav-path="" d="M330.993 96.0117V192.022H315.2V96.0117H330.993Z" fill="currentColor" />
            <path data-nav-path="" d="M357.602 96.0117V192.022H340.896V96.0117H357.602Z" fill="currentColor" />
            <path data-nav-path="" d="M383.434 96.0117V192.022H367.392V96.0117H383.434Z" fill="currentColor" />
            <path data-nav-path="" d="M408.603 96.0117V192.022H394.58V96.0117H408.603Z" fill="currentColor" />
            <path data-nav-path="" d="M433.498 96.0117V192.022H421.992V96.0117H433.498Z" fill="currentColor" />
            <path data-nav-path="" d="M18.2549 96.0117V192.022H0V96.0117H18.2549Z" fill="currentColor" />
            <path data-nav-path="" d="M43.6694 96.0117V192.022H26.9358V96.0117H43.6694Z" fill="currentColor" />
            <path data-nav-path="" d="M68.2873 96.0117V192.022H54.6238V96.0117H68.2873Z" fill="currentColor" />
            <path data-nav-path="" d="M92.4606 96.0117V192.022H82.78V96.0117H92.4606Z" fill="currentColor" />
            <path data-nav-path="" d="M116.579 96.0117V192.022H110.992V96.0117H116.579Z" fill="currentColor" />
            <path data-nav-path="" d="M587.613 192.021V288.032H581.86V192.021H587.613Z" fill="currentColor" />
            <path data-nav-path="" d="M612.836 192.021V288.032H608.936V192.021H612.836Z" fill="currentColor" />
            <path data-nav-path="" d="M638.282 192.021V288.032H635.82V192.021H638.282Z" fill="currentColor" />
            <path data-nav-path="" d="M847.051 192.021V288.032H845.668V192.021H847.051Z" fill="currentColor" />
            <path data-nav-path="" d="M873.605 192.021V288.032H871.448V192.021H873.605Z" fill="currentColor" />
            <path data-nav-path="" d="M900.128 192.021V288.032H897.252V192.021H900.128Z" fill="currentColor" />
            <path data-nav-path="" d="M537.713 192.021V288.032H527.092V192.021H537.713Z" fill="currentColor" />
            <path data-nav-path="" d="M562.608 192.021V288.032H554.532V192.021H562.608Z" fill="currentColor" />
            <path data-nav-path="" d="M297.275 192.021V288.032H296.584V192.021H297.275Z" fill="currentColor" />
            <path data-nav-path="" d="M324.685 192.021V288.032H321.504V192.021H324.685Z" fill="currentColor" />
            <path data-nav-path="" d="M352.703 192.021V288.032H345.788V192.021H352.703Z" fill="currentColor" />
            <path data-nav-path="" d="M380.916 192.021V288.032H369.936V192.021H380.916Z" fill="currentColor" />
            <path data-nav-path="" d="M408.743 192.021V288.032H394.416V192.021H408.743Z" fill="currentColor" />
            <path data-nav-path="" d="M435.876 192.021V288.032H419.612V192.021H435.876Z" fill="currentColor" />
            <path data-nav-path="" d="M462.235 192.021V288.032H445.584V192.021H462.235Z" fill="currentColor" />
            <path data-nav-path="" d="M487.817 192.021V288.032H472.328V192.021H487.817Z" fill="currentColor" />
            <path data-nav-path="" d="M512.849 192.021V288.032H499.628V192.021H512.849Z" fill="currentColor" />
            <path data-nav-path="" d="M14.6867 192.021V288.032H3.56787V192.021H14.6867Z" fill="currentColor" />
            <path data-nav-path="" d="M42.3419 192.021V288.032H28.2358V192.021H42.3419Z" fill="currentColor" />
            <path data-nav-path="" d="M69.7825 192.021V288.032H53.1318V192.021H69.7825Z" fill="currentColor" />
            <path data-nav-path="" d="M96.7507 192.021V288.032H78.4958V192.021H96.7507Z" fill="currentColor" />
            <path data-nav-path="" d="M122.774 192.021V288.032H104.796V192.021H122.774Z" fill="currentColor" />
            <path data-nav-path="" d="M147.864 192.021V288.032H132.016V192.021H147.864Z" fill="currentColor" />
            <path data-nav-path="" d="M172.315 192.021V288.032H159.924V192.021H172.315Z" fill="currentColor" />
            <path data-nav-path="" d="M196.43 192.021V288.032H188.132V192.021H196.43Z" fill="currentColor" />
            <path data-nav-path="" d="M220.606 192.021V288.032H216.264V192.021H220.606Z" fill="currentColor" />
            <path data-nav-path="" d="M245.307 192.021V288.032H243.896V192.021H245.307Z" fill="currentColor" />
            <path data-nav-path="" d="M192.088 480.081V384.043H192.171V480.081H192.088Z" fill="currentColor" />
            <path data-nav-path="" d="M634.744 480.081V384.043H639.059V480.081H634.744Z" fill="currentColor" />
            <path data-nav-path="" d="M606.612 480.081V384.043H614.882V480.081H606.612Z" fill="currentColor" />
            <path data-nav-path="" d="M578.456 480.081V384.043H590.681V480.081H578.456Z" fill="currentColor" />
            <path data-nav-path="" d="M550.824 480.081V384.043H565.981V480.081H550.824Z" fill="currentColor" />
            <path data-nav-path="" d="M523.968 480.081V384.043H540.536V480.081H523.968Z" fill="currentColor" />
            <path data-nav-path="" d="M497.86 480.081V384.043H514.317V480.081H497.86Z" fill="currentColor" />
            <path data-nav-path="" d="M472.524 480.081V384.043H487.321V480.081H472.524Z" fill="currentColor" />
            <path data-nav-path="" d="M447.576 480.081V384.043H459.939V480.081H447.576Z" fill="currentColor" />
            <path data-nav-path="" d="M422.708 480.081V384.043H432.471V480.081H422.708Z" fill="currentColor" />
            <path data-nav-path="" d="M397.816 480.081V384.043H405.063V480.081H397.816Z" fill="currentColor" />
            <path data-nav-path="" d="M372.728 480.081V384.043H377.817V480.081H372.728Z" fill="currentColor" />
            <path data-nav-path="" d="M347.42 480.081V384.043H350.794V480.081H347.42Z" fill="currentColor" />
            <path data-nav-path="" d="M321.892 480.081V384.043H323.994V480.081H321.892Z" fill="currentColor" />
            <path data-nav-path="" d="M296.224 480.081V384.043H297.33V480.081H296.224Z" fill="currentColor" />
            <path data-nav-path="" d="M739.928 480.081V384.043H743.164V480.081H739.928Z" fill="currentColor" />
            <path data-nav-path="" d="M889.868 480.081V384.043H907.21V480.081H889.868Z" fill="currentColor" />
            <path data-nav-path="" d="M863.204 480.081V384.043H881.542V480.081H863.204Z" fill="currentColor" />
            <path data-nav-path="" d="M837.484 480.081V384.043H854.937V480.081H837.484Z" fill="currentColor" />
            <path data-nav-path="" d="M812.644 480.081V384.043H827.469V480.081H812.644Z" fill="currentColor" />
            <path data-nav-path="" d="M788.36 480.081V384.043H799.423V480.081H788.36Z" fill="currentColor" />
            <path data-nav-path="" d="M764.268 480.081V384.043H771.183V480.081H764.268Z" fill="currentColor" />
            <path data-nav-path="" d="M318.492 384.044V288.033H327.398V384.044H318.492Z" fill="currentColor" />
            <path data-nav-path="" d="M293.544 384.044V288.033H300.016V384.044H293.544Z" fill="currentColor" />
            <path data-nav-path="" d="M268.4 384.044V288.033H272.853V384.044H268.4Z" fill="currentColor" />
            <path data-nav-path="" d="M243.008 384.044V288.033H245.912V384.044H243.008Z" fill="currentColor" />
            <path data-nav-path="" d="M217.424 384.044V288.033H219.166V384.044H217.424Z" fill="currentColor" />
            <path data-nav-path="" d="M191.7 384.044V288.033H192.557V384.044H191.7Z" fill="currentColor" />
            <path data-nav-path="" d="M419.252 384.044V288.033H435.958V384.044H419.252Z" fill="currentColor" />
            <path data-nav-path="" d="M393.42 384.044V288.033H409.462V384.044H393.42Z" fill="currentColor" />
            <path data-nav-path="" d="M368.248 384.044V288.033H382.298V384.044H368.248Z" fill="currentColor" />
            <path data-nav-path="" d="M343.356 384.044V288.033H354.862V384.044H343.356Z" fill="currentColor" />
            <path data-nav-path="" d="M839.64 384.044V288.033H852.778V384.044H839.64Z" fill="currentColor" />
            <path data-nav-path="" d="M812.12 384.044V288.033H827.996V384.044H812.12Z" fill="currentColor" />
            <path data-nav-path="" d="M784.932 384.044V288.033H802.827V384.044H784.932Z" fill="currentColor" />
            <path data-nav-path="" d="M758.6 384.044V288.033H776.855V384.044H758.6Z" fill="currentColor" />
            <path data-nav-path="" d="M733.18 384.044V288.033H749.914V384.044H733.18Z" fill="currentColor" />
            <path data-nav-path="" d="M708.564 384.044V288.033H722.227V384.044H708.564Z" fill="currentColor" />
            <path data-nav-path="" d="M684.392 384.044V288.033H694.072V384.044H684.392Z" fill="currentColor" />
            <path data-nav-path="" d="M660.272 384.044V288.033H665.859V384.044H660.272Z" fill="currentColor" />
            <path data-nav-path="" d="M635.792 384.044V288.033H638.032V384.044H635.792Z" fill="currentColor" />
            <path data-nav-path="" d="M557.352 384.044V288.033H559.482V384.044H557.352Z" fill="currentColor" />
            <path data-nav-path="" d="M529.472 384.044V288.033H535.031V384.044H529.472Z" fill="currentColor" />
            <path data-nav-path="" d="M501.26 384.044V288.033H510.913V384.044H501.26Z" fill="currentColor" />
            <path data-nav-path="" d="M473.244 384.044V288.033H486.603V384.044H473.244Z" fill="currentColor" />
            <path data-nav-path="" d="M445.86 384.044V288.033H461.653V384.044H445.86Z" fill="currentColor" />
            <path data-nav-path="" d="M894.956 384.044V288.033H902.12V384.044H894.956Z" fill="currentColor" />
            <path data-nav-path="" d="M867.328 384.044V288.033H877.423V384.044H867.328Z" fill="currentColor" />
            <path data-nav-path="" d="M558.571 480.08V576.091H558.544V480.08H558.571Z" fill="currentColor" />
            <path data-nav-path="" d="M585.068 480.08V576.091H584.404V480.08H585.068Z" fill="currentColor" />
            <path data-nav-path="" d="M640.523 480.08V576.091H633.608V480.08H640.523Z" fill="currentColor" />
            <path data-nav-path="" d="M668.708 480.08V576.091H657.728V480.08H668.708Z" fill="currentColor" />
            <path data-nav-path="" d="M696.559 480.08V576.091H682.204V480.08H696.559Z" fill="currentColor" />
            <path data-nav-path="" d="M723.668 480.08V576.091H707.404V480.08H723.668Z" fill="currentColor" />
            <path data-nav-path="" d="M750.023 480.08V576.091H733.372V480.08H750.023Z" fill="currentColor" />
            <path data-nav-path="" d="M775.609 480.08V576.091H760.12V480.08H775.609Z" fill="currentColor" />
            <path data-nav-path="" d="M800.641 480.08V576.091H787.448V480.08H800.641Z" fill="currentColor" />
            <path data-nav-path="" d="M825.505 480.08V576.091H814.884V480.08H825.505Z" fill="currentColor" />
            <path data-nav-path="" d="M850.4 480.08V576.091H842.324V480.08H850.4Z" fill="currentColor" />
            <path data-nav-path="" d="M875.401 480.08V576.091H869.648V480.08H875.401Z" fill="currentColor" />
            <path data-nav-path="" d="M900.628 480.08V576.091H896.756V480.08H900.628Z" fill="currentColor" />
            <path data-nav-path="" d="M460.103 480.08V576.091H447.712V480.08H460.103Z" fill="currentColor" />
            <path data-nav-path="" d="M484.222 480.08V576.091H475.924V480.08H484.222Z" fill="currentColor" />
            <path data-nav-path="" d="M508.422 480.08V576.091H504.052V480.08H508.422Z" fill="currentColor" />
            <path data-nav-path="" d="M533.095 480.08V576.091H531.712V480.08H533.095Z" fill="currentColor" />
            <path data-nav-path="" d="M166.533 480.08V576.091H165.676V480.08H166.533Z" fill="currentColor" />
            <path data-nav-path="" d="M193.139 480.08V576.091H191.424V480.08H193.139Z" fill="currentColor" />
            <path data-nav-path="" d="M220.052 480.08V576.091H216.816V480.08H220.052Z" fill="currentColor" />
            <path data-nav-path="" d="M247.298 480.08V576.091H241.904V480.08H247.298Z" fill="currentColor" />
            <path data-nav-path="" d="M274.816 480.08V576.091H266.712V480.08H274.816Z" fill="currentColor" />
            <path data-nav-path="" d="M302.475 480.08V576.091H291.384V480.08H302.475Z" fill="currentColor" />
            <path data-nav-path="" d="M330.134 480.08V576.091H316.056V480.08H330.134Z" fill="currentColor" />
            <path data-nav-path="" d="M357.598 480.08V576.091H340.92V480.08H357.598Z" fill="currentColor" />
            <path data-nav-path="" d="M384.539 480.08V576.091H366.312V480.08H384.539Z" fill="currentColor" />
            <path data-nav-path="" d="M410.567 480.08V576.091H392.616V480.08H410.567Z" fill="currentColor" />
            <path data-nav-path="" d="M435.68 480.08V576.091H419.832V480.08H435.68Z" fill="currentColor" />
            <path data-nav-path="" d="M879.937 576.092V672.102H865.112V576.092H879.937Z" fill="currentColor" />
            <path data-nav-path="" d="M904.86 576.092V672.102H892.524V576.092H904.86Z" fill="currentColor" />
            <path data-nav-path="" d="M929.724 576.092V672.102H919.96V576.092H929.724Z" fill="currentColor" />
            <path data-nav-path="" d="M828.492 576.092V672.102H811.924V576.092H828.492Z" fill="currentColor" />
            <path data-nav-path="" d="M854.577 576.092V672.102H838.148V576.092H854.577Z" fill="currentColor" />
            <path data-nav-path="" d="M379.948 576.092V672.102H370.876V576.092H379.948Z" fill="currentColor" />
            <path data-nav-path="" d="M407.634 576.092V672.102H395.52V576.092H407.634Z" fill="currentColor" />
            <path data-nav-path="" d="M435.267 576.092V672.102H420.248V576.092H435.267Z" fill="currentColor" />
            <path data-nav-path="" d="M462.594 576.092V672.102H445.224V576.092H462.594Z" fill="currentColor" />
            <path data-nav-path="" d="M489.257 576.092V672.102H470.892V576.092H489.257Z" fill="currentColor" />
            <path data-nav-path="" d="M514.953 576.092V672.102H497.528V576.092H514.953Z" fill="currentColor" />
            <path data-nav-path="" d="M539.817 576.092V672.102H524.992V576.092H539.817Z" fill="currentColor" />
            <path data-nav-path="" d="M564.099 576.092V672.102H553.036V576.092H564.099Z" fill="currentColor" />
            <path data-nav-path="" d="M588.191 576.092V672.102H581.276V576.092H588.191Z" fill="currentColor" />
            <path data-nav-path="" d="M745.85 576.092V672.102H737.58V576.092H745.85Z" fill="currentColor" />
            <path data-nav-path="" d="M773.977 576.092V672.102H761.752V576.092H773.977Z" fill="currentColor" />
            <path data-nav-path="" d="M801.609 576.092V672.102H786.452V576.092H801.609Z" fill="currentColor" />
            <path data-nav-path="" d="M298.021 576.092V672.102H295.836V576.092H298.021Z" fill="currentColor" />
            <path data-nav-path="" d="M325.044 576.092V672.102H321.144V576.092H325.044Z" fill="currentColor" />
            <path data-nav-path="" d="M352.371 576.092V672.102H346.12V576.092H352.371Z" fill="currentColor" />
            <path data-nav-path="" d="M12.5279 576.092V672.102H5.72388V576.092H12.5279Z" fill="currentColor" />
            <path data-nav-path="" d="M38.1104 576.092V672.102H32.468V576.092H38.1104Z" fill="currentColor" />
            <path data-nav-path="" d="M63.6148 576.092V672.102H59.3V576.092H63.6148Z" fill="currentColor" />
            <path data-nav-path="" d="M89.1424 576.092V672.102H86.0999V576.092H89.1424Z" fill="currentColor" />
            <path data-nav-path="" d="M114.756 576.092V672.102H112.792V576.092H114.756Z" fill="currentColor" />
            <path data-nav-path="" d="M271.303 576.092V672.102H270.224V576.092H271.303Z" fill="currentColor" />
            <path data-nav-path="" d="M692.163 672.104V768.114H686.576V672.104H692.163Z" fill="currentColor" />
            <path data-nav-path="" d="M795.109 672.104V768.114H792.952V672.104H795.109Z" fill="currentColor" />
            <path data-nav-path="" d="M822.987 672.104V768.114H817.4V672.104H822.987Z" fill="currentColor" />
            <path data-nav-path="" d="M851.201 672.104V768.114H841.548V672.104H851.201Z" fill="currentColor" />
            <path data-nav-path="" d="M879.219 672.104V768.114H865.832V672.104H879.219Z" fill="currentColor" />
            <path data-nav-path="" d="M906.573 672.104V768.114H890.78V672.104H906.573Z" fill="currentColor" />
            <path data-nav-path="" d="M933.21 672.104V768.114H916.504V672.104H933.21Z" fill="currentColor" />
            <path data-nav-path="" d="M643.9 672.104V768.114H630.236V672.104H643.9Z" fill="currentColor" />
            <path data-nav-path="" d="M668.072 672.104V768.114H658.392V672.104H668.072Z" fill="currentColor" />
            <path data-nav-path="" d="M193.611 672.104V768.114H190.928V672.104H193.611Z" fill="currentColor" />
            <path data-nav-path="" d="M219.279 672.104V768.114H217.592V672.104H219.279Z" fill="currentColor" />
            <path data-nav-path="" d="M297.139 672.104V768.114H296.724V672.104H297.139Z" fill="currentColor" />
            <path data-nav-path="" d="M402.907 672.104V768.114H400.252V672.104H402.907Z" fill="currentColor" />
            <path data-nav-path="" d="M430.067 672.104V768.114H425.448V672.104H430.067Z" fill="currentColor" />
            <path data-nav-path="" d="M457.476 672.104V768.114H450.34V672.104H457.476Z" fill="currentColor" />
            <path data-nav-path="" d="M485.108 672.104V768.114H475.04V672.104H485.108Z" fill="currentColor" />
            <path data-nav-path="" d="M512.794 672.104V768.114H499.684V672.104H512.794Z" fill="currentColor" />
            <path data-nav-path="" d="M540.344 672.104V768.114H524.468V672.104H540.344Z" fill="currentColor" />
            <path data-nav-path="" d="M567.503 672.104V768.114H549.608V672.104H567.503Z" fill="currentColor" />
            <path data-nav-path="" d="M593.863 672.104V768.114H575.608V672.104H593.863Z" fill="currentColor" />
            <path data-nav-path="" d="M619.253 672.104V768.114H602.52V672.104H619.253Z" fill="currentColor" />
            <path data-nav-path="" d="M117.024 672.104V768.114H110.552V672.104H117.024Z" fill="currentColor" />
            <path data-nav-path="" d="M142.552 672.104V768.114H137.352V672.104H142.552Z" fill="currentColor" />
            <path data-nav-path="" d="M168.052 672.104V768.114H164.152V672.104H168.052Z" fill="currentColor" />
            <path data-nav-path="" d="M13.2192 672.104V768.114H5.05981V672.104H13.2192Z" fill="currentColor" />
            <path data-nav-path="" d="M39.4966 672.104V768.114H31.116V672.104H39.4966Z" fill="currentColor" />
            <path data-nav-path="" d="M65.5236 672.104V768.114H57.3918V672.104H65.5236Z" fill="currentColor" />
            <path data-nav-path="" d="M91.3559 672.104V768.114H83.8879V672.104H91.3559Z" fill="currentColor" />
          </svg>
        </div>

        <div className="nav_mega-contain u-container u-height-full">
          <div className="nav_mega-layout u-height-full u-grid-custom">
            <div className="nav_mega-col u-column-start-1 u-column-span-5 u-flex-vertical-nowrap u-align-items-start u-justify-content-end u-gap-8">
              <ul role="list" className="nav_mega-list u-flex-vertical-nowrap u-gap-4">
                {navLinks.map(({ label, url }) => {
                  const isActive = url !== '#' && pathname === url;
                  return (
                    <li key={url + label} data-nav-item="" className="nav_mega_list-item u-position-relative">
                      <Link
                        data-nav-link=""
                        href={url}
                        aria-current={isActive ? 'page' : undefined}
                        className={`nav_mega-link w-inline-block${isActive ? ' w--current' : ''}`}
                      >
                        <div data-nav-link-text="" className="nav_mega_link-text u-text-style-h2 u-text-transform-uppercase">
                          {label === 'About & Team' ? <>About &amp; Team</> : label}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
