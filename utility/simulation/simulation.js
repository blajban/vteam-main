

const { MessageBroker } = require('../../shared/mq');
const { host, eventTypes, exchanges } = require('../../shared/resources');

/* 
            // Fill up with more scooters if scooters in db is not enough? Or make variable amounts of gets from db?
            if (scooters.length < noOfScooters) {
                for (let i = 0; i < (noOfScooters - scooters.length); i++) {
                    // (make id random!)
                    scooters.push({
                        scooterId: i,
                        status: "inactive",
                        userId: 0,
                        properties: {
                            location: "göteborg",
                            lat: 57.721060344500096,
                            long: 11.938873333564857,
                            speed: "0",
                            battery: "100"  
                        },
                        log: []
                    });
                    
                }
                
            }
            */

            // /// // 
            //console.log(scooters);



const main = async () => {

    const idleReporting = (scooter) => {
        console.log(`Scooter ${scooter.scooterId} reporting!`);
        const newEvent = broker.constructEvent(eventTypes.scooterEvents.scooterIdleReporting, scooter);
        broker.publish(newEvent);
    }
    
    const broker = await new MessageBroker(host, exchanges.scooters, 'simulation');

    // Listen for simulation start
    broker.onEvent(eventTypes.adminEvents.simulateScooters, (e) => {
        //const noOfScooters = JSON.parse(e.data).scooters;
        
        // Get scooters from scooter service
        const req = broker.constructEvent(eventTypes.rpcEvents.getScooters, {});
        broker.request(req, (res) => {
            const scooters = Object.assign([], res);
            console.log(`Initialized ${scooters.length} scooters from scooter_service...`);

            
            // Set eventlisteners and intervals for all scooters
            for (let i = 0; i < scooters.length; i++) {
                setInterval(() => {
                    idleReporting(scooters[i]);
                }, 4000);

                // Set the rest of event listeners


            }


        });
    });
    
} 





main();





