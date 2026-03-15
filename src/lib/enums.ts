export enum PriceTrend {
  Increased,
  Decreased,
  Same,
}

export enum Store {
  Countdown,
  Paknsave,
  Warehouse,
  NewWorld,
  CountdownPaknSave,
  CountdownWarehouse,
  PaknsaveWarehouse,
  Any,
}

export enum OrderByMode {
  Latest,
  Oldest,
  LatestPriceChange,
  OldestPriceChange,
  PriceLowest,
  PriceHighest,
  UnitPriceLowest,
  UnitPriceHighest,
  Name,
  None,
}

export enum PriceHistoryLimit {
  Any,
  TwoOrMore,
  FourOrMore,
}

export enum LastChecked {
  Within3Days,
  Within7Days,
  Within12Days,
  Within30Days,
  Any,
}
