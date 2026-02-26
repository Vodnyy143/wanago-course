import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const CreateUserSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  passwordHash: z.string(),
});

export class CreateUserDto extends createZodDto(CreateUserSchema) {}
