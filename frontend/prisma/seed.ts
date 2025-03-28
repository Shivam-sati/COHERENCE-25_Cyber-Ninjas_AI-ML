import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      role: UserRole.ADMIN,
    },
  });

  // Create recruiter user
  const recruiterPassword = await bcrypt.hash('recruiter123', 10);
  const recruiter = await prisma.user.upsert({
    where: { email: 'recruiter@example.com' },
    update: {},
    create: {
      email: 'recruiter@example.com',
      name: 'Recruiter User',
      password: recruiterPassword,
      role: UserRole.RECRUITER,
    },
  });

  // Create manager user
  const managerPassword = await bcrypt.hash('manager123', 10);
  const manager = await prisma.user.upsert({
    where: { email: 'manager@example.com' },
    update: {},
    create: {
      email: 'manager@example.com',
      name: 'Manager User',
      password: managerPassword,
      role: UserRole.MANAGER,
    },
  });

  // Create sample company
  const company = await prisma.company.upsert({
    where: { name: 'Tech Corp' },
    update: {},
    create: {
      name: 'Tech Corp',
      description: 'A leading technology company',
      website: 'https://techcorp.com',
      userId: admin.id,
      settings: {
        create: {
          requiredSkills: ['JavaScript', 'React', 'Node.js'],
          preferredSkills: ['TypeScript', 'AWS', 'Docker'],
          minExperience: 3,
          maxExperience: 10,
          educationLevel: 'Bachelor',
          location: 'San Francisco',
          remotePolicy: 'Hybrid',
        },
      },
    },
  });

  // Create sample resume
  const resume = await prisma.resume.upsert({
    where: { title: 'Sample Resume' },
    update: {},
    create: {
      title: 'Sample Resume',
      content: 'Sample resume content...',
      fileType: 'pdf',
      userId: admin.id,
      companyId: company.id,
    },
  });

  // Create sample analysis
  await prisma.analysis.upsert({
    where: { id: 'sample-analysis' },
    update: {},
    create: {
      id: 'sample-analysis',
      resumeId: resume.id,
      userId: admin.id,
      skills: ['JavaScript', 'React', 'Node.js'],
      sentiment: 'positive',
      confidence: 0.85,
      keyPhrases: ['experienced', 'motivated', 'team player'],
      overallScore: 85.5,
      strengths: ['Strong technical background', 'Good communication skills'],
      improvements: ['Could benefit from more cloud experience'],
      recommendations: ['Consider AWS certification'],
      culturalFit: 0.9,
    },
  });

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 