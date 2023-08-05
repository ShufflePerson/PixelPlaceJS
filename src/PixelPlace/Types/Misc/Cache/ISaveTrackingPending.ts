type ISaveTrackingPending =
  | "error"
  | {
      pixels: number[];
      names: string[];
    };
