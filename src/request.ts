import { IRequestOptions } from "./interfaces"
const requestFactory = ({
  accessToken,
  makeRequest,
  logger
}: {
  accessToken: string
  makeRequest: typeof fetch
  logger: {
    log: (...args: any[]) => any
    warn: (...args: any[]) => any
    error: (...args: any[]) => any
  }
}) => async ({
  baseUrl = "https://sheets.googleapis.com/v4/spreadsheets",
  url = "",
  method = "GET",
  body
}: IRequestOptions = {}) => {
  const config = {
    body: body ? JSON.stringify(body) : undefined,
    headers: new Headers({
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json"
    }),
    method
  }
  const fullUrl = [baseUrl, url.replace(/^\//, "")].filter(i => i).join("/")
  const result = await makeRequest(fullUrl, config)
  const parsed = await result.json()
  if (parsed.error) {
    logger.warn(
      "request failed: ",
      fullUrl,
      "config:",
      JSON.stringify(config, null, 2),
      "result:",
      JSON.stringify(parsed, null, 2)
    )
    const error: Error & { code?: number; status?: string } = new Error(
      parsed.error.message
    )
    error.code = parsed.error.code
    error.status = parsed.error.status
    throw error
  }
  return parsed
}
export default requestFactory
