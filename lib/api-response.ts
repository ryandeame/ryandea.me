export async function readJsonResponse<T>(
  response: Response,
  fallbackMessage: string,
): Promise<T> {
  const rawBody = await response.text();
  let payload: unknown = null;

  if (rawBody) {
    try {
      payload = JSON.parse(rawBody);
    } catch {
      const serverMessage = rawBody.trim();
      const errorMessage =
        serverMessage === "Internal Server Error"
          ? `${fallbackMessage}. The server returned an internal error instead of JSON.`
          : serverMessage || fallbackMessage;

      throw new Error(errorMessage);
    }
  }

  if (!response.ok) {
    throw new Error(getApiError(payload) ?? `${fallbackMessage}. (${response.status})`);
  }

  return payload as T;
}

function getApiError(payload: unknown) {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "error" in payload &&
    typeof payload.error === "string"
  ) {
    return payload.error;
  }

  return null;
}
