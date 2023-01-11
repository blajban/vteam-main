const api_key = require('../api-key.json');

const invoiceModel = {

    getInvoices: async (loginId, token, object) => {
        if (object.hasOwnProperty("userId")) {
            const response = await fetch(`http://localhost:3500/v1/invoice/${loginId}/user/${object.userId.current.value}`, {
                headers: {
                    'x-access-token': token,
                    'x-api-key': api_key.key
                }
            })
            const data = await response.json();
            return data
        }
        const response = await fetch(`http://localhost:3500/v1/invoice/${loginId}/${object.invoiceId.current.value}`, {
            headers: {
                'x-access-token': token,
                'x-api-key': api_key.key
            }
        })
        const data = await response.json();
        return data
    },

    addInvoice: async (loginId, token, userId, status, startLat, startLng, startTime, endLat, endLng, endTime, price) => {

        [userId, status, startLat, startLng, startTime, endLat, endLng, endTime, price].forEach(i => {
            if(!i.current.value) {
                i.current.value = null;
            }
        });          
        
        const newInvoice = {
            userId: userId.current.value,
            status: status.current.value,
            start: {
                lat: startLat.current.value,
                lng: startLng.current.value,
                time: startTime.current.value 
            },
            end: {
                lat: endLat.current.value,
                lng: endLng.current.value,
                time: endTime.current.value
            },
            price: price.current.value
        }
        console.log(newInvoice)
        const response = await fetch(`http://localhost:3500/v1/invoice/${loginId}`, {
            body: JSON.stringify({invoice: newInvoice}),
            headers: {
                "content-type": "application/json",
                'x-access-token': token,
                'x-api-key': api_key.key
            },
            method: "POST"
        });
    },

    payInvoice: async (loginId, token, invoiceId, userId, price) => {
        console.log(loginId, token, invoiceId, userId, price)
        try {
            const response1 = await fetch(`http://localhost:3500/v1/invoice/${loginId}/pay/${invoiceId}`, {
                headers: {
                    'content-type': 'application/json',
                    'x-access-token': token,
                    'x-api-key': api_key.key,
                },
                method: "PUT"
            });
        }
        catch (e) {
            console.error("couldnt update invoice", e);
        }
        
        try {
            const response2 = await fetch(`http://localhost:3500/v1/users/${loginId}/${userId}`, {
                body: JSON.stringify({balance: price}),
                headers: {
                    'content-type': 'application/json',
                    'x-access-token': token,
                    'x-api-key': api_key.key,
                },
                method: "PUT"
            });
        }
        catch (e) {
            console.error("couldnt update user balance", e);
        }
        
        console.log(response1, response2)
    }
    
}

export default invoiceModel;