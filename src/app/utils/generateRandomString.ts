/**
 * Generates a random string of a specified length.
 *
 * @param {number} [length=36] - The length of the random string to generate. Defaults to 36 if not provided.
 * @returns {string} The generated random string.
 *
 * @example
 * // returns a random string of length 36
 * generateRandomString();
 *
 * @example
 * // returns a random string of length 10
 * generateRandomString(10);
 */
export default function generateRandomString(length = 36) {
    // The characters to use when generating the random string.
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    let result = '';
    // Add the current timestamp in base 36 to the result.
    result += Date.now().toString(36);
    // Add a random number in base 36 to the result.
    result += Math.random().toString(36).substr(2);
    // Keep adding random characters from the characters string to the result until it reaches the specified length.
    while (result.length < length) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    // Return the result, truncated to the specified length.
    return result.substr(0, length);
}