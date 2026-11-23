import { AllAuthError } from "./allauth.interfaces";

interface ErrorParams {
  [key: string]: string;
}

interface ErrorCodes {
  [key: string]: ErrorParams;
}

const messageMap: ErrorCodes = {
  email_password_mismatch: {
    password: $localize`Unable to log in with provided credentials.`,
  },
  enter_current_password: {
    current_password: $localize`Your current password is incorrect.`,
  },
};

/** Look up translated message if it exists, fallback to server message */
export function messageLookup(error: AllAuthError): string {
  const { code, param, message } = error;
  const errorParams = messageMap[code];
  return (param && errorParams?.[param]) || message;
}

export function messagesLookup(errors: AllAuthError[]): string[] {
  return errors.map((error) => messageLookup(error));
}

export function reduceParamErrors(errors: AllAuthError[]): {
  [key: string]: string[];
} {
  return errors.reduce(
    (acc, error) => {
      const { param } = error;
      const message = messageLookup(error);

      if (param) {
        if (!acc[param]) {
          acc[param] = [];
        }
        acc[param].push(message);
      }

      return acc;
    },
    {} as { [key: string]: string[] },
  );
}
