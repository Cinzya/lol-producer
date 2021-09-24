const LCUConnector = require('lcu-connector');
const connector = new LCUConnector();

const connectBtn = document.getElementById('connect');
connectBtn.onclick = connectLCU; 

// Start listening for the LCU client
function connectLCU() {
    console.log("Attempt Connection...");
    connector.start();
}

connector.on('connect', (data) => {
    console.log(data);
    //  {
    //    address: '127.0.0.1'
    //    port: 18633,
    //    username: 'riot',
    //    password: H9y4kOYVkmjWu_5mVIg1qQ,
    //    protocol: 'https'
    //  }
});