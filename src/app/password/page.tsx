'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function PasswordForm() {
  const searchParams = useSearchParams();
  const hasError = searchParams.get('error') === '1';

  return (
    <div data-theme="buff" className="u-min-height-screen u-flex-vertical-nowrap u-alignment-center u-justify-content-center" style={{ backgroundColor: 'var(--_theme---background)', color: 'var(--_theme---text)' }}>
      <div className="u-flex-vertical-nowrap u-alignment-center u-gap-5" style={{ maxWidth: '24rem', width: '100%', padding: '0 1.5rem' }}>

        {/* Logo */}
        <svg width="100%" viewBox="0 0 177 33" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ maxWidth: '8rem' }}>
          <path d="M19.9056 0.505233V3.83078C19.9056 4.11352 19.677 4.3424 19.3945 4.3424H0.512051C-0.0561726 4.3424 -0.200753 5.1334 0.330485 5.33199L9.72466 8.88978C9.78182 8.91334 9.84234 8.92344 9.90623 8.92344H19.3979C19.6803 8.92344 19.909 9.15232 19.909 9.43506V13.5045H0.512051C-0.0561726 13.5045 -0.200753 14.2921 0.330485 14.4941L9.72466 18.0519C9.78182 18.0754 9.84234 18.0855 9.90623 18.0855H19.3979C19.6803 18.0855 19.909 18.3144 19.909 18.5971V22.6666H0.512051C-0.0561726 22.6666 -0.200753 23.4576 0.330485 23.6595L24.9154 32.9663C24.9725 32.9899 25.0331 33 25.0969 33H46.6894C46.9719 33 47.2005 32.7711 47.2005 32.4884V28.7758C47.2005 28.5637 47.066 28.3718 46.8676 28.2978L37.7155 24.8342C37.1843 24.6323 37.3289 23.8413 37.8971 23.8413H46.6861C46.9685 23.8413 47.1971 23.6124 47.1971 23.3297V19.617C47.1971 19.405 47.0626 19.2131 46.8643 19.1391L37.7122 15.6755C37.1809 15.4736 37.3255 14.6826 37.8937 14.6826H46.6827C46.9651 14.6826 47.1938 14.4537 47.1938 14.1709V10.455C47.1938 10.2429 47.0593 10.051 46.8609 9.97698L20.5949 0.033998C20.262 -0.0939076 19.9022 0.155176 19.9022 0.511966" fill="currentColor" />
        </svg>

        <div className="u-text-style-small u-text-transform-uppercase u-weight-bold" style={{ letterSpacing: '0.1em' }}>Enter Password</div>

        <form action="/api/auth" method="POST" className="u-flex-vertical-nowrap u-gap-3" style={{ width: '100%' }}>
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoFocus
            required
            className="u-text-style-main u-text-transform-uppercase"
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              border: '1px solid var(--_theme---border)',
              backgroundColor: 'transparent',
              color: 'currentColor',
              outline: 'none',
              textAlign: 'center',
              letterSpacing: '0.05em',
            }}
          />
          {hasError && (
            <div className="u-text-style-small" style={{ color: 'var(--_red---swatch--brand-500)', textAlign: 'center' }}>
              Incorrect password. Please try again.
            </div>
          )}
          <button
            type="submit"
            className="u-text-style-small u-text-transform-uppercase u-weight-bold"
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              backgroundColor: 'currentColor',
              color: 'var(--_theme---background)',
              border: 'none',
              cursor: 'pointer',
              letterSpacing: '0.1em',
            }}
          >
            Enter
          </button>
        </form>

      </div>
    </div>
  );
}

export default function PasswordPage() {
  return (
    <Suspense>
      <PasswordForm />
    </Suspense>
  );
}
