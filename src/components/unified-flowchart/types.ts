
export interface NodeData extends Record<string, unknown> {
  label: string;
  subsystem: string;
  details: string;
}

export interface DrillDownState {
  activeSubsystem: string | null;
  showDetails: boolean;
}
