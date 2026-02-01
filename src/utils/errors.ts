export class FetchError extends Error {
  message = "Something went wrong while fetching data, please try again later."
}

export class NotFoundError extends Error {
  message = "Not Found"
}
