import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const CreatePostSchema = z.object({
  name: z.string(),
  content: z.string(),
});

export class CreatePostDto extends createZodDto(CreatePostSchema) {}
