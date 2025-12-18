import { FastifyInstance } from 'fastify';
import { authorize } from '../middlewares/authorize';
import { formSchema } from '../schemas/form.schema';

const DOMAIN = process.env.APP_DOMAIN || 'http://localhost:3000';

export async function formRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/api/create-form',
    { preHandler: [authorize], schema: formSchema },
    async (req, reply) => {
      try {
        const { name, description, fields } = req.body as { name: string; description: string, fields: any };

        reply.send({
          status: true,
          name,
          url: `${DOMAIN}/form/${name}`,
        });
      } catch (err) {
        console.error('Create form API Error:', err);
        reply.status(500).send({ status: false, error: 'Internal server error' });
      }
    });

}
