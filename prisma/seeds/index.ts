import { PrismaClient } from '@prisma/client';
import { usersArray } from './data/user.data';

const prisma = new PrismaClient();

async function main() {

    await prisma.user.createMany({
      data: usersArray
    })
  
}


main()
  .catch((e) => {
    console.error(`There was an error while seeding: ${e}`);
    process.exit(1);
  })
  .finally(async () => {
    console.log('Successfully seeded database. Closing connection.');
    await prisma.$disconnect();
  });


  // npx prisma db seed