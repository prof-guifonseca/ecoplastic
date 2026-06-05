import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const eslintConfig = [
  ...nextVitals,
  ...nextTypescript,
  {
    ignores: ['out/**', '.next/**', 'node_modules/**', 'prototipo/**', 'ecotech.html']
  }
];

export default eslintConfig;
