export interface ProductChangesResponseDto
{
  directChangesCount: number;
  indirectChangesCount?: number;
  shopSpecificChangesCount?: number;
}

/*
{
  manufacturer: {value: undefined, active: false},
  popularity: {value: undefined, active: false},
  availability: {value: undefined, active: false},
  km: {
    value: undefined, active: false,
    other: {
      state: OperationEnum.Multiply,
      states: [OperationEnum.Multiply, OperationEnum.Equal]
    }
  },
  discount: {value: undefined, active: false},
  availableDiscounts: {
    value: [], active: false, other: {
      state: OperationEnum.Add,
      states: [OperationEnum.Add, OperationEnum.Equal, OperationEnum.Subtract]
    }
  },
}
*/
