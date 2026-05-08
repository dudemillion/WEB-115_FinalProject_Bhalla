const start = document.getElementById("start");
const title = document.getElementById("title");
const cap1 = document.getElementById("cap1");
const cap2 = document.getElementById("cap2");
const gamediv = document.getElementById("game");
const animframes = ["", "Lpaw", "", "Rpaw"];
let selected = null;
let selectedcat = document.createElement("p");
let money = 0;
let selectedorder = null;
selectedcat.innerHTML = "Selected Cat: ";
selectedcat.style.fontFamily = "Momentz";
selectedcat.style.position = "fixed";
selectedcat.style.top = "0";
selectedcat.style.left = "0";
selectedcat.style.color = "rgb(150, 106, 52)";
selectedcat.style.fontSize = "130%";
selectedcat.style.padding = "10px";
const loaddelay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
class Cat {
    constructor(name, personality, position, pelt, spritedir, speed, busy, moving) {
        this.name = name;
        this.personality = personality;
        this.position = position;
        this.pelt = pelt;
        this.spritedir = spritedir;
        this.index = 0;
        this.speed = speed;
        this.busy = false;
        this.moving = false;
    }
    renderCat() {
        let newCat = document.createElement("img");
        newCat.src = "media/" + this.pelt + this.spritedir + ".png";
        newCat.style.minHeight = "64px";
        newCat.style.position = "absolute";
        newCat.style.left = this.position[0] + "px";
        newCat.style.top = this.position[1] + "px";
        newCat.style.zIndex = 2;
        this.image = newCat;
        newCat.addEventListener("click", (event) => {
            if (this.moving) return;
            if (this.busy) return;
            event.stopPropagation();
            if (selected !== this) {
                selectedcat.innerHTML = "Selected Cat: " + this.name;
                selected = this;
                console.log("Player selected " + this.name);
                cats.forEach((cat) => {
                    cat.updateSelection();
                })
                newCat.style.borderStyle = "solid";
                newCat.style.borderWidth = "1px";
                newCat.style.borderColor = "yellow";
            } else {
                selectedcat.innerHTML = "Selected Cat: ";
                console.log("Player deselected " + this.name);
                newCat.style.borderStyle = "none";
                selected = null;
            }
        })
        gamediv.appendChild(newCat);
    }
    updateSelection() {
        if (selected !== this) {
            this.image.style.borderStyle = "none";
        }
    }
    moveTo(target) {
        this.moving = true;
        let startX = parseInt(this.position[0]);
        let startY = parseInt(this.position[1]);
        let dist = Math.hypot(target[0] - startX, target[1] - startY);
        let dura = dist/this.speed;
        let anim = setInterval(() => {
            this.index = (this.index + 1) % animframes.length;
            this.image.src = "media/" + this.pelt + this.spritedir + animframes[this.index] + ".png";
        }, 200);
        let movement = this.image.animate([
            {left: startX + "px", top: startY + "px"},
            {left: target[0] + "px", top: target[1] + "px"}
        ], {
            duration: dura,
            fill: 'forwards',
            easing: 'linear'
        });
        setTimeout(() => {
            clearInterval(anim);
            this.moving = false;
            this.image.src = "media/" + this.pelt + this.spritedir + ".png";
            this.index = 0;
            this.position = [target[0] + "px", target[1] + "px"]
        }, dura);
        return movement;
    }
}
function updateMoney() {
    document.getElementById("moneycount").innerHTML = "$" + money;
}
class Customer {
    constructor(name, personality, position, order, variation, happiness, spritedir, sprite, busy, givenorder, playedcat, table) {
        this.name = name;
        this.personality = personality;
        this.position = position;
        this.order = order;
        this.variation = variation;
        this.happiness = 5;
        this.spritedir = spritedir;
        this.sprite = "media/personplaceholder.png";
        this.busy = false;
        this.givenorder = false;
        this.playedcat = false;
        this.table = null;
    }
    renderCustomer() {
        let newCustomer = document.createElement("img");
        newCustomer.src = this.sprite;
        newCustomer.style.maxHeight = "150px";
        newCustomer.style.position = "absolute";
        newCustomer.style.left = this.position[0] + "px";
        newCustomer.style.top = this.position[1] + "px";
        this.image = newCustomer;
        let infobox = document.createElement("div");
        this.infobox = infobox;
        infobox.innerHTML = "Name: " + this.name + "<br>" + "Order: " + this.order + "<br>" + "You have " + (this.givenorder ? "" : "not") + " given them their order." + "<br>" + "Personality: " + this.personality + "<br>" + "Happiness: " + this.happiness;
        infobox.hidden = true;
        infobox.style.fontFamily = "Baloo";
        infobox.style.fontSize = "110%";
        infobox.style.backgroundColor = "rgb(182, 82, 0)";
        infobox.style.padding = "5px";
        infobox.style.borderRadius = "5px";
        infobox.style.position = "absolute";
        infobox.style.zIndex = 5;
        gamediv.appendChild(infobox);
        newCustomer.addEventListener("mousemove", (event) => {
            infobox.style.left = event.pageX + 15 + "px";
            infobox.style.top = event.pageY + 15 + "px";
        });
        newCustomer.addEventListener("mouseenter", () => {
            if (selected || selectedorder) {
                newCustomer.style.borderStyle = "solid";
                newCustomer.style.borderWidth = "1px";
                newCustomer.style.borderColor = "yellow";
            }
            infobox.hidden = false;
        });
        newCustomer.addEventListener("mouseleave", () => {
            infobox.hidden = true;
            newCustomer.style.borderStyle = "none";
        });
        newCustomer.addEventListener("click", (event) => {
            event.stopPropagation();
            if (this.busy) return;
            newCustomer.style.borderStyle = "none";
            if (selected) {
                if (!this.playedcat) {
                    let thiscat = selected;
                    this.matchPersonality(thiscat);
                    this.busy = true;
                    thiscat.busy = true;
                    thiscat.moveTo([this.position[0], this.position[1] + 90]).onfinish = () => {
                        thiscat.image.style.filter = "grayscale(100%)";
                        console.log("set gray");
                    };
                    selected = null;
                    thiscat.image.style.borderStyle = "none";
                    selectedcat.innerHTML = "Selected Cat: ";
                    setTimeout(() => {
                        thiscat.busy = false;
                        this.busy = false;
                        thiscat.image.style.filter = "grayscale(0%)";
                        this.updateInfo();
                        this.checkReadyToLeave();
                    }, 10000);
                } else {
                    console.log("Customer already played with cat!");
                }
            } else {
                console.log("No selected cat.")
            }
            if (selectedorder) {
                if (!this.givenorder) {
                    let thisorder = selectedorder;
                    this.matchOrder(thisorder.id);
                    selectedorder = null;
                    this.updateInfo();
                    this.checkReadyToLeave();
                }
            }
        });
        this.happinessdown = setInterval(() => {
            this.happiness -= 1;
            this.updateInfo();
        }, 10000);
        gamediv.appendChild(newCustomer);
    }
    updateInfo() {
        this.infobox.innerHTML = "Name: " + this.name + "<br>" + "Order: " + this.order + "<br>" + "You have " + (this.givenorder ? "" : "not") + " given them their order." + "<br>" + "Personality: " + this.personality + "<br>" + "Happiness: " + this.happiness;
    }
    matchPersonality(cat) {
        if (this.playedcat) return;
        if (cat && cat.personality) {
            this.playedcat = true;
            if (cat.personality == this.personality) {
                this.happiness += 3;
                return true;
            } else {
                this.happiness -= 1;
                return false;
            }
        } else {
            console.log("Error! No cat or personality is undefined!")
        }
    }
    matchOrder(given) {
        if (given) {
            this.givenorder = true;
            if (given == this.order) {
                this.happiness += 2;
            } else {
                this.happiness -= 1;
            }
        } else {
            console.log("Error! Order is undefined!")
        }
    }
    leave() {
        this.table.setAttribute("taken", "false");
        this.image.remove();
        this.infobox.remove();
        customers = customers.filter(c => c !== this);
    }
    checkReadyToLeave() {
        if (this.playedcat && this.givenorder) {
            money += (this.happiness * 2);
            updateMoney();
            clearInterval(this.happinessdown);
            this.leave();
        }
    }
}
let cats = [
    new Cat("Luna", "Calm", [Math.floor(Math.random() * 501), Math.floor(Math.random() * 501)], "luna", "forward", 0.2), 
    new Cat("Coffee", "Energetic", [Math.floor(Math.random() * 501), Math.floor(Math.random() * 501)], "brown", "forward", 0.4),
    new Cat("Frost", "Drowsy", [Math.floor(Math.random() * 501), Math.floor(Math.random() * 501)], "frost", "forward", 0.2),
    new Cat("Leo", "Playful", [Math.floor(Math.random() * 501), Math.floor(Math.random() * 501)], "leo", "forward", 0.3),
    new Cat("Stripes", "Independent", [Math.floor(Math.random() * 501), Math.floor(Math.random() * 501)], "stripe", "forward", 0.3)
];
let orders = ["Latte", "Cappuccino", "Americano", "Croissant", "Donut", "Macaron"];
let names = ["John", "Jane", "Delaney", "Nick", "Tristan", "Ethan", "Alex", "Sami", "Henry", "Jordan", "Christina", "Nyx", "Vincent"];
let personalities = ["Calm", "Energetic", "Drowsy", "Playful", "Independent"];
let customers = [];
function newcustomer() {
    if (customers.length >= 3) return;
    let positions = [[400, 525], [800, 180], [1000, 440]]
    console.log(customers.length);
    for (const table of tables) {
        console.log(table.getAttribute("taken"));
        if (table.getAttribute("taken") === "false") {
            table.setAttribute("taken", "true");
            let pos = JSON.parse(table.getAttribute("pos"));
            let newcust = new Customer(names[Math.floor(Math.random() * names.length)], personalities[Math.floor(Math.random() * personalities.length)], [pos[0], pos[1]], orders[Math.floor(Math.random() * orders.length)], "normal", 5, "forward");
            newcust.renderCustomer();
            newcust.table = table;
            customers.push(newcust);
            break;
        }
    }

}
start.addEventListener("click", function () {
    start.style.display = "none";
    cats.forEach((cat) => {
        cat.renderCat();
    })
    window.addEventListener("click", function(event) {
        cats.forEach((cat) => {
            cat.updateSelection();
        })
        let x = event.clientX - 32;
        let y = event.clientY - 64;
        if (selected == null) {
            console.log("no selected cat");
        } else if ((!selected.busy) && (!selected.moving)) {
            let thiscat = selected;
            thiscat.image.style.borderStyle = "none";
            thiscat.moveTo([x, y]);
            selected = null;
            selectedcat.innerHTML = "Selected Cat: ";
        } else {
            console.log("Cat is busy with customer or moving. Can't move them.");
        }
    })
    title.style.display = "none";
    cap1.style.display = "none";
    cap2.style.display = "none";
    document.body.style.setProperty("--before-image", "''")
    gamediv.appendChild(selectedcat);
    let moneyicon = document.createElement("img");
    moneyicon.src = "media/money.png";
    moneyicon.style.maxHeight = "75px";
    moneyicon.style.position = "fixed";
    moneyicon.style.top = "10px";
    moneyicon.style.right = "10px";
    let moneycount = document.createElement("p");
    moneycount.id = "moneycount";
    moneycount.innerHTML = "$0";
    moneycount.style.fontFamily = "Baloo";
    moneycount.style.fontSize = "30px";
    moneycount.style.color = "rgb(9, 109, 0)";
    moneycount.style.position = "fixed";
    moneycount.style.top = "0px";
    moneycount.style.right = "90px";
    moneycount.style.textAlign = "right";
    let table1 = document.createElement("img");
    table1.src = "media/table.png";
    table1.style.maxHeight = "128px";
    table1.style.position = "absolute";
    table1.style.top = "500px";
    table1.style.left = "970px";
    table1.style.zIndex = 4;
    table1.style.pointerEvents = "none";
    table1.setAttribute("taken", "false");
    table1.setAttribute("pos", "[400, 525]");
    let table2 = document.createElement("img");
    table2.src = "media/table.png";
    table2.style.maxHeight = "128px";
    table2.style.position = "absolute";
    table2.style.top = "240px";
    table2.style.left = "770px";
    table2.style.zIndex = 4;
    table2.style.pointerEvents = "none";
    table2.setAttribute("taken", "false");
    table2.setAttribute("pos", "[800, 180]");
    let table3 = document.createElement("img");
    table3.src = "media/table.png";
    table3.style.maxHeight = "128px";
    table3.style.position = "absolute";
    table3.style.top = "585px";
    table3.style.left = "365px";
    table3.style.zIndex = 4;
    table3.style.pointerEvents = "none";
    table3.setAttribute("taken", "false");
    table3.setAttribute("pos", "[1000, 440]");
    tables = [table1, table2, table3];
    let ordermenu = document.createElement("div");
    ordermenu.style.color = "gray";
    ordermenu.style.textAlign = "center";
    ordermenu.hidden = true;
    let orderhint = document.createElement("p");
    orderhint.innerHTML = "Press 'Q' to open the menu!";
    orderhint.style.fontFamily = "Baloo";
    orderhint.style.fontSize = "130%"
    orderhint.style.color = "rgb(150, 106, 52)";
    let help = document.createElement("img");
    help.src = "media/help.png";
    help.style.maxHeight = "32px";
    help.style.position = "fixed";
    help.style.bottom = "10px";
    help.style.right = "10px";
    help.style.zIndex = 10;
    let helpbox = document.createElement("p");
    helpbox.innerHTML = "Welcome to the cat cafe! <br> Each customer wants a drink/food and a cat. Your job is to assign each to each customer.<br> Coffee, the brown cat, is an ENERGETIC cat!<br>Leo, the yellow cat, is a PLAYFUL cat!<br>Luna, the black cat, is a CALM cat!<br>Frost, the black cat with white highlights, is a DROWSY cat!<br>And finally, Stripes, the white cat, is an INDEPENDENT cat."
    helpbox.style.fontFamily = "Baloo";
    helpbox.style.fontSize = "120%";
    helpbox.style.color = "rgb(150, 106, 52)";
    helpbox.style.zIndex = 10;
    helpbox.hidden = true;
    help.addEventListener("click", function () {
        if (helpbox.hidden) {
            helpbox.hidden = false;
        } else {
            helpbox.hidden = true;
        }
    })
    let americano = document.createElement("img");
    americano.style.minHeight = "32px";
    americano.src = "media/americano.png";
    americano.id = "Americano";
    americano.addEventListener("click", function(event) {
        event.stopPropagation();
        if (selectedorder != americano) {
            selectedorder = americano;
            americano.style.borderStyle = "solid";
            americano.style.borderColor = "yellow";
            americano.style.borderWidth = "1px";
            backorders.forEach((order) => {
                if (order != selectedorder) {
                    order.style.borderStyle = "none";
                }
            })
        } else {
            americano.style.borderStyle = "none";
            selectedorder = null;
        }
    })
    let cappuccino = document.createElement("img");
    cappuccino.src = "media/capuccino.png";
    cappuccino.style.minHeight = "32px";
    cappuccino.id = "Cappuccino";
    cappuccino.addEventListener("click", function(event) {
        event.stopPropagation();
        if (selectedorder != cappuccino) {
            selectedorder = cappuccino;
            cappuccino.style.borderStyle = "solid";
            cappuccino.style.borderColor = "yellow";
            cappuccino.style.borderWidth = "1px";
            backorders.forEach((order) => {
                if (order != selectedorder) {
                    order.style.borderStyle = "none";
                }
            })
        } else {
            cappuccino.style.borderStyle = "none";
            selectedorder = null;
        }
    })
    let latte = document.createElement("img");
    latte.src = "media/latte.png";
    latte.style.minHeight = "32px";
    latte.id = "Latte";
    latte.addEventListener("click", function(event) {
        event.stopPropagation();
        if (selectedorder != latte) {
            selectedorder = latte;
            latte.style.borderStyle = "solid";
            latte.style.borderColor = "yellow";
            latte.style.borderWidth = "1px";
            backorders.forEach((order) => {
                if (order != selectedorder) {
                    order.style.borderStyle = "none";
                }
            })
        } else {
            latte.style.borderStyle = "none";
            selectedorder = null;
        }
    })
    let croissant = document.createElement("img");
    croissant.src = "media/croissant.png";
    croissant.style.minHeight = "32px";
    croissant.id = "Croissant";
    croissant.addEventListener("click", function (event) {
        event.stopPropagation();
        if (selectedorder != croissant) {
            selectedorder = croissant;
            croissant.style.borderStyle = "solid";
            croissant.style.borderColor = "yellow";
            croissant.style.borderWidth = "1px";
            backorders.forEach((order) => {
                if (order != selectedorder) {
                    order.style.borderStyle = "none";
                }
            })
        } else {
            croissant.style.borderStyle = "none";
            selectedorder = null;
        }
    })
    let macaron = document.createElement("img");
    macaron.src = "media/macaron.png";
    macaron.style.minHeight = "32px";
    macaron.id = "Macaron";
    macaron.addEventListener("click", function (event) {
        event.stopPropagation();
        if (selectedorder != macaron) {
            selectedorder = macaron;
            macaron.style.borderStyle = "solid";
            macaron.style.borderColor = "yellow";
            macaron.style.borderWidth = "1px";
            backorders.forEach((order) => {
                if (order != selectedorder) {
                    order.style.borderStyle = "none";
                }
            })
        } else {
            macaron.style.borderStyle = "none";
            selectedorder = null;
        }
    })
    let donut = document.createElement("img");
    donut.src = "media/donut.png";
    donut.style.minHeight = "32px";
    donut.id = "Donut";
    donut.addEventListener("click", function (event) {
        event.stopPropagation();
        if (selectedorder != donut) {
            selectedorder = donut;
            donut.style.borderStyle = "solid";
            donut.style.borderColor = "yellow";
            donut.style.borderWidth = "1px";
            backorders.forEach((order) => {
                if (order != selectedorder) {
                    order.style.borderStyle = "none";
                }
            })
        } else {
            donut.style.borderStyle = "none";
            selectedorder = null;
        }
    })
    let backorders = [americano, cappuccino, latte, macaron, croissant, donut];
    ordermenu.appendChild(americano);
    ordermenu.appendChild(cappuccino);
    ordermenu.appendChild(latte);
    ordermenu.appendChild(croissant);
    ordermenu.appendChild(macaron);
    ordermenu.appendChild(donut);
    gamediv.appendChild(table1);
    gamediv.appendChild(table2);
    gamediv.appendChild(table3);
    gamediv.appendChild(orderhint);
    gamediv.appendChild(ordermenu);
    gamediv.appendChild(moneycount);
    gamediv.appendChild(moneyicon);
    gamediv.appendChild(help);
    gamediv.appendChild(helpbox);
    newcustomer();
    let customerflow = setInterval(() => {
        newcustomer();
        console.log("added cust");
    }, 15000);
    setInterval(() => {
        for (let c of customers) {
            if (c.happiness <= 0) {
                alert(c.name + " is unhappy. They left a review that destroyed your cafe. Game over. Your final money was " + money + "!");
                window.location.reload();
                break;
            }
        }
    }, 1000);
    document.addEventListener("keypress", (event) => {
        if (event.key === "q") {
            if (ordermenu.hidden) {
                ordermenu.hidden = false;
            } else {
                ordermenu.hidden = true;
            }
        }
    })
})