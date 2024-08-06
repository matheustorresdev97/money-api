import z from "zod";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "@/lib/prisma";


export const deleteExpense = async (app: FastifyInstance) => {
    app.withTypeProvider<ZodTypeProvider>().delete(
        "/expense/:id",
        {
            schema: {
                tags: ["expense"],
                summary: "Delete an expense by ID",
                params: z.object({
                    id: z.string().uuid(),
                }),
                response: {
                    204: z.object({}).describe("No content"),
                    404: z.object({ message: z.string() }).describe("Expense not found"),
                    500: z.object({ message: z.string() }).describe("Internal server error"),
                },
            },
        },
        async (request, reply) => {
            const { id } = request.params;

            try {
                await prisma.despesa.delete({
                    where: { id },
                });

                reply.status(204).send();
            } catch (error) {
                reply.status(500).send({ message: "Não foi possível excluir a despesa" });
            }
        }
    );
};
