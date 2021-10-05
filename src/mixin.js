import { mapState } from 'vuex';
export default {
  computed: {
    ...mapState(['LCU'])
  },
    methods: {
      requestLCU: async function(endpoint) {
        console.log("Fetch Data...");
        let basestring = `${this.LCU.username}:${this.LCU.password}`;
        let buff = new Buffer(basestring);
        let base64string = buff.toString('base64');
        await fetch(`${this.LCU.protocol}://${this.LCU.address}:${this.LCU.port}${endpoint}`,{
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
    }
};