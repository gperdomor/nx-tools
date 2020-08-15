import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const bootstrap = async () => {
  const user = await prisma.user.upsert({
    create: { email: 'Example', name: 'User' },
    update: {},
    where: { email: 'Example' },
  });
  console.log(user);
};

bootstrap();
