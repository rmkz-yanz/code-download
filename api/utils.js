import fs from 'fs';
import path from 'path';

const codesFilePath = path.join(process.cwd(), 'codes.json');

export const readCodes = () => {
  try {
    const data = fs.readFileSync(codesFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      fs.writeFileSync(codesFilePath, '{}');
      return {};
    }
    throw err;
  }
};

export const writeCodes = (codes) => {
  fs.writeFileSync(codesFilePath, JSON.stringify(codes, null, 2));
};
