import { logError } from "./error-handler.decorator";
import { Logger } from '@nestjs/common';
import { mock } from "jest-mock-extended";

const logger = mock<Logger>();

export class ErrorHandlerMockClass {

  @logError({ defaultLogger: logger, propagate: true })
  public async testAsyncMethod() {
    throw new Error('test async error');
  }

  @logError({ defaultLogger: logger, propagate: true })
  public testSyncMethod() {
    throw new Error('test sync error');
  }

  @logError({ defaultLogger: logger, propagate: true })
  public testReturnWithValue() {
    return 'value';
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

  it('should return value', () => {
    expect(errorHandlerMockClass.testReturnWithValue()).toBe('value');
  });
});
