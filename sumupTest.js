require("dotenv").config({
  path: "./frontend/.env",
});

const axios = require("axios");

async function test() {

  try {

    const response = await axios.get(
      "https://api.sumup.com/v0.1/me/transactions/history",
      {
        headers: {
          Authorization: `Bearer ${process.env.SUMUP_API_KEY}`,
        },
      }
    );

    console.log(
      JSON.stringify(
        response.data.items[0],
        null,
        2
      )
    );

  } catch (err) {

    console.log(
      err.response?.data || err.message
    );
  }
}

test();