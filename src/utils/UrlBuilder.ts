export class UrlBuilder
{
  private url: string;
  private boolFirstParam: boolean = true;

  private constructor(url: string)
  {
    this.url = url;
  }

  static create(url: string): UrlBuilder
  {
    return new UrlBuilder(url);
  }

  build(): string
  {
    return this.url;
  }

  addParam(key: string, value: any): UrlBuilder
  {
    if (this.boolFirstParam)
      this.url += '?';
    else
      this.url += '&';

    if (Array.isArray(value))
      this.url += `${key}=${value.join(`&${key}=`)}`;
    else
      this.url += `${key}=${value.toString()}`;

    return this;
  }
}
