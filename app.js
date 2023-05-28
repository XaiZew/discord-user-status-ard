const five = require('johnny-five');
const board = new five.Board({ port: "COM4" });
const Oled = require('oled-js');

var font = require('oled-font-5x7');

const { Client, GatewayIntentBits } = require("discord.js");
require('dotenv/config');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
    ]});

const sleep = ms => new Promise(r => setTimeout(r, ms));

const peeps = ['XXXXXXXXXXXXXXXXXXXX', 'XXXXXXXXXXXXXXXXXXXX', 'XXXXXXXXXXXXXXXXXXXX', 'XXXXXXXXXXXXXXXXXXXX', 'XXXXXXXXXXXXXXXXXXXX'];
let activeUsers = [];
let maxTimeout = 600; // in seconds

let allUsers = [
    {
        id: "XXXXXXXXXXXXXXXXXXXX", // Name
        name: "",
        status: "offline"
    },
    {
        id: "XXXXXXXXXXXXXXXXXXXX",
        name: "",
        status: "offline"
    },
    /*
    {
        id: "XXXXXXXXXXXXXXXXXXXX", // name
        name: "",
        status: "offline"
    }
    */
]

client.on('ready', async () => {
    console.log("Bot Online.");
    client.user.setActivity("currently building legos");
    const guild = client.guilds.cache.get("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")

    while (true) {
        for (x = 0; x < peeps.length; x++) {
            let currMem = peeps[x];

            client.users.fetch(peeps[x]).then(m => {
                /*
                m.send("hi").then(msg => {
                    msg.delete();
                });
                */
            });

            guild.members.fetch(peeps[x]).then(ms => {
                let activeU = false;
                for (i = 0; i < activeUsers.length; i++) {
                    if (currMem === activeUsers[i][0]) {
                        activeU = true;
                    }
                }

                if (activeU) {
                    console.log(ms.user.username + " is currently active");

                    for (i = 0; i < allUsers.length; i++) {
                        if (allUsers[i].id === ms.user.id) {
                            allUsers[i].status = "active";
                        }
                    }
                }
                else {
                    ms.presence ? console.log(ms.user.username + " is currently " + ms.presence.status) : console.log(ms.user.username + " is currently offline");
                    let on = ms.presence ? true : false;
                    for (i = 0; i < allUsers.length; i++) {
                        // console.log(allUsers[i].id + " : " + ms.user.id);
                        if (allUsers[i].id === ms.user.id && on) {
                            if (activeU)
                                allUsers[i].status = "active";
                            else
                                allUsers[i].status = "online";
                            allUsers[i].name = ms.user.username;
                        }
                        else if (allUsers[i].id === ms.user.id && !on) {
                            allUsers[i].status = "offline";
                            allUsers[i].name = ms.user.username;
                        }
                    }
                    // console.log(ms.user.username + " is currently " + ms.presence.status);
                }
            })
        }
        for (i = 0; i < activeUsers.length; i++) {
            activeUsers[i][1] += 1;
            if (activeUsers[i][1] > maxTimeout) {
                activeUsers.splice(i, 1);
            }
        };
        await sleep(1000);
        // console.log(activeUsers);
        // console.log("\n \n \n");
        // await sleep(Math.floor() * (12000 - 1000 + 1) + 1000);
    }
});

client.on('messageCreate', (msg) => {
    for (x = 0; x < peeps.length; x++) {
        if (msg.author.id == peeps[x]) {
            for (i = 0; i < activeUsers.length; i++) {
                if (activeUsers[i][0] === peeps[x]) {
                    activeUsers.splice(i, 1);
                }
            };
            let newArr = [peeps[x], 0];
            activeUsers.push(newArr);
        }
    }
});

client.login('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');