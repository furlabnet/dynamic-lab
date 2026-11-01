/**
 * The Lab Sans: family name, font stack and the list of faces the package ships.
 * The stylesheet (@furlab/the-lab-sans/the-lab-sans.css) is generated from `faces` at build time.
 */

// Pulls the generated stylesheet into the build, where tsdown extracts it to
// dist/the-lab-sans.css. Apps that load this file from source in the browser (the @furlab/source
// condition) have no `require` and import the built stylesheet themselves, so it's skipped there.
if (typeof require === 'function') require('./the-lab-sans.css')
export * from './hooks/font'
