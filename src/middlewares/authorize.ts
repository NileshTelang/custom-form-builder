import { FastifyRequest, FastifyReply } from 'fastify'
import { isValidEmail } from '../utils/validator'

export async function authorize(request: FastifyRequest, reply: FastifyReply) {
  const apiKey = request.headers['x-api-key']

  if (!apiKey || apiKey !== process.env.API_KEY) {
    return reply.status(401).send({ status: false, error: 'Unauthorized' })
  }

  if (request.url.startsWith('/api/v1/forms')) {
    const userEmail = request.headers['x-user-email']
    if (!userEmail || !isValidEmail(userEmail)) {
      return reply.status(401).send({ status: false, error: 'Unauthorized' })
    }
  }
}
