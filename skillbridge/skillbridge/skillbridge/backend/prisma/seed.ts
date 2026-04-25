// ❌ import process from 'node:process'
// ✅ just use process directly — it's a global in Node.js
import { prisma } from '../src/lib/prisma'

async function main() {
  // your seed logic
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())