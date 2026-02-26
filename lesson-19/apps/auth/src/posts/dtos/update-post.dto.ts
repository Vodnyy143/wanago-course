import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const UpdatePostSchema = z.object({
  name: z.string().optional(),
  content: z.string().optional(),
  previewUrl: z.string().optional(),
});

export class UpdatePostDto extends createZodDto(UpdatePostSchema) {}
