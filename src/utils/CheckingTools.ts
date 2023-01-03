export class CheckingTools
{
  private static readonly SpecialCharacters =
    ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '=', '+', '[', ']',
      '{', '}', '|', '\\', ':', ';', '"', '\'', '<', '>', ',', '.', '?', '/'];

  static IsPasswordValid(password: string): boolean
  {
    if (password.length < 8)
      return false;

    if (password.match(/\s/))
      return false;

    if (!password.split('').some(char => char === char.toUpperCase()))
      return false;

    if (!password.split('').some(char => char === char.toLowerCase()))
      return false;

    if (!password.split('').some(char => !isNaN(Number(char))))
      return false;

    if (!password.split('').some(char => CheckingTools.SpecialCharacters.includes(char)))
      return false;

    return true;
  }

  static f()
  {
    console.log(this.SpecialCharacters.join(''));
  }
}
