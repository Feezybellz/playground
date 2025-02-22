
require('dotenv').config();
const http = require('http');
const axios = require('axios');
const axiosRetry = require('axios-retry');


const nodemailer = require('nodemailer');
const mysql = require('mysql2/promise');


const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const EMAIL_PASS = process.env.EMAIL_PASS;

const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});


const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465, // TLS port
  auth: {
    user: 'belloafeez7@gmail.com',
    pass: EMAIL_PASS,
  },
});

const query_websites = `SELECT * FROM panel_websites_status WHERE visibility = 'show'`;

const mailSentObjectNoter = new Map();


async function getData(query){
  const connection = await pool.getConnection();
  try {
    const [results] = await connection.query(query);
    // console.log(results);
    return results;
  } catch (e) {
    return [];
  }finally {
    connection.release(); // Close the connection after every query
  }
  // .then((results) => {
  //   // console.log('Result:', results[0]);
  //   return results[0];
  // })
  // .catch((error) => {
  //   return error
  //   console.error('Error:', error);
  // })
  // .finally(() => {
  //   return false;
  //   connection.end(); // Close the connection
  // });

};



  function sendStatusMail(website, message){

    const mailOptions = {
      from: 'belloafeez7@gmail.com',
      // to: 'banjimayowa@gmail.com',
      to: 'kobyblaze@gmail.com, belloafeez7@gmail.com, ireoluwa48@gmail.com',
      subject: 'Website Status From '+website,
      html: `<p>Website Status Message <br> ${message} `,
      // html: '<p>This is the HTML body of my email.</p>',
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        // console.error(error);
      } else {
        // console.log(`Email sent: ${info.messageId}`);
      }
    });
    transporter.close();
  }

  // Function to check website status
  async function checkWebsiteStatus(website) {
    const connection = await pool.getConnection();

    const url = website.input_website_url;
    // console.log(url);

    const website_id = website.hash_id;

    const currentDate = new Date();
    const lastLogTimePlus30Min = new Date(new Date(mailSentObjectNoter[website_id].error_log_time).getTime() + 30 * 60 * 1000);
    const update_status_query = `UPDATE panel_websites_status SET input_status = ?, input_error_mail_sent = ? WHERE input_website_url = ?`;


    return new Promise((resolve, reject) => {

        mailSentObjectNoter[website_id]['log_time'] = currentDate;

        try {
                  // axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });
                  axios.get(url, { timeout: 5000 }).then(response => {
                    // console.log(response.status);
                    // const futureTime = new Date(currentDate.getTime() + 1 * 60 * 1000);

                    const statusCode = response.status;

                    if (statusCode === 200) {

                      mailSentObjectNoter[website_id]['sent'] = false;

                      //Check if it encountered an error
                      if(mailSentObjectNoter[website_id].error_log_time !== 0){
                        mailSentObjectNoter[website_id].error_log_time = 0;
                        connection.query(update_status_query, ['active', '', url]);

                      }
                      resolve({ url, status: "Active" });
                    } else {

                      if (currentDate > lastLogTimePlus30Min || mailSentObjectNoter[website_id].error_log_time == 0) {
                        const message_sent =  `Dear Administrator, This is to notify you that ${url} is down with StatusCode: ${statusCode}`;

                        sendStatusMail(url,message_sent);
                        mailSentObjectNoter[website_id]['sent'] = true;

                        //update status in db
                        connection.query(update_status_query, ['inactive', message_sent, url]);

                        mailSentObjectNoter[website_id]['error_log_time'] = currentDate;

                      }
                      resolve({ url, status: `Error: ${statusCode}` });
                    }
                  }).catch(_err=>{
                    // console.log(url);
                    // console.log(_err);
                    const message_sent = `Dear Administrator, This is to notify you that ${url} is down with StatusCode: ${_err}`;

                    if (currentDate > lastLogTimePlus30Min || mailSentObjectNoter[website_id].error_log_time == 0) {
                      sendStatusMail(url,message_sent);
                      mailSentObjectNoter[website_id]['sent'] = 'true1';
                      //update status in db
                      connection.query(update_status_query, ['inactive', message_sent, url]);

                      mailSentObjectNoter[website_id]['error_log_time'] = currentDate;

                    }
                    resolve({ url, status: `Error: ${_err}` });
                  })
        } catch (e) {
          if (currentDate > lastLogTimePlus30Min || mailSentObjectNoter[website_id].error_log_time == 0) {
            sendStatusMail(url,'internal server error');
            mailSentObjectNoter[website_id]['sent'] = 'true1';
            //update status in db
            connection.query(update_status_query, ['inactive', 'internal server error', url]);

            mailSentObjectNoter[website_id]['error_log_time'] = currentDate;

          }
          resolve({ url, status: `Error: ${_err}` });
        } finally {
          connection.release(); // Close the connection after every query
        }

        // .on("error", (error) => {
          //   if (currentDate > lastLogTimePlus30Min || mailSentObjectNoter[website_id].error_log_time == 0) {
            //     sendStatusMail(url, `Dear Administrator, This is to notify you that ${url} is down with Error Message:  ${error.message}`);
            //     mailSentObjectNoter[website_id]['error_log_time'] = currentDate;
            //
            //   }
            //   reject({ url, status: `Error: ${error.message}` });
            // });

    });
  }

  // Check all website statuses concurrently
  async function checkAllWebsites() {
      const websites = await getData(query_websites);
      // console.log(websites);



      // const urls = websites.map(_e=>_e.input_website_url).slice(0, 1);
      const urls = websites.map(_e=>_e.input_website_url);
      // console.log(urls);


      websites.map((website)=>{

        const url = website.input_website_url;
        const website_id = website.hash_id;
        //CHeck if the mail noter has been initiated for this domain
        if (![null, undefined].includes(mailSentObjectNoter[website_id])) {
          mailSentObjectNoter[website_id]['sent'] = mailSentObjectNoter[website_id].sent ?? false;
          mailSentObjectNoter[website_id]['url']= website.input_website_url;
          mailSentObjectNoter[website_id]['error_log_time'] = mailSentObjectNoter[website_id].error_log_time ?? 0;
          mailSentObjectNoter[website_id]['log_time'] = mailSentObjectNoter[website_id].log_time ?? 0;
        }else{
          mailSentObjectNoter[website_id] = {};
          mailSentObjectNoter[website_id]['url'] = website.input_website_url;
          mailSentObjectNoter[website_id]['sent'] = false;
          mailSentObjectNoter[website_id]['error_log_time'] = 0;
          mailSentObjectNoter[website_id]['log_time'] = 0;
        }

      })

      try {
        const results = await Promise.all(websites.map(checkWebsiteStatus));
        // console.table(results);
        // console.log(mailSentObjectNoter);
        checkAllWebsites(); // Recursively restart checks
      } catch (error) {
        // console.error("Error:", error);
        checkAllWebsites(); // Retry even on error
      }

  }

  // checkWebsiteStatus("https://attendout.com");


checkAllWebsites();
