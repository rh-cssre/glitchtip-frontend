import { uniqueId } from "../e2e/utils.cy";

export const generateTransactions = (url: string, count: number) => {
  for (let i = 0; i < count; i++) {
    cy.request({
      method: "POST",
      url,
      headers: { "Content-Type": "application/x-sentry-envelope" },
      body: uniqueTransaction(),
    });
  }
};

export const uniqueTransaction = () => {
  const bodyJson = [
    { event_id: uniqueId() },
    { type: "transaction" },
    {
      type: "transaction",
      transaction: `something/somewhere/${uniqueId(8)}`,
      contexts: {
        trace: {
          trace_id: uniqueId(),
          span_id: uniqueId(8),
          op: "http.server",
        },
      },
      start_timestamp: Date.now() / 1000,
      timestamp: (Date.now() + 1) / 1000,
    },
  ];
  let body = "";
  bodyJson.forEach((entry) => {
    body = body + JSON.stringify(entry) + "\n";
  });
  return body;
};
