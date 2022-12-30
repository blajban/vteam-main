const invoiceModel = {

    getInvoices: async (object) => {
        if (object.hasOwnProperty("userId")) {
            const response = await fetch(`http://localhost:3500/invoice/user/${object.userId.current.value}`)
            const data = await response.json();
            console.log(data)
            return data
        }
        const response = await fetch(`http://localhost:3500/invoice/${object.invoiceId.current.value}`)
        const data = await response.json();
        return data
    },

    addInvoice: async (userId, status, startLat, startLng, startTime, endLat, endLng, endTime, price) => {

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
        const response = await fetch(`http://localhost:3500/invoice`, {
            body: JSON.stringify({invoice: newInvoice}),
            headers: {
                "content-type": "application/json"
            },
            method: "POST"
        });
    }
}

export default invoiceModel;