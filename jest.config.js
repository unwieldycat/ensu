module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  extensionsToTreatAsEsm: ['.ts'],
  testMatch: [
    '**/tests/*.test.ts'
  ]
};