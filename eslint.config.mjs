import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const eslintConfig = [
  ...nextVitals,
  ...nextTypescript,
  {
    ignores: ['out/**', '.next/**', 'node_modules/**', 'public/prototipo-3d/**']
  }
];

export default eslintConfig;
