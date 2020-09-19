export interface NewProjectAlert {
  timespan_minutes: number;
  quantity: number;
}

export interface ProjectAlert extends NewProjectAlert {
  pk: number;
}
