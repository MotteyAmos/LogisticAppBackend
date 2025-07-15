import { GraphQLError } from 'graphql';
import { ApolloServerErrorCode } from '@apollo/server/errors';

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