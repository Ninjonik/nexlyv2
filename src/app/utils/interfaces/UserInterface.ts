export default interface User {
    name: string;
    avatar: string;
    $id: string;
    $createdAt: string;
    $updatedAt: string;
    $permissions: any[];
    $databaseId: string;
    $collectionId: string;
}
