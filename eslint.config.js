import react from '@woohm402/eslint-config-react';

export default [
  {
    ignores: ['.yarn', '*.js'],
  },
  ...react({
    tsconfigRootDir: import.meta.dirname,
  }),
];
