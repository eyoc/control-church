import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';

/**
 * Extrae el iglesiaId del contexto de la request.
 * Busca en orden: query param → body → header x-iglesia-id.
 * Lanza BadRequestException si no se encuentra.
 *
 * Uso: @IglesiaActual() iglesiaId: number
 */
export const IglesiaActual = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): number => {
    const request = ctx.switchToHttp().getRequest();

    const iglesiaId =
      request.query?.iglesiaId ??
      request.body?.iglesiaId ??
      request.headers?.['x-iglesia-id'];

    if (!iglesiaId) {
      throw new BadRequestException('iglesiaId es requerido');
    }

    const parsed = parseInt(iglesiaId, 10);
    if (isNaN(parsed)) {
      throw new BadRequestException('iglesiaId debe ser un número entero');
    }

    return parsed;
  },
);
