import z from "zod";
import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { Decimal } from "@prisma/client/runtime/library";

export const createExpense = async (app: FastifyInstance) => {
    app.withTypeProvider<ZodTypeProvider>().post(
        "/expense",
        {
            schema: {
                tags: ["expense"],
                summary: "Create a new expense",
                body: z.object({
                    descricao: z.string().min(4),
                    categoria: z.string().min(4),
                    valor: z.string().regex(/^\d+(\.\d{1,2})?$/),
                }),
                response: {
                    201: z.object({
                        id: z.string(),
                        descricao: z.string(),
                        categoria: z.string(),
                        valor: z.number(),
                    }),
                    400: z.object({ message: z.string() }).describe("Bad request"),
                },
            },
        },
        async (request, reply) => {
            const { descricao, categoria, valor } = request.body;

            if (!descricao || !categoria || !valor) {
                reply.status(400).send({ message: "Informe a descrição e a categoria" });
            }

            try {

                const decimalValue = new Decimal(valor);

                const newExpense = await prisma.despesa.create({
                    data: {
                        descricao,
                        categoria,
                        valor: decimalValue,
                    },
                });
                reply.status(201).send({
                    id: newExpense.id,
                    descricao: newExpense.descricao,
                    categoria: newExpense.categoria,
                    valor: newExpense.valor.toNumber()
                });
            } catch (error) {
                reply.status(400).send({ message: "Não foi possível criar a despesa" });
            }
        }
    );
};
