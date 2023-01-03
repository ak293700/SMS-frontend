import {IdNameDto} from "../Dtos/IdNameDto";

export enum Role
{
  Admin = 1,
  Pricing = 2,
  Sales = 4,
  Stock = 8
}

export namespace Role
{
  export function getValues(): IdNameDto[]
  {
    return [
      {id: 1, name: 'Admin'},
      {id: 2, name: 'Pricing'},
      {id: 4, name: 'Sales'},
      {id: 8, name: 'Stock'},
    ];
  }

  export function fromString(role: string): Role
  {
    return getValues().find((value: IdNameDto) => value.name === role)?.id as Role;
  }

  export function toString(role: Role): string
  {
    return getValues().find((value: IdNameDto) => value.id === role)?.name as string;
  }
}
