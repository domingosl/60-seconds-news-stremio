module.exports = {
    addon: {
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
    },
    streams: [
        {
            countryCode: 'de',
            name: 'Germany news',
            description: 'Live news from Germany',
            background: 'https://i.imgur.com/HVpmxSQ.png',
            poster: 'https://i.imgur.com/VXMZKyC.png',
            active: true
        },
        {
            countryCode: 'ru',
            name: 'Russia news',
            description: 'Live news from Germany',
            background: 'https://i.imgur.com/Taxs6MZ.png',
            poster: 'https://i.imgur.com/mO14ud9.png',
            active: true
        },
        {
            countryCode: 'us',
            name: 'US news',
            description: 'Live news from US',
            background: 'https://i.imgur.com/Vhnep7Z.png',
            poster: 'https://i.imgur.com/kPgcp43.png',
            active: true
        },
        {
            countryCode: 'mx',
            name: 'Mexico news',
            description: 'Live news from Mexico',
            background: 'https://i.imgur.com/06WewkV.png',
            poster: 'https://i.imgur.com/fS66vXG.png',
            active: true
        },
        {
            countryCode: 'ar',
            name: 'Argentina news',
            description: 'Live news from Argentina',
            background: 'https://i.imgur.com/fGgIIgJ.png',
            poster: 'https://i.imgur.com/pO67dxd.png',
            active: true
        },
        {
            countryCode: 've',
            name: 'Venezuela news',
            description: 'Live news from Venezuela',
            background: 'https://i.imgur.com/ERJCinb.png',
            poster: 'https://i.imgur.com/yOTlFm2.png',
            active: true
        },
        {
            countryCode: 'jp',
            name: 'Japan news',
            description: 'Live news from Japan',
            background: 'https://i.imgur.com/s974xIG.png',
            poster: 'https://i.imgur.com/N54HD7z.png',
            active: true
        },
        {
            countryCode: 'cn',
            name: 'Cina news',
            description: 'Live news from Cina',
            background: 'https://i.imgur.com/Bn1HuTz.png',
            poster: 'https://i.imgur.com/E8AuL9q.png',
            active: true
        }
    ]
};