import localFont from 'next/font/local'

// Browsers fetch only the faces the page actually uses, so skip preloading all sixteen files.
export const labSans = localFont({
  variable: '--font-the-lab',
  display: 'swap',
  preload: false,
  src: [
    { path: './font/TheLabSans-Thin.otf', weight: '100', style: 'normal' },
    { path: './font/TheLabSans-ThinIt.otf', weight: '100', style: 'italic' },
    { path: './font/TheLabSans-Light.otf', weight: '300', style: 'normal' },
    {
      path: './font/TheLabSans-LightIt.otf',
      weight: '300',
      style: 'italic',
    },
    { path: './font/TheLabSans.otf', weight: '400', style: 'normal' },
    {
      path: './font/TheLabSans-RegularIt.otf',
      weight: '400',
      style: 'italic',
    },
    { path: './font/TheLabSans-Medium.otf', weight: '500', style: 'normal' },
    {
      path: './font/TheLabSans-MediumIt.otf',
      weight: '500',
      style: 'italic',
    },
    {
      path: './font/TheLabSans-Semibold.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: './font/TheLabSans-SemiboldIt.otf',
      weight: '600',
      style: 'italic',
    },
    { path: './font/TheLabSans-Bold.otf', weight: '700', style: 'normal' },
    { path: './font/TheLabSans-BoldIt.otf', weight: '700', style: 'italic' },
    {
      path: './font/TheLabSans-Extrabold.otf',
      weight: '800',
      style: 'normal',
    },
    {
      path: './font/TheLabSans-ExtraboldIt.otf',
      weight: '800',
      style: 'italic',
    },
    { path: './font/TheLabSans-Black.otf', weight: '900', style: 'normal' },
    {
      path: './font/TheLabSans-BlackIt.otf',
      weight: '900',
      style: 'italic',
    },
  ],
})
