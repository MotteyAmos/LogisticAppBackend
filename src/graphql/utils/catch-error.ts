import { GraphQLError } from 'graphql';
import { ApolloServerErrorCode } from '@apollo/server/errors';
import { ErrorCode } from '../../rest-api/enum/errorCode';

export class UserInputError extends GraphQLError {
  constructor(message: string, properties?: Record<string, any>) {
    super(message, {
      extensions: {
        code: 'BAD_USER_INPUT',
        ...properties
      }
    });
  }
}

export class ServerError extends GraphQLError {
  constructor() {
    super("Sorry an error occured on the server", {
      extensions: {
        code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
      
      }
    });
  }
}
export class UnauthorizedException extends GraphQLError {
  constructor(message: string, code: ErrorCode = ErrorCode.EXPIRED_ACCESS_TOKEN) {
    super(message, {
      extensions: {
        code, 
      },
    });
  }
}