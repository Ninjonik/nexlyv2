export const onDisconnectedFn = async (roomId: string) => {

    try {

        const response = await fetch(`/api/checkCallStatus?room=${roomId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to call');
        }

    } catch (err: any) {
        console.error(err);
    }
}