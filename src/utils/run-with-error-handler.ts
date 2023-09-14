
/**
 * Starts execution of the function and passes
 * control to the handler if an error occurs
 * @param fn Function.
 * @param onError Error handler.
 */
export function runWithErrorHandler(
  fn: () => void,
  onError: (reason?: any) => void,
): void {
  try {
    fn();
  } catch(error) {
    onError(error);
  }
}
