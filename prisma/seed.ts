import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("No seed data required.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
