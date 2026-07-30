export interface FieldError {
  path: Array<string | number>;
  field: string;
  message: string;
  code: string;
}

export interface ValidationErrorResponse {
  key: string;
  message: string;
  errors: FieldError[];
}
