import { Logger } from '@nestjs/common';

export const logError = (bubble = true) => {
  return (
    target: unknown,
    propertyKey: string,
    propertyDescriptor: PropertyDescriptor
  ) => {
    const logger = new Logger(
      `${target.constructor.name}@${propertyKey}`
    );

    //get original method
    const originalMethod = propertyDescriptor.value;

    //redefine descriptor value within own function block
    propertyDescriptor.value = async function (...args: unknown[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        logger.error(error.message, error.stack);
        // rethrow error, so it can bubble up
        if (bubble) {
          throw error;
        }
      }
    };
  };
}
