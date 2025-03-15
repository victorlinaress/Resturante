import { PrismaClient } from "@prisma/client";
import UserInput from "../interfaces/Input/UserInput";
import UserOutput from "../interfaces/Outputs/UserOutput";
import NotFoundError from "../errors/NotFoundError";
import User from "../models/User";

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

  return users.map((user: User) => ({
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

async function getByUid(uid: string): Promise<UserOutput> {
  const user: User = await prisma.users.findUnique({
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

async function update(id: number, userInput: UserInput): Promise<UserOutput> {
  const user: User = await prisma.users.update({
    where: { id: id, status: true },
    data: userInput,
  });

  return {
    id: user.id,
    nome: user.nome,
    uidFirebase: user.uidFirebase,
  };
}

async function remove(id: number): Promise<void> {
  await prisma.users.update({
    where: { id: id, status: true },
    data: { status: false },
  });
}

export default {
  create,
  getAll,
  getById,
  getByUid,
  update,
  remove,
};
