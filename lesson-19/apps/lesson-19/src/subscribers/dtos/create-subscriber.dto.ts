import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const CreateSubscriberSchema = z.object({
  email: z.string(),
  name: z.string(),
});

export class CreateSubscriberDto extends createZodDto(CreateSubscriberSchema) {}
