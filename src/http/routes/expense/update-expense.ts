import z from "zod";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { Decimal } from "@prisma/client/runtime/library";
import { prisma } from "@/lib/prisma";


export const updateExpense = async (app: FastifyInstance) => {
    app.withTypeProvider<ZodTypeProvider>().put(
        "/expense/:id",
        {
            schema: {
                tags: ["expense"],
                summary: "Update an expense",
                params: z.object({
                    id: z.string().uuid(), 
                }),
                body: z.object({
                    descricao: z.string().min(4).optional(),
                    categoria: z.string().min(4).optional(),
                    valor: z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
                }),
                response: {
                    200: z.object({
                        id: z.string(),
                        descricao: z.string(),
                        categoria: z.string(),
                        valor: z.number(),
                    }),
                    404: z.object({ message: z.string() }).describe("Expense not found"),
                    400: z.object({ message: z.string() }).describe("Bad request"),
                    500: z.object({ message: z.string() }).describe("Internal server error"),
                },
            },
        },
        async (request, reply) => {
            const { id } = request.params;
            const { descricao, categoria, valor } = request.body;

            try {
                const updateData: any = {};
                if (descricao) updateData.descricao = descricao;
                if (categoria) updateData.categoria = categoria;
                if (valor) updateData.valor = new Decimal(valor);

                const updatedExpense = await prisma.despesa.update({
                    where: { id },
                    data: updateData,
                });

                reply.status(200).send({
                    id: updatedExpense.id,
                    descricao: updatedExpense.descricao,
                    categoria: updatedExpense.categoria,
                    valor: updatedExpense.valor.toNumber()
                });
            } catch (error) {
                reply.status(500).send({ message: "Não foi possível atualizar a despesa" });
            }
        }
    );
};
