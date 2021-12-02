import { Logger } from '@nestjs/common';

export const logError = (defaultLogger?: Logger) => {
  return (
    target: unknown,
    propertyKey: string,
    propertyDescriptor: PropertyDescriptor
  ) => {
    const logger = defaultLogger || new Logger(
      `${target.constructor.name}@${propertyKey}`
    );

    //get original method
    const originalMethod = propertyDescriptor.value;
    //redefine descriptor value within own function block
    propertyDescriptor.value = function (...args: unknown[]) {
      try {
        const result = originalMethod.apply(this, args);

        if(result && result instanceof Promise) {
          return result.catch(err => {
            logger.error(err);
            throw err;
          });
        }

        return result;
      } catch (error) {
        logger.error(error.message, error.stack);
        throw error;
      }
    };
  };
}

