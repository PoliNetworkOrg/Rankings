export default class CustomMap<K, V> extends Map<K, V> {
  public keysArr(): K[] {
    return Array.from(this.keys())
  }

  public valuesArr(): V[] {
    return Array.from(this.values())
  }

  public entriesArr(): [K, V][] {
    return Array.from(this.entries())
  }
}
