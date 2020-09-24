export class PasswordUtils {
  public static generate(length: number, mask: maskType): string {
    let characters = '';
    if (mask.indexOf('a') > -1) {
      characters += 'abcdefghijklmnopqrstuvwxyz';
    }
    if (mask.indexOf('A') > -1) {
      characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }
    if (mask.indexOf('0') > -1) {
      characters += '0123456789';
    }
    if (mask.indexOf('!') > -1) {
      characters += '!@#$%&*+-=';
    }

    let password = '';
    for (let i = length; i > 0; --i) {
      password += characters[Math.round(Math.random() * (characters.length - 1))];
    }

    return password;
  }
}

type maskType = '0' | 'aA0' | 'aA0!';
