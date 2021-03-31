import { Vendor, vendors } from './vendors';

const checkEnv = (obj: string | Record<string, unknown>, env) => {
  if (typeof obj === 'string') return !!env[obj];
  return Object.keys(obj).every(function (k) {
    return env[k] === obj[k];
  });
};

export const getVendorConf = () => {
  return vendors.find((vendor) => {
    const envs = Array.isArray(vendor.env) ? vendor.env : [vendor.env];
    return envs.every((arr) => checkEnv(arr, process.env));
  });
};

export const getVendor = () => {
  const vendor = getVendorConf();
  return Vendor[vendor?.constant];
};
