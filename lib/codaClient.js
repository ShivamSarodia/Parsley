const axios = require('axios')

const CODA_API_KEY = process.env.CODA_API_KEY;
const CODA_DOC_ID = process.env.CODA_DOC_ID;

axios.defaults.headers.common['Authorization'] = `Bearer ${CODA_API_KEY}`;

exports.addTableRows = async function(tableId, rows, keyColumns) {
  const url = `https://coda.io/apis/v1beta1/docs/${CODA_DOC_ID}/tables/${tableId}/rows`;
  return axios.post(url, { rows, keyColumns })
    .catch((err) => {
      console.log("Axios error:");
      console.log(err.response.data);
      throw err;
    });
}