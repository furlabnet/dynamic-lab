---
'@furlab/dynamic-lab': patch
'@furlab/the-lab-sans': patch
---

The source, issues and releases moved to GitHub (`itsfurlab/dynamic-lab`), and the docs to
https://itsfurlab.github.io/dynamic-lab/. Packages are published to npmjs.org only; the GitLab
package registry gets no new versions.

`@furlab/the-lab-sans` now lists `next`, `react` and `react-dom` as optional peer dependencies
instead of optional dependencies, so installing it no longer pulls in a second copy of Next.js
beside your app's.
