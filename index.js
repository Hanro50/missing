/**
 * Copyright 2022 Hanro50
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), 
 * to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES 
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE 
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH 
 * THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 * End license text.
 */

const body = document.documentElement || document.body;
let nervisOverworld = new Audio('./sound/ovmuz.mp3');
nervisOverworld.loop = true;
let hddsound = new Audio('./sound/hdd.mp3');
hddsound.loop = true;
let fan = new Audio('./sound/fan.mp3');
fan.loop = true;
let beep = new Audio('./sound/beep.mp3');
/**@type {Map<String,comObj>()} */
let commands = new Map();

let dail = new Audio('./sound/dail.mp3');
let dailfail = new Audio('./sound/dailfail.mp3');

let dailcom = new Audio('./sound/dailcom.mp3');
dailcom.loop = true;
class comObj {
    /**
     * @param {String} name 
     * @param {String} disc 
     * @param {(params: String[]) => void} func 
     */
    constructor(name, disc, func) {
        this.name = name;
        this.disc = disc;
        this.func = func;
        commands.set(this.name, this);
        console.log(this);
    }
}

function resize() {
    body.scrollTop = body.scrollHeight - body.clientHeight;
}
window.onresize = resize;
function load() {

    body.onclick = () => input.focus();
    fan.play();
    reboot();
}
let hheader = "";
let hsound = hddsound;


/**@type {HTMLPreElement} */
const command = document.getElementById("command.com");
/**@type {HTMLInputElement} */
const input = document.getElementById("input.com");
input.oninput = () => {
    input.style.width = input.value.length + "ch";
}
input.oninput();

