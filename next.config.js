const withPWA = require('next-pwa')({
    dest: 'public',
    cacheOnFrontEndNav : true,
    //aggresiveFrontEndNavCaching : true,
    reloadOnOnline : true,
    //swcMinify : true,
    disable : false,
/*   
 workboxOptions: {
        disableDevLogs: true,
    }
*/
})

module.exports = withPWA({
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
            {
                protocol: 'https',
                hostname: 'appwrite.igportals.eu',
            },
        ],
        domains: ['appwrite.igportals.eu', "**"],
    }
})
