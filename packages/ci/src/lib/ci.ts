import { RunnerProvider } from './runner-provider.enum';
import * as vendors from './vendors.json';

interface Vendor {
  name: string;
  constant: string;
  env: string | string[] | Record<string, string>;
}

const checkEnv = (obj: string | Record<string, unknown>, env) => {
  if (typeof obj === 'string') return !!env[obj];
  return Object.keys(obj).every(function (k) {
    return env[k] === obj[k];
  });
};

export const getVendor = () => {
  return vendors.find((vendor: Vendor) => {
    const envs = Array.isArray(vendor.env) ? vendor.env : [vendor.env];
    return envs.every((arr) => checkEnv(arr, process.env));
  });
};

export const getRunnerProvider = () => {
  const vendor = getVendor();
  return RunnerProvider[vendor?.constant];
};
