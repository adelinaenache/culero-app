import { User, UserWithToken } from "../types";
import storage from "./storage";

const baseUrl = "http://localhost:4200/api";
const signInUrl = `${baseUrl}/auth/sign-in`;
const signUpUrl = `${baseUrl}/auth/sign-up`;
const verifyEmailUrl = `${baseUrl}/auth/verify-email`;

type FetchInput = string | URL | Request;
type FetchInit = RequestInit;

const enhancedFetch = async (
  initialInput: FetchInput,
  initialInit: FetchInit,
  preRequestMiddlewares?: Array<
    (
      input: FetchInput,
      init: FetchInit
    ) => { input: FetchInput; init: FetchInit }
  >,
  afterRequestMiddlewares?: Array<(before: any) => any>
) => {
  const inputWithMiddlewares = (preRequestMiddlewares || []).reduce<{
    input: FetchInput;
    init: FetchInit;
  }>(({ input, init }, middleware) => middleware(input, init), {
    input: initialInput,
    init: initialInit,
  });
  const result = fetch(inputWithMiddlewares.input, inputWithMiddlewares.init);

  const processedResult = await (afterRequestMiddlewares || []).reduce(
    async (previosPromise, nextFn) => {
      const prevResult = await previosPromise;
      return nextFn(prevResult);
    },
    result
  );

  return processedResult;
};

const addHeaders = (headers: HeadersInit) => {
  return (input: FetchInput, init: FetchInit) => ({
    input,
    init: { ...init, headers: { ...headers, ...init.headers } },
  });
};

const stringifyBody = () => {
  return (input: FetchInput, init: FetchInit) => ({
    input,
    init: { ...init, body: JSON.stringify(init.body) },
  });
};

const normalizeResult = async (response: Response) => {
  const responseData = await response.json();
  if (responseData.message != null) {
    throw new Error(responseData.message);
  }

  return responseData;
};

const authorizedFetch = async (
  input: FetchInput,
  init: FetchInit | object
): Promise<any> => {
  const token = await storage.getItem(storage.TOKEN_KEY);

  console.log("token is ", token);
  return enhancedFetch(
    input,
    init,
    [
      addHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }),
      stringifyBody(),
    ],
    [normalizeResult]
  );
};

export type SignupInput = {
  email: string;
};

export async function signUp(
  email: SignupInput["email"]
): Promise<UserWithToken> {
  const response = await fetch(signUpUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const responseData = await response.json();

  if (response.ok) {
    return responseData;
  } else if (response.status === 409) {
    throw new Error("There is already an account with this email.");
  } else {
    throw new Error(responseData.message);
  }
}

export type VerifyEmailInput = {
  email: string;
  code: string;
};

export async function verifyEmail(
  email: VerifyEmailInput["email"],
  code: VerifyEmailInput["code"]
): Promise<UserWithToken> {
  const response = await fetch(verifyEmailUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });
  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message);
  }
  return responseData;
}

export async function signInUser(
  email: string,
  password: string
): Promise<void> {
  try {
    const response = await fetch(signInUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    console.log("got to this phase");

    // if (response.ok) {
    //   const responseData = await response.json();
    //   return responseData;
    // } else if (response.status === 409) {
    //   console.log("here, throw");
    //   throw new Error("There already is an account with this email");
    // }
  } catch (err) {
    console.log("shall throw error");
  }
}

export async function getSearchUserResult(query: string) {
  return authorizedFetch(
    `${baseUrl}/user/search?query=${encodeURIComponent(query)}`,
    {
      method: "GET",
    }
  );
}

export type SendReviewData = {
  professtionalsim: number;
  reliability: number;
  communication: number;
  comment: string;
  anonymous: boolean;
};

export async function sendFeedback(ratedUserId: string, data: SendReviewData) {
  return authorizedFetch(`${baseUrl}/user/rate/${ratedUserId}`, {
    method: "POST",
    body: data,
  });
}

export async function getMe(): Promise<User> {
  return authorizedFetch(`${baseUrl}/user/me`, { method: "GET" });
}

export type RegenerateCodeInput = {
  email: string;
};
export async function regenerateCode(data: RegenerateCodeInput) {
  return enhancedFetch(`${baseUrl}/auth/regenerate-code/${data.email}`, {
    method: "PUT",
  });
}
