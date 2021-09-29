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
function connectLCU() {
    console.log("Attempting Connection...");
    connector.start();
}

function disconnectLCU() {
    console.log("Attempting disconnect...");
    connector.stop();
}

connector.on('connect', (data) => {
    console.log(data);
    LCU = data;
    //  {
    //    address: '127.0.0.1'
    //    port: 18633,
    //    username: 'riot',
    //    password: H9y4kOYVkmjWu_5mVIg1qQ,
    //    protocol: 'https'
    //  }
});

connector.on('disconnect', () => {
    console.log("Disconnected");
})

function getData() {
    console.log("Fetch Data...");
    let basestring = `riot:SMizXFHgnXYK2RPSDmgx5A`;
    let buff = new Buffer(basestring);
    let base64string = buff.toString('base64');
    fetch(`https://${LCU.address}:${LCU.port}/lol-summoner/v1/status/`,{
        method: 'GET',
        headers: {
            'Authorization': `Basic cmlvdDpTTWl6WEZIZ25YWUsyUlBTRG1neDVB`,
            'Accept': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch((error) => {
        console.error('Error:', error);
      });
}