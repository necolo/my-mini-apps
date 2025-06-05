const getEnv = (key: string): string => {
  const value = process.env[key];
  if (value === undefined) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
};

const getBrowserEnv = (key: string): string => getEnv(`NEXT_PUBLIC_${key}`);

export const env = {
  bangumiToken: getEnv('BANGUMI_TOKEN'),
} as const;

// Type for environment variables
export type Env = typeof env; 