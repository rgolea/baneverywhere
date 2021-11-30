import { logError } from "./error-handler.decorator";
import { Logger } from '@nestjs/common';
import { mock } from "jest-mock-extended";

const logger = mock<Logger>();

export class ErrorHandlerMockClass {

  @logError(true, logger)
  public async testMethod() {
    throw new Error('test error');
  }
}

describe('ErrorHandlerDecorator', () => {
  let errorHandlerMockClass: ErrorHandlerMockClass;

  beforeAll(() => {
    errorHandlerMockClass = new ErrorHandlerMockClass();
  });

  it('should be defined', () => {
    expect(logError).toBeDefined();
  });

  it('should log the error', () => {
    expect(errorHandlerMockClass.testMethod()).rejects.toThrow('test error');
    logger.error.calledWith('test error');
  });
});
