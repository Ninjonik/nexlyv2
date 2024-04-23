import Room from "@/app/utils/interfaces/RoomInterface";

export default interface User {
    name: string;
    avatar: string;
    room: Room;
    $id: string;
    $createdAt: string;
    $updatedAt: string;
    $permissions: any[];
    $databaseId: string;
    $collectionId: string;
}
