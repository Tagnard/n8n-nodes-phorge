import { config } from '@n8n/node-cli/eslint';

config.rules = {
  ...config.rules,
  '@n8n/community-nodes/no-restricted-imports': 'off',
};

export default config;
