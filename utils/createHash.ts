import crypto from "crypto"


/**
 * Creates a hash using the MD5 algorithm.
 *
 * @param {string} string - The input string to be hashed.
 * @returns {string} - The hexadecimal representation of the MD5 hash.
 */
const createHash = (string: string): string => {
  const hash = crypto.createHash("md5");
  hash.update(string);
  return hash.digest("hex");
};

/**
 * Exports the createHash function.
 */
export default createHash;