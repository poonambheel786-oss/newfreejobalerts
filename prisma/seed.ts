import { PrismaClient } from '../src/generated/prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import dotenv from 'dotenv'

dotenv.config()

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const statesList = [
  "All India", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", 
  "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", 
  "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", 
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", 
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", 
  "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi (NCT)", 
  "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
]

const categoriesList = [
  "All India Govt Jobs", "State Govt Jobs", "Nursing Jobs", "Bank Jobs", 
  "Teaching Jobs", "Railway Jobs", "Engineering Jobs", "Police/Defence Jobs", 
  "Agriculture Jobs", "College Entrance Exams", "Admit Cards", "Results"
]

async function main() {
  console.log('Seeding states...')
  for (const name of statesList) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    await prisma.state.upsert({
      where: { slug },
      update: { name },
      create: { name, slug }
    })
  }

  console.log('Seeding categories...')
  for (const name of categoriesList) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    await prisma.category.upsert({
      where: { slug },
      update: { name },
      create: { name, slug }
    })
  }

  // Create a default department
  console.log('Seeding default department...')
  await prisma.department.upsert({
    where: { slug: 'general' },
    update: { name: 'General Recruitment' },
    create: { name: 'General Recruitment', slug: 'general' }
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await pool.end()
  })
