import { PrismaClient } from "@prisma/client";
import UserInput from "../interfaces/Input/UserInput";
import UserOutput from "../interfaces/Outputs/UserOutput";
import NotFoundError from "../errors/NotFoundError";

const prisma = new PrismaClient();

async function create(userInput: UserInput): Promise<UserOutput> {
  const user = await prisma.user.create({
    data: userInput,
  });

  return {
    id: user.id,
    nome: user.nome,
    uidFirebase: user.uidFirebase,
  };
}

async function getAll(): Promise<UserOutput[]> {
  const users = await prisma.users.findMany({
    where: { status: true },
  });

  if (users.length === 0) {
    throw new NotFoundError();
  }

  return users.map((user) => ({
    id: user.id,
    nome: user.nome,
    uidFirebase: user.uidFirebase,
  }));
}

async function getById(uid: string): Promise<UserOutput> {
  const user = await prisma.users.findUnique({
    where: { uidFirebase: uid, status: true },
  });

  if (!user) {
    throw new NotFoundError();
  }

  return {
    id: user.id,
    nome: user.nome,
    uidFirebase: user.uidFirebase,
  };
}

export default {
  create,
  getAll,
  getById,
};
