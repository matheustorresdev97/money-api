import z from "zod";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "@/lib/prisma";


export const getAllExpenses = async (app: FastifyInstance) => {
    app.withTypeProvider<ZodTypeProvider>().get(
        "/expenses",
        {
            schema: {
                tags: ["expense"],
                summary: "Get all expenses",
                response: {
                    200: z.array(z.object({
                        id: z.string(),
                        descricao: z.string(),
                        categoria: z.string(),
                        valor: z.number(),  // Retorna o valor como number
                    })),
                    500: z.object({ message: z.string() }).describe("Internal server error"),
                },
            },
        },
        async (request, reply) => {
            try {
                const expenses = await prisma.despesa.findMany();

                reply.status(200).send(expenses.map(expense => ({
                    id: expense.id,
                    descricao: expense.descricao,
                    categoria: expense.categoria,
                    valor: expense.valor.toNumber(),
                })));
            } catch (error) {
                reply.status(500).send({ message: "Não foi possível buscar as despesas" });
            }
        }
    );
};
