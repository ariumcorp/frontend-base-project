export interface ResponseApi<T> {
  success: boolean;
  errors: { code: string; index: 0 }[];
  resource: T;
}

export const initialStateAuth1: ResponseApi<null> = {
  success: false,
  errors: [],
  resource: null,
};
