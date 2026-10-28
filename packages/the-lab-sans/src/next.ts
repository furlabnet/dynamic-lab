import localFont from 'next/font/local'

// Browsers fetch only the faces the page actually uses, so skip preloading all sixteen files.
export const TheLabSans = localFont({
  variable: '--font-the-lab-sans',
  display: 'swap',
  preload: false,
  src: [
    { path: './fonts/otf/TheLabSans-Thin.otf', weight: '100', style: 'normal' },
    { path: './fonts/otf/TheLabSans-ThinIt.otf', weight: '100', style: 'italic' },
    { path: './fonts/otf/TheLabSans-Light.otf', weight: '300', style: 'normal' },
    {
      path: './fonts/otf/TheLabSans-LightIt.otf',
      weight: '300',
      style: 'italic',
    },
    { path: './fonts/otf/TheLabSans-Regular.otf', weight: '400', style: 'normal' },
    {
      path: './fonts/otf/TheLabSans-RegularIt.otf',
      weight: '400',
      style: 'italic',
    },
    { path: './fonts/otf/TheLabSans-Medium.otf', weight: '500', style: 'normal' },
    {
      path: './fonts/otf/TheLabSans-MediumIt.otf',
      weight: '500',
      style: 'italic',
    },
    {
      path: './fonts/otf/TheLabSans-Semibold.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: './fonts/otf/TheLabSans-SemiboldIt.otf',
      weight: '600',
      style: 'italic',
    },
    { path: './fonts/otf/TheLabSans-Bold.otf', weight: '700', style: 'normal' },
    { path: './fonts/otf/TheLabSans-BoldIt.otf', weight: '700', style: 'italic' },
    {
      path: './fonts/otf/TheLabSans-Extrabold.otf',
      weight: '800',
      style: 'normal',
    },
    {
      path: './fonts/otf/TheLabSans-ExtraboldIt.otf',
      weight: '800',
      style: 'italic',
    },
    { path: './fonts/otf/TheLabSans-Black.otf', weight: '900', style: 'normal' },
    {
      path: './fonts/otf/TheLabSans-BlackIt.otf',
      weight: '900',
      style: 'italic',
    },
  ],
})
