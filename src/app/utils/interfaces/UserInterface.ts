interface User {
    name: string;
    avatar: string;
    token: string | null;
    $id: string;
    $createdAt: string;
    $updatedAt: string;
    $permissions: any[];
    $databaseId: string;
    $collectionId: string;
}
