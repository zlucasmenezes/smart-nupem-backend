export class PasswordUtils {

  public static generate(): string {
    return Math.random().toString(36).slice(2);
  }

}
