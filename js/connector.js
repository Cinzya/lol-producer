const LCUConnector = require('lcu-connector');
const connector = new LCUConnector();

const connectBtn = document.getElementById('connect');
connectBtn.onclick = connectLCU;
const disconnectBtn = document.getElementById('disconnect');
disconnectBtn.onclick = disconnectLCU;
const dataBtn = document.getElementById('data');
dataBtn.onclick = getData;

var LCU;

// Start listening for the LCU client
async function connectLCU() {
    console.log("Attempting Connection...");
    connector.start();
}

function disconnectLCU() {
    console.log("Attempting disconnect...");
    connector.stop();
}

connector.on('connect', async (data) => {
    console.log(data);
    LCU = data;
    //  {
    //    address: '127.0.0.1'
    //    port: 18633,
    //    username: 'riot',
    //    password: H9y4kOYVkmjWu_5mVIg1qQ,
    //    protocol: 'https'
    //  }

        console.log("Hi");
        let LCUstatus = await LCUrequest("/lol-summoner/v1/status/");
        // if (LCUstatus.ready == true) {
        // }
        console.log("Hallo");
});

connector.on('disconnect', () => {
    console.log("Disconnected");
})

async function LCUrequest(endpoint) {
    console.log("Fetch Data...");
    let basestring = `${LCU.username}:${LCU.password}`;
    let buff = new Buffer(basestring);
    let base64string = buff.toString('base64');
    await fetch(`${LCU.protocol}://${LCU.address}:${LCU.port}${endpoint}`,{
        method: 'GET',
        headers: {
            'Authorization': `Basic ${base64string}`,
            'Accept': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        return data;
    })
    .catch((error) => {
        console.error('Error:', error);
      });
}

function getData() {
    LCUrequest("/lol-summoner/v1/status/");
}