var height = 1;
function clear() {
    height = 1;
    command.innerText = "";
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
/**
 * 
 * @param {String} txt 
 */
async function print(txt) {
    let p = 0;
    for (var i = 0; i < txt.length; i++) {
        await sleep(10);
        if (i % 80 == p || txt[i] == "\n") {
            command.textContent += "\n";
            resize();
            p = i % 80;
            if (txt[i].trim().length <= 0) continue;
        }
        command.textContent += txt[i];
    }
    resize();
}

async function reboot() {
    nervisOverworld.pause();
    input.disabled = true;
    hddsound.play()
    clear();
    await beep.play();
    await print("Booting Han-Dos V1.67")
    await print("Loading....")
    await print("Error...Write fault error at 0xc004f050  0xc004f051  0xc004f330.... ")
    await sleep(1000);
    clear();
    await beep.play();
    await print("Booting Han-Dos V1.67")
    await print("Detected error during last boot attempt. Mounting file system in read only mode.Reboot to resolve error")
    hddsound.pause()
    await mainDos();
    input.disabled = false;
    input.focus();
}

async function mainDos() {
    hsound = hddsound;
    commands.clear();
    hheader = "Reading...";
    await print("Reading disk...");
    hddsound.play();
    await print("\n\nHan-Dos V1.67 command.com loaded\nType 'help' for the command list")
    new comObj("dir", "List the files on the harddrive", async e => {
        await print("Reading disk...");
        hddsound.play();
        await sleep(100);
        await print("command.com\nedit.com\ndir.com\nnervin.com\nnervin.dll\nreboot.com\nlogin.txt");
        await sleep(1000);
        await print("527,219 bytes free...");
        hddsound.pause();
    });
    new comObj("command", "The command interpreture", async e => {
        await sleep(100);
        clear();
        await mainDos();
    });
    new comObj("nervin", "Nervin BBS explorer", async e => {
        //for the future
        await print("Loading Nervin.");

        if (e.length <= 0) {
            await print("Usage nervin <server>");
        } else if (e[0] == "27-555-5677") {
            nervin()


        } else {
            await print("Connecting to '" + e[0] + "'. Please wait...");
            dailfail.play();
            await sleep(14000);
            await print("Connection has timed out");
        }


        hddsound.pause();
    });
    new comObj("edit", "A text editor", async e => {
        hddsound.play();
        console.log(e)
        if (e.length <= 0) {
            await print("Usage edit <text file>");
        } else if (e[0] == "login.txt") {
            await print("Narvin login detail.\nI won't reset them for you again Mitch!\n-Admin");
            await print("Server: 27-555-5677");
            await print("username: mitch07");
            await print("password: qwerty@123");

            await print("\n\nHDD in read only mode.\nCannot edit file, please reboot!");
        } else if (!e[0].endsWith(".txt")) {
            await print("Segmentation fault, core dumped.");
        }
        else {
            await print("\n\nHDD in read only mode.\nCannot create file, please reboot!");
        }
        hddsound.pause();
    });
    new comObj("shutdown", "Shutdown machine", async e => {
        fan.pause();
        window.location.href = "/"
    });
    new comObj("reboot", "Restarts this machine", reboot);
    hddsound.pause();
    input.focus();
}


body.onkeydown = async (ev) => {
    if (ev.key == "Enter" && commands.size > 0) {
        input.disabled = true;
        let parems = input.value.toLocaleLowerCase().split(" ");
        let com = parems.shift();
        input.value = "";
        input.oninput();
        if (com == "help") {
            hsound.play();
            await print(hheader);
            await sleep(100);
            for (const key of commands.keys()) {
                console.log(commands.get(key))
                await print(key + ": " + commands.get(key).disc);
            }
            hsound.pause();
        } else if (commands.has(com)) {
            await commands.get(com).func(parems);
        } else if (com.length > 0) {
            await print("Unknown command!");
        }
        input.disabled = false;
        input.focus();
    }
}

async function nervin() {
    await print("Connecting to '27-555-5677'. Please wait...");
    await dail.play();
    await sleep(26000);
    commands.clear();
    await print("Welcome to Nervin BBS v5.07. Type 'help' to proceed")
    hsound = dailcom;
    hheader = "BBS Help menu"
    new comObj("leave", "Exit back to Dos...", async e => {
        dailcom.play();
        await print("Connection to BBS lost, status 200: User disconnect");
        dailcom.pause();
        mainDos()
    });
    new comObj("login", "enter your login details", async e => {

        if (e.length <= 1) {
            await print("Usage login <username> <password>");
        } else if (e[0] == "mitch07" && e[1] == "qwerty@123") {
            dailcom.play();
            await nervin2();
            dailcom.pause();

        }
        else {
            dailcom.play();
            await sleep(500);
            dailcom.pause();
            await print("Incorrect username or password. Please try again");
        }
    });

    new comObj("wipe", "delete BBS data <Administrators only>", async e => {
        dailcom.play();
        await print("Err....")
        await print("Connection to BBS lost, error 500:\nContact BBS administrator, connection was lost due to server error.")
        localStorage.clear();
        mainDos();
        dailcom.pause()
    });
}

async function nervin2() {
    hsound = dailcom;
    hheader = "BBS Help menu"
    commands.clear();
    clear();
    await print("Welcome user Mitch07. It has been over...<ERROR> ");
    if (!localStorage.getItem("c_intro")) {
        await print("A new user?!...");
        await print("How...long has it been. Sorry, this service is a mess right now. Huh");
        await sleep(900);
        await print("Let me just get that floppy...there we go...");
        await print("Sorry for the wait...");
        hddsound.play()
        await sleep(100);
        hddsound.pause()
        localStorage.setItem("c_intro", "true");
    }
    await print("Welcome to Nervin RPG adventure beta!\nCopyright 1987 - Hancorp incorperated");
    await print("Type 'help' to begin your adventure!");
    hheader = "RPG action menu"

    new comObj("logout", "Disconnect from service <Warning, unsaved data will be lost>", async e => {
        mainDos();
    });
    new comObj("look_around", "Look around in your environment", async e => {
        dailcom.play();
        await sleep(100);
        dailcom.pause();

        commands.delete("look_around");
        let hazkey = false;
        let uncovered = false;
        let unlock = false;
        if (!localStorage.getItem("c_exit")) {
            await print("You seem to be in darkness. As your eyes adjust you see a key shine.");
            await print("Near the key you see to be what looks to be a door")
            new comObj("inspect", "Inspect items around you", async e => {
                if (e.length <= 0) {
                    await print("Usage inspect <key/door>");
                } else if (e[0] == "key") {
                    if (hazkey) {
                        await print("You look at the key in your hand\nIt is cold...");
                    } else if (!uncovered) {
                        await print("You rub the dirt away from the key.");
                        uncovered = true;
                        new comObj("pickup", "take an item", async e => {
                            if (e.length <= 0) {
                                await print("Usage pickup <item>");
                            } else if (e[0] == "key" && !hazkey) {
                                await print("You managed to pick up the key.");
                                hazkey = true;
                            } else {
                                await print("You could not find the object you wanted to pick up.");
                            }
                        })

                    }
                    else {
                        await print("You see the key clearly now...");
                    }

                } else if (e[0] == "door") {
                    if (unlock)
                        await print("The key sits in the key slot...\nYou seem unable to remove it again.");
                    else if (hazkey) {
                        await print("The key in your hand fits within the key slot");
                        unlock = true;
                        new comObj("turn_key", "turn the key in the door", async e => {
                            await nervin_ow();
                        });
                    } else {
                        await print("You push against the door. It is firmly locked.");
                    }
                } else {
                    await print("Could not see item...");
                }
            });
        } else {
            await print("You see an open door leading to the exit.");
            new comObj("exit", "Exit through the open door", async e => {
                await nervin_ow();
            });
        }
    });
}
function mp(place = "none") {
    new comObj("visit", "Visit one of the two locations seen in your map", async e => {
        if (e.length != 1) { await print("Usage /visit [location]"); return; }
        switch (e[0]) {
            case ("nervin"): place == "nervin" ? print("You are already here") : nervin_town(); break;
            case ("dander"): place == "dander" ? print("You are already here") : dander_town(); break;
            case ("missing"): print("Floppy disk missing..."); break;
            default: print("Unknown location")
        }
    });

}
function nervin_con() {
    new comObj("map", "Check your map", async e => {
        await print("You open your map.");
        if (!localStorage.getItem("c_map")) {
            localStorage.setItem("c_map", "true");
            dailcom.play();
            await sleep(500);
            dailcom.pause();
            mp();
        }
        await print("You see two locations. 'dander' and 'nervin'");
    });
    new comObj("logout", "Disconnect from service <Warning, unsaved data will be lost>", async e => {
        nervisOverworld.pause();
        mainDos();
    });

    new comObj("logout", "Disconnect from service <Warning, unsaved data will be lost>", async e => {
        nervisOverworld.pause();
        mainDos();
    });
    new comObj("mute", "Stops the music from playing", async e => {
        nervisOverworld.pause();
    });
}

async function nervin_ow() {
    hsound = dailcom;
    hheader = "BBS Help menu"
    if (!localStorage.getItem("c_exit")) {
        hddsound.play()
        await sleep(300);
        hddsound.pause()
        localStorage.setItem("c_exit", "true");

        await print("...I can't find the next floppy\nI need to go look for it...\nfudge, I am sorry user...please check back...found it!");
        await print("Loading overworld. Please wait.");
        dailcom.play();
        await sleep(500);
        dailcom.pause();
    }
    commands.clear();
    await print("Midi data sent...activating sound card...");

    nervisOverworld.play();
    await print("Done, map locations are loaded. Type 'help' for more information...");

    nervin_con();

    if (localStorage.getItem("c_map"))
        mp();


}
async function dander_town() {
    hsound = dailcom;
    hheader = "BBS Help menu";
    commands.clear();
    mp("dander");
    await print("You enter dander...");
    nervin_con();
    new comObj("tavern", "Visit the nearby tavern", async e => {
        await print("You enter the tavern");
        commands.clear();
        nervin_con();
        async function observed() {
            new comObj("ask", "Ask someone a few questions", async e => {
                if (e.length != 1) {
                    await print("Available people include the 'bartender', the 'drunk' or the 'wizard'");
                    return;
                }
                switch (e[0]) {
                    case ("bartender"):
                        if (localStorage.getItem("c_rich")) {
                            await print("The bartender tells you about his time in Nervin over a few drinks.\nYou learn the password for the market in the process.")
                            localStorage.setItem("c_pass", "true");
                        } else
                            await print("The bartender refuses to answer non paying customers. You are unfortunately broke.")
                        break;
                    case ("drunk"):
                        await print("The drunk said he use to be a pirate. He barried his booty in Nervin")
                        localStorage.setItem("c_tressure", "true");
                        break;
                    case ("wizard"): print("The wizard asked you if you needed help installing something...\nWhatever that means..."); break;
                    case ("admin"): if (!localStorage.getItem("a_fff")) { localStorage.setItem("a_fff", "true"); print("You feel someone is watching..."); break };
                    default: print("Unknown person")
                }

            });
        }


        new comObj("exit", "Exit the tavern", dander_town);

        new comObj("look", "Look around the tavern", async e => {
            await print("You see a drunk, the tavern keep and a mysterious wizard.")
            localStorage.setItem("c_tavern_view", "true");
            observed()
        });
        if (localStorage.getItem("c_tavern_view")) {
            observed()
        }
    })
}

async function nervin_town() {
    hsound = dailcom;
    hheader = "BBS Help menu";
    commands.clear();
    await print("You enter nervin...");
    mp("nervin");
    nervin_con();
    new comObj("market", "Browse the local market", async e => {
        if (!localStorage.getItem("c_pass")) {
            await print("The market won't allow you in without a password which your character has yet to learn.");
            return;
        }
        await print("You wonder the mar....segmentation fault...");
        await sleep(1000);
        await print("You connection has timed out!");
        await sleep(100);
        await print("Critical fault detected. Rebooting...");
        await reboot();
    })

    new comObj("dig", "Dig for barried tressure", async e => {
        if (localStorage.getItem("c_rich")) {
            await print("You already found the tressure.");
            return;
        }
        if (localStorage.getItem("c_tressure")) {
            await print("You found the tressure the old drunk told you about");
            localStorage.setItem("c_rich", "true");
            return;
        }
        let ops = ["The town guard asks you to stop digging in the middle of the street.",
            "Lady Minx attacks you with a handbag for digging up her garden",
            "Some dwarfs chased you away from their territory!",
            "Error: Digging error not loaded."]
        await print(ops[Math.floor(ops.length * Math.random())]);
    })

}
body.onclick = load;

