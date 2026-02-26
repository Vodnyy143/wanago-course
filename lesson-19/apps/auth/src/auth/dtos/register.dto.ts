import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const RegisterSchema = z.object({
  email: z.string(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string(),
});

export class RegisterDto extends createZodDto(RegisterSchema) {}
