import type { Metadata } from 'next';
import Script from 'next/script';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnimationProvider from "@/components/ui/AnimationProvider";
import { getNavigation, getFooter, getSiteSettings } from "@/lib/sanity/queries";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: {
      default: settings?.siteTitle ?? 'Element BC',
      template: `%s | ${settings?.siteTitle ?? 'Element BC'}`,
    },
    description: settings?.seoDescription ?? 'Element BC — Building Consultancy',
  };
}

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [nav, footer] = await Promise.all([getNavigation(), getFooter()]);

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/gh/lumosframework/scripts@v1.1.1/theme-collector.js"
        strategy="beforeInteractive"
      />
      <AnimationProvider />
      <div aria-hidden="true" data-bg="current" className="bg-current"></div>
      <div className="page_wrap">
        <div className="page_overlay u-position-fixed u-fixed-overlay">
          {/* Nav */}
          <Navbar navLinks={nav?.navLinks} />
          {/* Preloader */}
          <div data-preloader-wrap="" className="preloader_wrap u-position-fixed u-theme-charcoal">
            <div className="preloader_contain u-container u-height-full">
              <div className="preloader_layout u-flex-vertical-nowrap u-height-full u-alignment-center">
                <svg className="preloader_svg-wrap u-position-absolute preloader_svg-wrap" data-preloader-svg="" width="100%" viewBox="0 0 301 319" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path data-preloader-path="" d="M33.9496 0H0V0.215596H33.9496C53.6393 0.215596 62.4575 7.54586 73.6104 7.54586H300.967V0H33.9496Z" fill="currentColor" className="preloader_svg-path"></path>
                  <path data-preloader-path="" d="M300.967 8.62988H0V9.0491H40.1277C59.8174 9.0491 68.6356 16.1757 79.7885 16.1757H300.967V8.62988Z" fill="currentColor" className="preloader_svg-path"></path>
                  <path data-preloader-path="" d="M300.967 17.2656H0V17.8885H46.3058C65.9955 17.8885 74.8137 24.8115 85.9666 24.8115H300.967V17.2656Z" fill="currentColor" className="preloader_svg-path"></path>
                  <path data-preloader-path="" d="M300.967 25.8955H0V26.722H52.4839C72.1736 26.722 80.9918 33.4414 92.1447 33.4414H300.967V25.8955Z" fill="currentColor" className="preloader_svg-path"></path>
                  <path data-preloader-path="" d="M300.967 34.5312H0V35.5613H58.662C78.3517 35.5613 87.1699 42.0771 98.3228 42.0771H300.967V34.5312Z" fill="currentColor" className="preloader_svg-path"></path>
                  <path data-preloader-path="" data-preloader-rogue="" d="M300.967 43.1611H0V44.3948H64.8401C84.5298 44.3948 93.348 50.707 104.501 50.707H300.967V43.1611Z" fill="currentColor" className="preloader_svg-path"></path>
                  <path data-preloader-path="" d="M300.967 51.791H0V53.2283H71.0182C90.7079 53.2283 99.5261 59.3369 110.679 59.3369H300.967V51.791Z" fill="currentColor" className="preloader_svg-path"></path>
                  <path data-preloader-path="" d="M300.967 60.4268H0V62.0677H77.1963C96.886 62.0677 105.704 67.9726 116.857 67.9726H300.967V60.4268Z" fill="currentColor" className="preloader_svg-path"></path>
                  <path data-preloader-path="" d="M300.967 69.0566H0V70.9012H83.3744C103.064 70.9012 111.882 76.6025 123.035 76.6025H300.967V69.0566Z" fill="currentColor" className="preloader_svg-path"></path>
                  <path data-preloader-path="" d="M300.967 77.6865H0V79.7347H89.5525C109.242 79.7347 118.06 85.2324 129.213 85.2324H300.967V77.6865Z" fill="currentColor" className="preloader_svg-path"></path>
                  <path data-preloader-path="" d="M300.967 86.3223H0V88.574H95.7306C115.42 88.574 124.238 93.8681 135.391 93.8681H300.967V86.3223Z" fill="currentColor" className="preloader_svg-path"></path>
                  <path data-preloader-path="" d="M300.967 94.9521H0V97.4076H101.909C121.598 97.4076 130.417 102.498 141.569 102.498H300.967V94.9521Z" fill="currentColor" className="preloader_svg-path"></path>
                  <path data-preloader-path="" d="M300.967 103.588H0V106.247H108.087C127.777 106.247 136.595 111.134 147.748 111.134H300.967V103.588Z" fill="currentColor" className="preloader_svg-path"></path>
                  <path data-preloader-path="" data-preloader-rogue="" d="M300.967 112.218H0V115.08H114.265C133.955 115.08 142.773 119.764 153.926 119.764H300.967V112.218Z" fill="currentColor" className="preloader_svg-path"></path>
                  <path data-preloader-path="" d="M300.967 120.848H0V123.914H120.443C140.133 123.914 148.951 128.394 160.104 128.394H300.967V120.848Z" fill="currentColor" className="preloader_svg-path"></path>
                  <path data-preloader-path="" d="M300.967 129.483H0V132.753H126.621C146.311 132.753 155.129 137.029 166.282 137.029H300.967V129.483Z" fill="currentColor" className="preloader_svg-path"></path>
                  <path data-preloader-path="" d="M300.967 138.113H0V141.587H132.799C152.489 141.587 161.307 145.659 172.46 145.659H300.967V138.113Z" fill="currentColor" className="preloader_svg-path"></path>
                  <path data-preloader-path="" d="M300.967 146.743H0V150.42H138.977C158.667 150.42 167.485 154.289 178.638 154.289H300.967V146.743Z" fill="currentColor" className="preloader_svg-path"></path>
                  <path data-preloader-path="" d="M300.967 155.379H0V159.26H145.155C164.845 159.26 173.663 162.925 184.816 162.925H300.967V155.379Z" fill="currentColor" className="preloader_svg-path"></path>
                  <path data-preloader-path="" d="M300.967 164.009H0V168.093H151.333C171.023 168.093 179.841 171.555 190.994 171.555H300.961V164.009H300.967Z" fill="currentColor" className="preloader_svg-path"></path>
                  <path data-preloader-path="" d="M300.967 172.645H0V176.932H157.512C177.201 176.932 186.019 180.19 197.172 180.19H300.961V172.645H300.967Z" fill="currentColor" className="preloader_svg-path"></path>
                  <path data-preloader-path="" d="M300.967 181.274H0V185.766H163.69C183.379 185.766 192.198 188.82 203.35 188.82H300.961V181.274H300.967Z" fill="currentColor" className="preloader_svg-path"></path>
                  <path data-preloader-path="" data-preloader-rogue="" d="M300.967 189.904H0V194.599H169.868C189.557 194.599 198.376 197.45 209.529 197.45H300.961V189.904H300.967Z" fill="currentColor" className="preloader_svg-path"></path>
                  <path data-preloader-path="" d="M300.967 198.54H0V203.439H176.046C195.736 203.439 204.554 206.086 215.707 206.086H300.961V198.54H300.967Z" fill="currentColor" className="preloader_svg-path"></path>
                  <path data-preloader-path="" d="M300.967 207.17H0V212.272H182.224C201.914 212.272 210.732 214.716 221.885 214.716H300.961V207.17H300.967Z" fill="currentColor" className="preloader_svg-path"></path>
                  <path data-preloader-path="" d="M300.967 215.8H0V221.106H188.402C208.092 221.106 216.91 223.346 228.063 223.346H300.961V215.8H300.967Z" fill="currentColor" className="preloader_svg-path"></path>
                  <path data-preloader-path="" d="M300.967 224.436H0V229.945H194.58C214.27 229.945 223.088 231.981 234.241 231.981H300.961V224.436H300.967Z" fill="currentColor" className="preloader_svg-path"></path>
                  <path data-preloader-path="" d="M300.967 233.065H0V238.779H200.758C220.448 238.779 229.266 240.611 240.419 240.611H300.961V233.065H300.967Z" fill="currentColor" className="preloader_svg-path"></path>
                  <path data-preloader-path="" d="M300.967 241.701H0V247.618H206.936C226.626 247.618 235.444 249.247 246.597 249.247H300.961V241.701H300.967Z" fill="currentColor" className="preloader_svg-path"></path>
                  <path data-preloader-path="" d="M300.967 250.331H0V256.452H213.115C232.804 256.452 241.622 257.877 252.775 257.877H300.961V250.331H300.967Z" fill="currentColor" className="preloader_svg-path"></path>
                  <path data-preloader-path="" data-preloader-rogue="" d="M300.967 258.961H0V265.285H219.293C238.982 265.285 247.8 266.507 258.953 266.507H300.961V258.961H300.967Z" fill="currentColor" className="preloader_svg-path"></path>
                  <path data-preloader-path="" d="M300.967 267.597H0V274.124H225.471C245.16 274.124 253.979 275.143 265.131 275.143H300.961V267.597H300.967Z" fill="currentColor" className="preloader_svg-path"></path>
                  <path data-preloader-path="" d="M300.967 276.227H0V282.958H231.649C251.338 282.958 260.157 283.772 271.31 283.772H300.961V276.227H300.967Z" fill="currentColor" className="preloader_svg-path"></path>
                  <path data-preloader-path="" d="M300.967 284.862H0V291.797H237.827C257.517 291.797 266.335 292.408 277.488 292.408H300.961V284.862H300.967Z" fill="currentColor" className="preloader_svg-path"></path>
                  <path data-preloader-path="" d="M300.967 293.492H0V300.631H244.005C263.695 300.631 272.513 301.038 283.666 301.038H300.961V293.492H300.967Z" fill="currentColor" className="preloader_svg-path"></path>
                  <path data-preloader-path="" d="M300.967 302.122H0V309.464H250.183C269.873 309.464 278.691 309.668 289.844 309.668H300.961V302.122H300.967Z" fill="currentColor" className="preloader_svg-path"></path>
                  <path data-preloader-path="" d="M256.361 310.758H0V318.304H300.967V310.758H256.367H256.361Z" fill="currentColor" className="preloader_svg-path"></path>
                </svg>
                <div className="preloader_text-wrap">
                  <h2 data-preloader-text="" className="preloader_text u-text-style-h2 u-text-transform-uppercase u-text-decoration-justify-last"><span data-preloader-word="" className="preloader_text-span">The</span> <span data-preloader-word="" className="preloader_text-span">Smallest</span><br /><span data-preloader-word="" className="preloader_text-span">Details</span> <span data-preloader-word="" className="preloader_text-span">Shape</span><br /><span data-preloader-word="" className="preloader_text-span">The</span> <span data-preloader-word="" className="preloader_text-span">Strongest</span><br /><span data-preloader-word="" className="preloader_text-span">Results</span></h2>
                </div>
                <div className="preloader_end-wrap u-position-absolute">
                  <svg width="100%" viewBox="0 0 178 33" fill="none" xmlns="http://www.w3.org/2000/svg" data-preloader-end-svg="" className="preloader_end-svg">
                    <path d="M19.9056 0.505233V3.83078C19.9056 4.11352 19.677 4.3424 19.3945 4.3424H0.512051C-0.0561726 4.3424 -0.200753 5.1334 0.330485 5.33199L9.72466 8.88978C9.78182 8.91334 9.84234 8.92344 9.90623 8.92344H19.3979C19.6803 8.92344 19.909 9.15232 19.909 9.43506V13.5045H0.512051C-0.0561726 13.5045 -0.200753 14.2921 0.330485 14.4941L9.72466 18.0519C9.78182 18.0754 9.84234 18.0855 9.90623 18.0855H19.3979C19.6803 18.0855 19.909 18.3144 19.909 18.5971V22.6666H0.512051C-0.0561726 22.6666 -0.200753 23.4576 0.330485 23.6595L24.9154 32.9663C24.9725 32.9899 25.0331 33 25.0969 33H46.6894C46.9719 33 47.2005 32.7711 47.2005 32.4884V28.7758C47.2005 28.5637 47.066 28.3718 46.8676 28.2978L37.7155 24.8342C37.1843 24.6323 37.3289 23.8413 37.8971 23.8413H46.6861C46.9685 23.8413 47.1971 23.6124 47.1971 23.3297V19.617C47.1971 19.405 47.0626 19.2131 46.8643 19.1391L37.7122 15.6755C37.1809 15.4736 37.3255 14.6826 37.8937 14.6826H46.6827C46.9651 14.6826 47.1938 14.4537 47.1938 14.1709V10.455C47.1938 10.2429 47.0593 10.051 46.8609 9.97698L20.5949 0.033998C20.262 -0.0939076 19.9022 0.155176 19.9022 0.511966" fill="currentColor" data-preloader-end-icon="" className="preloader_end-icon"></path>
                    <g clipPath="url(#clip0_2506_1048)" data-preloader-end-word="" className="preloader_end-word-wrap">
                      <path d="M65.9767 28.0081C63.5234 28.0081 61.614 27.3041 60.2487 25.8961C58.8834 24.4668 58.2007 22.5041 58.2007 20.0081C58.2007 18.3655 58.51 16.9468 59.1287 15.7521C59.7687 14.5361 60.654 13.6081 61.7847 12.9681C62.9367 12.3067 64.302 11.9761 65.8807 11.9761C68.1207 11.9761 69.8807 12.6694 71.1607 14.0561C72.4621 15.4428 73.1127 17.3415 73.1127 19.7521C73.1127 19.9228 73.1127 20.0935 73.1127 20.2641C73.1127 20.4348 73.1021 20.6161 73.0807 20.8081H59.5447V18.8561H71.3527L70.5847 19.6561C70.5847 18.5041 70.3927 17.5121 70.0087 16.6801C69.6461 15.8481 69.1127 15.2188 68.4087 14.7921C67.7047 14.3441 66.862 14.1201 65.8807 14.1201C64.814 14.1201 63.8967 14.3654 63.1287 14.8561C62.382 15.3255 61.7954 15.9975 61.3687 16.8721C60.9634 17.7468 60.7607 18.7921 60.7607 20.0081C60.7607 21.8428 61.2194 23.2721 62.1367 24.2961C63.054 25.2988 64.3447 25.8001 66.0087 25.8001C67.0327 25.8001 67.9073 25.5975 68.6327 25.1921C69.3581 24.7655 69.9767 24.1788 70.4887 23.4321L72.7287 24.3601C71.2994 26.7921 69.0487 28.0081 65.9767 28.0081Z" fill="currentColor" data-preloader-end-path="" className="preloader_end-letter"></path>
                      <path d="M77.1606 27.624V5.672L79.8486 5V27.624H77.1606Z" fill="currentColor" data-preloader-end-path="" className="preloader_end-letter"></path>
                      <path d="M91.9767 28.0081C89.5234 28.0081 87.6141 27.3041 86.2487 25.8961C84.8834 24.4668 84.2007 22.5041 84.2007 20.0081C84.2007 18.3655 84.5101 16.9468 85.1287 15.7521C85.7687 14.5361 86.6541 13.6081 87.7847 12.9681C88.9367 12.3067 90.3021 11.9761 91.8807 11.9761C94.1207 11.9761 95.8807 12.6694 97.1607 14.0561C98.4621 15.4428 99.1127 17.3415 99.1127 19.7521C99.1127 19.9228 99.1127 20.0935 99.1127 20.2641C99.1127 20.4348 99.1021 20.6161 99.0807 20.8081H85.5447V18.8561H97.3527L96.5847 19.6561C96.5847 18.5041 96.3927 17.5121 96.0087 16.6801C95.6461 15.8481 95.1127 15.2188 94.4087 14.7921C93.7047 14.3441 92.8621 14.1201 91.8807 14.1201C90.8141 14.1201 89.8967 14.3654 89.1287 14.8561C88.3821 15.3255 87.7954 15.9975 87.3687 16.8721C86.9634 17.7468 86.7607 18.7921 86.7607 20.0081C86.7607 21.8428 87.2194 23.2721 88.1367 24.2961C89.0541 25.2988 90.3447 25.8001 92.0087 25.8001C93.0327 25.8001 93.9074 25.5975 94.6327 25.1921C95.3581 24.7655 95.9767 24.1788 96.4887 23.4321L98.7287 24.3601C97.2994 26.7921 95.0487 28.0081 91.9767 28.0081Z" fill="currentColor" data-preloader-end-path="" className="preloader_end-letter"></path>
                      <path d="M103.161 27.6241V12.3601H105.305L105.849 15.4321V27.6241H103.161ZM113.049 27.6241V17.8001C113.049 16.7121 112.75 15.8801 112.153 15.3041C111.577 14.7067 110.766 14.4081 109.721 14.4081C108.889 14.4081 108.142 14.5894 107.481 14.9521C106.841 15.3148 106.265 15.8588 105.753 16.5841L104.953 15.0481C106.105 13.0001 107.865 11.9761 110.233 11.9761C111.961 11.9761 113.305 12.4774 114.265 13.4801C115.246 14.4827 115.737 15.8481 115.737 17.5761V27.6241H113.049ZM122.905 27.6241V17.8001C122.905 16.7121 122.606 15.8801 122.009 15.3041C121.433 14.7067 120.622 14.4081 119.577 14.4081C118.702 14.4081 117.891 14.6321 117.145 15.0801C116.398 15.5068 115.747 16.1361 115.193 16.9681L114.265 15.2721C114.905 14.1627 115.715 13.3414 116.697 12.8081C117.699 12.2534 118.841 11.9761 120.121 11.9761C121.87 11.9761 123.214 12.4667 124.153 13.4481C125.113 14.4294 125.593 15.8055 125.593 17.5761V27.6241H122.905Z" fill="currentColor" data-preloader-end-path="" className="preloader_end-letter"></path>
                      <path d="M136.977 28.0081C134.523 28.0081 132.614 27.3041 131.249 25.8961C129.883 24.4668 129.201 22.5041 129.201 20.0081C129.201 18.3655 129.51 16.9468 130.129 15.7521C130.769 14.5361 131.654 13.6081 132.785 12.9681C133.937 12.3067 135.302 11.9761 136.881 11.9761C139.121 11.9761 140.881 12.6694 142.161 14.0561C143.462 15.4428 144.113 17.3415 144.113 19.7521C144.113 19.9228 144.113 20.0935 144.113 20.2641C144.113 20.4348 144.102 20.6161 144.081 20.8081H130.545V18.8561H142.353L141.585 19.6561C141.585 18.5041 141.393 17.5121 141.009 16.6801C140.646 15.8481 140.113 15.2188 139.409 14.7921C138.705 14.3441 137.862 14.1201 136.881 14.1201C135.814 14.1201 134.897 14.3654 134.129 14.8561C133.382 15.3255 132.795 15.9975 132.369 16.8681C131.963 17.7428 131.761 18.7921 131.761 20.0081C131.761 21.8428 132.219 23.2721 133.137 24.2961C134.054 25.2988 135.345 25.8001 137.009 25.8001C138.033 25.8001 138.907 25.5975 139.633 25.1881C140.358 24.7655 140.977 24.1748 141.489 23.4321L143.729 24.3601C142.299 26.7921 140.049 28.0081 136.977 28.0081Z" fill="currentColor" data-preloader-end-path="" className="preloader_end-letter"></path>
                      <path d="M148.161 27.6241V12.3601H150.305L150.849 15.4321V27.6241H148.161ZM158.817 27.6241V17.9921C158.817 16.8615 158.497 15.9868 157.857 15.3681C157.238 14.7281 156.374 14.4081 155.265 14.4081C153.43 14.4081 151.926 15.1975 150.753 16.7761L149.953 15.2401C151.275 13.0641 153.217 11.9761 155.777 11.9761C157.59 11.9761 158.998 12.4881 160.001 13.5121C161.004 14.5361 161.505 15.9548 161.505 17.7681V27.6241H158.817Z" fill="currentColor" data-preloader-end-path="" className="preloader_end-letter"></path>
                      <path d="M172.753 28.0081C171.153 28.0081 169.905 27.5708 169.009 26.6961C168.134 25.8215 167.697 24.5735 167.697 22.9521V8.10413L170.385 7.43213V22.8241C170.385 23.7201 170.62 24.4135 171.089 24.9041C171.58 25.3735 172.273 25.6081 173.169 25.6081C173.553 25.6081 173.937 25.5548 174.321 25.4481C174.726 25.3415 175.121 25.2028 175.505 25.0321L176.241 27.2401C175.196 27.7521 174.033 28.0081 172.753 28.0081ZM164.657 14.7281V12.3601H175.473V14.7281H164.657Z" fill="currentColor" data-preloader-end-path="" className="preloader_end-letter"></path>
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          {/* Preloader 2 */}
          <div data-preloader2-wrap=" " className="preloader2-wrap u-position-fixed u-theme-charcoal">
            <div className="preloader2_contain u-container u-height-full u-flex-vertical-nowrap u-alignment-center">
              <div data-preloader2-text=" " className="preloader2_text u-text-style-h2 u-text-transform-uppercase">Loading</div>
            </div>
          </div>
          {/* Cursor Marquee */}
          <div data-cursor-marquee-status=" " className="cursor-marquee_wrap">
            <div className="cursor-marquee_card">
              <div className="cursor-marquee_track">
                <span data-cursor-marquee-text-target=" " className="cursor-marquee_text u-text-style-main u-text-transform-uppercase"></span>
                <span data-cursor-marquee-text-target=" " className="cursor-marquee_text is-duplicate u-text-style-main u-text-transform-uppercase"></span>
              </div>
            </div>
          </div>
          {/* Scroll Track */}
          <div className="scroll-wrap u-position-fixed u-pointer-off">
            <div data-scroll-track=" " className="scroll-track u-position-absolute u-pointer-on">
              <div data-scroll-thumb=" " className="scroll-thumb u-position-absolute"></div>
            </div>
          </div>
        </div>
        <div className="page_main">
          {children}
        </div>
        <Footer
          navLinks={footer?.footerNavLinks}
          legalLinks={footer?.legalLinks}
          builtByText={footer?.builtByText}
          builtByUrl={footer?.builtByUrl}
        />
      </div>
    </>
  );
}
