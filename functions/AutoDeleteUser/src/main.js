import {
    Client,
    Databases,
    Users,
    Query
} from 'node-appwrite';

export default async ({
                          req,
                          res,
                          log,
                          error
                      }) => {
    const client = new Client()
        .setEndpoint(process.env.APPWRITE_ENDPOINT)
        .setProject(process.env.APPWRITE_PROJECT)
        .setKey(process.env.APPWRITE_KEY);

    const database = new Databases(client);
    const users = new Users(client);


    if (req.method === 'POST') {
        const removedUserId = req.body.userId;

        try {
            console.log(req.body);
            console.log(req.body.userId);
            await database.deleteDocument('nexly', 'users', removedUserId);
        } catch (err) {
            error('Error deleting user record:', err);
            error(err.message);
        }

        try {
            await users.delete(removedUserId);
        } catch (e) {
            error('Error deleting user account:', err);
            error(err.message);
        }

        return res.json({
            success: true,
            message: 'User record deleted successfully',
        });
    }

    return res.json({
        success: false,
        message: 'Invalid Method',
    });
};