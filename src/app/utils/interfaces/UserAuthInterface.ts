export default interface UserAuthInterface {
    "$id": string,
    "$createdAt": string,
    "$updatedAt": string,
    "name": string,
    "registration": string,
    "status": boolean,
    "labels": string[],
    "passwordUpdate": string,
    "email": string,
    "phone": string,
    "emailVerification": boolean,
    "phoneVerification": boolean,
    "mfa": boolean,
    "prefs": Record<string, unknown>,
    "targets": any[],
    "accessedAt": string
    "avatar": string
}
