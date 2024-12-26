export type BookkeeperLandingData = {
  balanceSheetSummary: BalanceSheetSummary;
  satsFlowSummary: SatsFlowSummary;
  volumeSummary: VolumeSummary;
};

export type BalanceSheetSummary = {
  balanceInWallet: number;
  balanceInChannels: number;
  numberOfChannels: number;
};

export type SatsFlowSummary = {
  inflows: number;
  outflows: number;
};

export type VolumeSummary = {
  mostTrafficRoute: string;
  leastTrafficRoute: string;
}

