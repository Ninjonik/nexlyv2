import { Client, Databases, Users, Query } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
  const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT)
      .setKey(process.env.APPWRITE_KEY);

  const database = new Databases(client);
  const users = new Users(client);

  if (req.method === 'POST') {
    try {
        const removedUserId = req.body.$id;
        console.log(req.body);
        console.log(req.body.$id);
        await database.deleteDocument('nexly', 'users', removedUserId);

        return res.json({
          success: true,
          message: 'User record deleted successfully',
        });
    } catch (err) {
      error('Error deleting user record:', err);
      error(err.message);

      return res.json({
        success: false,
        message: 'Error deleting user record',
        error: err.message || 'Unknown error',
      });
    }
  }

  return res.json({
    success: false,
    message: 'Invalid Method',
  });
};
