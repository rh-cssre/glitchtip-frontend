export interface IEvent {
  id: number;
  event: {
    event_id: string;
    exception: {
      values: [
        {
          type: string; // "Error"
          value: string;
          stacktrace: {
            frames: {
              colno: number;
              filename: string;
              function: string;
              in_app: boolean;
              lineno: number;
            }[];
          };
          mechanism: {
            handled: boolean;
            type: string; // "generic"
          };
        }
      ];
    };
  };
}
