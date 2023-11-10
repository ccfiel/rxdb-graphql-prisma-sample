import { PrismaClient, Hero } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  await prisma.hero.deleteMany({});
  const amountOfHero = 200;

  for (let i = 0; i < amountOfHero; i++) {
    const name = faker.person.fullName();
    const color = faker.color.human();
    const hero: Hero = {
      id: faker.string.uuid(),
      name,
      color,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      deleted: false,
    };
    await prisma.hero.create({ data: hero });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
