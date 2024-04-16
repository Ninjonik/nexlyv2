export default function generateRandomString(length = 36) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    let result = '';
    result += Date.now().toString(36);
    result += Math.random().toString(36).substr(2);
    while (result.length < length) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result.substr(0, length);
}