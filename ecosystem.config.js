module.exports = {
    apps: [
        {
            name: 'form-api',
            script: 'dist/server.js',
            cwd: '/var/www/form-api',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            env: {
                NODE_ENV: 'production',
                PORT: 3000
            }
        }
    ]
};