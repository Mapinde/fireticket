const axios = require('axios');

const sendSmsService = {
    sendSms: async (text, number) => {
        const url = `https://zungas.kodikos.io/api/messages?message=${text}&to[]=${number}`;
        await axios.post(url, {},{
            auth: {
                username: 'zungas',
                password: 'j+Y7_USp].[]6h$b'
            },
        })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

};

module.exports = sendSmsService;