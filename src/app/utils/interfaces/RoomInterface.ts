interface Room {
    name: string;
    closed: boolean;
    description: string;
    code: string;
    $id: string;
    $createdAt: string;
    $updatedAt: string;
    $permissions: any[];
    users: User[];
    $databaseId: string;
    $collectionId: string;
}
