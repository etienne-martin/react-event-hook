export const serializeEvent = (event: any) => {
  return JSON.stringify({
    timestamp: Date.now(),
    event,
  });
};

export const deserializeEvent = (event: string) => {
  return JSON.parse(event).event;
};
