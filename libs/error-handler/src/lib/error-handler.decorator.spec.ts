import { logError } from "./error-handler.decorator";
import { Logger } from '@nestjs/common';
import { mock } from "jest-mock-extended";

const logger = mock<Logger>();

export class ErrorHandlerMockClass {

  @logError(logger)
  public async testAsyncMethod() {
    throw new Error('test async error');
  }

  @logError(logger)
  public testSyncMethod() {
    throw new Error('test sync error');
  }
}

describe('ErrorHandlerDecorator', () => {
  let errorHandlerMockClass: ErrorHandlerMockClass;

  beforeAll(() => {
    errorHandlerMockClass = new ErrorHandlerMockClass();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(logError).toBeDefined();
  });

  it('should log the async error', () => {
    expect(errorHandlerMockClass.testAsyncMethod()).rejects.toThrow('test async error');
    logger.error.calledWith('test async error');
  });

  it('should log the sync error', () => {
    expect(() => errorHandlerMockClass.testSyncMethod()).toThrow('test sync error');
    logger.error.calledWith('test sync error');
  });
});
