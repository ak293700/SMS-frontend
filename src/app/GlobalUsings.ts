export const domain = "localhost:7093";
export const api = `https://${domain}/api`;

export function join(path: string)
{
  return `${api}/${path}`;
}

