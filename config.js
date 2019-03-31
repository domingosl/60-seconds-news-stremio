module.exports = {
    id: 'org.dom.60secondsnews',
    version: '0.0.1',
    name: '60 seconds news',
    description: 'The world headlines for you in 60 seconds',
    icon: 'https://i.imgur.com/xT8PENN.png',
    catalogs: [
        {
            type: 'tv',
            id: 'worldnews',
        }
    ],
    resources: ['catalog', 'stream', 'meta'],
    types: ['tv']
};