import React from 'react'

/* Brand marks for the header links. Lucide has no brand icons, so these are inline (from Simple Icons). */

type LogoProps = React.SVGProps<SVGSVGElement>

export function GitLabLogo(props: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="m23.6 9.593-.033-.086L20.3.98a.851.851 0 0 0-.336-.405.875.875 0 0 0-1 .054.875.875 0 0 0-.29.44L16.47 7.818H7.537L5.333 1.07a.857.857 0 0 0-.29-.441.875.875 0 0 0-1-.054.859.859 0 0 0-.336.405L.433 9.502l-.032.086a6.066 6.066 0 0 0 2.012 7.01l.01.009.03.021 4.977 3.727 2.462 1.863 1.5 1.132a1.008 1.008 0 0 0 1.22 0l1.499-1.132 2.461-1.863 5.006-3.75.013-.01a6.068 6.068 0 0 0 2.01-7.002z" />
    </svg>
  )
}

export function NpmLogo(props: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z" />
    </svg>
  )
}
