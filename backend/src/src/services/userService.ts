import { PrismaClient } from "@prisma/client";
import UserInput from "../interfaces/Input/UserInput";
import UserOutput from "../interfaces/Outputs/UserOutput";

const prisma = new PrismaClient();

export async function create(userInput: UserInput): Promise<UserOutput> {
  const user = await prisma.user.create({
    data: userInput,
  });

  const userOutput: UserOutput = {
    id: user.id,
    nome: user.nome,
    uidFirebase: user.uidFirebase,
  };

  return userOutput;
}
