// Taken from: https://github.com/facebook/jest/issues/8987#issuecomment-584898030
const RESET_MODULE_EXCEPTIONS = ["react"];
const mockActualRegistry: Record<string, any> = {};

RESET_MODULE_EXCEPTIONS.forEach((moduleName) => {
  jest.doMock(moduleName, () => {
    if (!mockActualRegistry[moduleName]) {
      mockActualRegistry[moduleName] = jest.requireActual(moduleName);
    }
    return mockActualRegistry[moduleName];
  });
});
