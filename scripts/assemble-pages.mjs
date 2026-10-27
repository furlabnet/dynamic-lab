#!/usr/bin/env node
/**
 * Put the built apps together into public/ for GitLab Pages:
 *
 *   public/            apps/landing/dist
 *   public/showcase/   apps/showcase/dist
 *   public/docs/       apps/docs/dist
 *   public/the-lab-sans/  apps/the-lab-sans/dist
 *
 * Run `yarn pages`, which builds the apps first. Each app uses relative asset paths, so the result
 * works at the root of a Pages domain and under a project path alike.
 */
import { cpSync, existsSync, rmSync } from 'node:fs'

const root = new URL('../', import.meta.url)
const out = new URL('public/', root)
const apps = [
  ['apps/landing/dist/', ''],
  ['apps/showcase/dist/', 'showcase/'],
  ['apps/docs/dist/', 'docs/'],
  ['apps/the-lab-sans/dist/', 'the-lab-sans/'],
]

rmSync(out, { recursive: true, force: true })
for (const [from, to] of apps) {
  const src = new URL(from, root)
  if (!existsSync(src)) {
    console.error(`✖ ${from} is missing. Build the apps first (yarn pages does).`)
    process.exit(1)
  }
  cpSync(src, new URL(to, out), { recursive: true })
  console.log(`• ${from} → public/${to}`)
}
console.log('✔ public/ is ready')
