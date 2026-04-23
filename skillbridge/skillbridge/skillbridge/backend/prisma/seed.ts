import { PrismaClient, Role, AttendanceStatus } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create institution
  const institution = await prisma.institution.create({
    data: { name: 'Delhi Skill Institute' }
  })

  // Create users (you'll update clerkUserId after signing up)
  const student = await prisma.user.create({
    data: {
      clerkUserId: 'placeholder_student',
      name: 'Rahul Sharma',
      email: 'student@test.com',
      role: Role.STUDENT,
      institutionId: institution.id,
    }
  })

  const trainer = await prisma.user.create({
    data: {
      clerkUserId: 'placeholder_trainer',
      name: 'Priya Singh',
      email: 'trainer@test.com',
      role: Role.TRAINER,
      institutionId: institution.id,
    }
  })

  // Create batch
  const batch = await prisma.batch.create({
    data: {
      name: 'Batch A - Web Dev',
      institutionId: institution.id,
    }
  })

  // Link trainer and student to batch
  await prisma.batchTrainer.create({
    data: { batchId: batch.id, trainerId: trainer.id }
  })

  await prisma.batchStudent.create({
    data: { batchId: batch.id, studentId: student.id }
  })

  // Create a session
  const session = await prisma.session.create({
    data: {
      batchId: batch.id,
      trainerId: trainer.id,
      title: 'HTML & CSS Basics',
      date: new Date(),
      startTime: '10:00',
      endTime: '12:00',
    }
  })

  // Create attendance record
  await prisma.attendance.create({
    data: {
      sessionId: session.id,
      studentId: student.id,
      status: AttendanceStatus.PRESENT,
    }
  })

  console.log('Done! Database seeded.')
}

main().catch(console.error).finally(() => prisma.$disconnect())