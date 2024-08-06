import z from "zod";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "@/lib/prisma";

export const getExpenseById = async (app: FastifyInstance) => {
    app.withTypeProvider<ZodTypeProvider>().get(
        "/expense/:id",
        {
            schema: {
                tags: ["expense"],
                summary: "Get an expense by ID",
                params: z.object({
                    id: z.string().uuid(), // Supondo que o ID seja um UUID
                }),
                response: {
                    200: z.object({
                        id: z.string(),
                        descricao: z.string(),
                        categoria: z.string(),
                        valor: z.number()
                    }),
                    404: z.object({ message: z.string() }).describe("Expense not found"),
                    500: z.object({ message: z.string() }).describe("Internal server error"),
                },
            },
        },
        async (request, reply) => {
            const { id } = request.params;

            try {
                const expense = await prisma.despesa.findUnique({
                    where: { id },
                });

                if (!expense) {
                    return reply.status(404).send({ message: "Despesa não encontrada" });
                }

                reply.status(200).send({
                    id: expense.id,
                    descricao: expense.descricao,
                    categoria: expense.categoria,
                    valor: expense.valor.toNumber()
                });
            } catch (error) {
                reply.status(500).send({ message: "Não foi possível buscar a despesa" });
            }
        }
    );
};