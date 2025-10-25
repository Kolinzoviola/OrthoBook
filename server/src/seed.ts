import prisma from './db.js';

async function seed() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.appointment.deleteMany();
  await prisma.visitType.deleteMany();

  // Seed visit types
  const visitTypes = [
    {
      id: 'video',
      name: 'Video Consultation',
      duration: 20,
      description: 'Virtual consultation with Dr. Collins via secure video call',
    },
    {
      id: 'in-person',
      name: 'In-Person Consultation',
      duration: 30,
      description: 'Face-to-face consultation at our clinic',
    },
  ];

  for (const visitType of visitTypes) {
    await prisma.visitType.create({
      data: visitType,
    });
  }

  console.log('Created visit types');

  // Seed sample appointments
  const sampleAppointments = [
    {
      visitType: 'InPerson',
      visitDuration: 30,
      date: '2025-10-27',
      time: '9:00 AM',
      firstName: 'Adebayo',
      lastName: 'Ojo',
      email: 'adebayo.ojo@example.com',
      phone: '+234 801 234 5678',
      reasonForVisit: 'Knee pain after running',
      injuryDate: '2025-10-20',
      painScale: 6,
      status: 'Scheduled',
    },
    {
      visitType: 'Video',
      visitDuration: 20,
      date: '2025-10-28',
      time: '2:00 PM',
      firstName: 'Fatima',
      lastName: 'Bello',
      email: 'fatima.bello@example.com',
      phone: '+234 802 345 6789',
      reasonForVisit: 'Follow-up on shoulder injury',
      injuryDate: '2025-09-15',
      painScale: 4,
      status: 'Scheduled',
    },
    {
      visitType: 'InPerson',
      visitDuration: 30,
      date: '2025-10-29',
      time: '10:30 AM',
      firstName: 'Chioma',
      lastName: 'Okoro',
      email: 'chioma.okoro@example.com',
      phone: '+234 803 456 7890',
      reasonForVisit: 'Ankle sprain during sports',
      injuryDate: '2025-10-22',
      painScale: 7,
      status: 'Scheduled',
    },
  ];

  for (const appointment of sampleAppointments) {
    await prisma.appointment.create({
      data: appointment,
    });
  }

  console.log('Created sample appointments');
  console.log('Seeding completed!');
}

seed()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
