export function isSuccess(status: number) {
    return status >= 200 && status <= 204;
  }
  
export function isError(status: number) {
    return status >= 400 && status <= 404;
  }
  