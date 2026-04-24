import type { Metadata } from "next";
import localFont from "next/font/local";

const adelphi = localFont({
  src: "../../public/fonts/AdelphiPEVFWeb-All.woff2",
  variable: "--font-adelphi",
  weight: "100 900",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Element BC",
  description: "Element BC — Building Consultancy",
};

/**
 * Dead-simple inline diagnostic. Runs as a plain <script> the moment the
 * browser reaches <head>, independent of React. If the user adds ?debug=1
 * to the URL they get a pinned black pill in the bottom-left that:
 *   - proves JS executes at all (no React, no Next, no hydration needed)
 *   - logs each milestone (animUtils ready, preloader complete, React
 *     mounted) so we can tell which step is stalling on mobile.
 *
 * AnimationProvider picks up the same element and appends more logs via
 * its own useEffect (`__debugHud.log(...)` calls below).
 */
const debugBootScript = `
(function(){
  try {
    if (!/[?&]debug=1(?:$|&)/.test(location.search)) return;
    var h = document.createElement('div');
    h.id = '__fc_debug';
    h.style.cssText = 'position:fixed;bottom:8px;left:8px;z-index:2147483647;background:rgba(0,0,0,.92);color:#fff;padding:8px 10px;font:11px/1.4 monospace;border-radius:6px;max-width:92vw;white-space:pre;pointer-events:none;';
    h.textContent = 'boot: JS running\\ntouch: ' + (('ontouchstart' in window) || navigator.maxTouchPoints > 0);
    var attach = function(){
      if (document.body) {
        document.body.appendChild(h);
      } else {
        setTimeout(attach, 10);
      }
    };
    attach();
    window.__debugHud = {
      el: h,
      log: function(msg){ h.textContent += '\\n' + msg; }
    };
    window.addEventListener('animUtils:ready', function(){ window.__debugHud.log('animUtils:ready'); });
    window.addEventListener('preloader:complete', function(){ window.__debugHud.log('preloader:complete'); });
    window.addEventListener('error', function(e){ window.__debugHud.log('ERR: ' + (e.message || e)); });
  } catch (e) { /* silent */ }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={adelphi.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: debugBootScript }} />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
