export default class Path {
  public static join(...paths: string[]): string {
    const separator = "/"
    const normalizedPaths = paths.map(path =>
      path.replace(/\\/g, separator).replace(/\/{2,}/g, separator)
    )
    const joinedPath = normalizedPaths.join(separator)
    return joinedPath.replace(/\/{2,}/g, separator)
  }
}
