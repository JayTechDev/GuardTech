const { ThreadChannel } = require('discord.js');

module.exports = {
    name: 'threadCreate',
    /**
     * @param {ThreadChannel} thread
     */
    async execute(thread) {
        await thread.join();

        if (thread.parentId === '1019648404445474909') {
            thread.send({ 
                content: [
                    '- Explain your exact issue, the more descriptive you are the more we can help.',
                    '- Post any screenshots/videos that are relevent to your issue.',
                    '- Try and search other posts, Google or ChatGPT for similar problems and solutions.',
                    '- Do not use this to report users or concerns, open a ticket for that.',
                    '- Do not ping anyone for support, it will not help at all.'
                ].join('\n')
            });
        };
    },
};