export enum Shop
{
  Eps = 0,
  Es
}

export namespace Shop
{
    export function toString(shop: Shop): string
    {
        switch (shop)
        {
            case Shop.Eps:
                return "ElecProShop";
            case Shop.Es:
                return "ElecPlusSimple";
        }
    }

    export function All(): Shop[]
    {
        return [Shop.Eps, Shop.Es];
    }
}
