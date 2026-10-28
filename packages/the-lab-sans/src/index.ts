/**
 * The Lab Sans: family name, font stack and the list of faces the package ships.
 * The stylesheet (@furlab/the-lab-sans/the-lab-sans.css) is generated from `faces` at build time.
 */

try {
  require('./the-lab-sans.css')
} catch (error) {
  console.error('Could not find or load the CSS module file.')
}
export * from './hooks/font'
