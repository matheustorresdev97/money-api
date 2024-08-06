import z from "zod";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "@/lib/prisma";

export const getAllCategories = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/categories",
    {
      schema: {
        tags: ["category"],
        summary: "Get all categories",
        response: {
          200: z.array(z.object({
            categoria: z.string(), 
            icon: z.string(), 
          })),
          500: z.object({ message: z.string() }).describe("Internal server error"),
        },
      },
    },
    async (request, reply) => {
      try {
        const categories = await prisma.categoria.findMany();

        reply.status(200).send(categories.map(category => ({
          categoria: category.categoria,
          icon: category.icon,
        })));
      } catch (error) {
        reply.status(500).send({ message: "Não foi possível buscar as categorias" });
      }
    }
  );
};
