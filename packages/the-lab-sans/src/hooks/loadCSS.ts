import fs from 'fs'
import path from 'path'

export default async function loadCSSModule(fileName: string) {
  const cssPath = path.resolve(import.meta.dirname, fileName)
  console.log(`Attempting to load CSS module from: ${cssPath}`)
  try {
    if (fs.existsSync(cssPath)) {
      console.log('File exists! Proceeding with layout injection.')
      // In SSR frameworks you might pass this path to your HTML head template
    } else {
      console.warn('CSS file not found. Using fallback stylesheet.')
    }
  } catch (error) {
    console.error('Could not find or load the CSS module file.')
  }
}
