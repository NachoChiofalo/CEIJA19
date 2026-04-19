import serverEntry from "../../dist/server/index.js";

function getServer() {
  if (!serverEntry || typeof serverEntry.fetch !== "function") {
    throw new Error("Invalid SSR entry. Expected default export with fetch(request).");
  }

  return serverEntry;
}

function shouldEncodeAsBase64(contentType) {
  if (!contentType) return true;

  const lower = contentType.toLowerCase();

  return !(
    lower.startsWith("text/") ||
    lower.includes("application/json") ||
    lower.includes("application/javascript") ||
    lower.includes("application/xml") ||
    lower.includes("application/xhtml+xml") ||
    lower.includes("image/svg+xml")
  );
}

export const handler = async (event) => {
  try {
    const headers = new Headers();

    for (const [key, value] of Object.entries(event.headers ?? {})) {
      if (value != null) {
        headers.set(key, String(value));
      }
    }

    const method = event.httpMethod ?? "GET";
    const host = headers.get("host") ?? "localhost";
    const fallbackUrl = `https://${host}${event.path ?? "/"}`;
    const url = event.rawUrl ?? fallbackUrl;

    const hasBody =
      event.body != null &&
      method !== "GET" &&
      method !== "HEAD";

    const body = hasBody
      ? event.isBase64Encoded
        ? Buffer.from(event.body, "base64")
        : event.body
      : undefined;

    const request = new Request(url, {
      method,
      headers,
      body,
      redirect: "manual",
    });

    const response = await getServer().fetch(request);
    const responseBuffer = Buffer.from(await response.arrayBuffer());
    const contentType = response.headers.get("content-type");
    const isBase64Encoded = shouldEncodeAsBase64(contentType);

    const responseHeaders = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    return {
      statusCode: response.status,
      headers: responseHeaders,
      body: isBase64Encoded
        ? responseBuffer.toString("base64")
        : responseBuffer.toString("utf8"),
      isBase64Encoded,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : String(error);

    return {
      statusCode: 500,
      headers: {
        "content-type": "text/plain; charset=utf-8",
      },
      body: `Netlify SSR handler error: ${message}`,
    };
  }
};
