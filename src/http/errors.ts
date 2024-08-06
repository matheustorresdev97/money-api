import { FastifyInstance } from "fastify";

import { env } from "@/env";

type FastifyErrorHandler = FastifyInstance["errorHandler"];

export const errorHandler: FastifyErrorHandler = function (
  error,
  _request,
  reply
) {
  const { validation, validationContext } = error;

  if (validation) {
    return reply.status(error.statusCode ?? 400).send({
      message: `Error validating request ${validationContext}.`,
      errors: validation,
    });
  }

  console.error(error);

  if (env.NODE_ENV === "production") {
    // Maybe send to observability platform?
  }

  return reply.status(500).send({ message: "Internal server error." });
};
