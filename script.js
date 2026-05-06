const start = document.getElementById("start");
const title = document.getElementById("title");
const cap1 = document.getElementById("cap1");
const cap2 = document.getElementById("cap2");
const gamediv = document.getElementById("game");
const animframes = ["", "Lpaw", "", "Rpaw"];
let selected = null;
let selectedcat = document.createElement("p");
let money = 0;
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
    constructor(name, personality, position, order, variation, happiness, spritedir, sprite, busy, givenorder, playedcat) {
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
        infobox.style.zIndex = 3;
        gamediv.appendChild(infobox);
        newCustomer.addEventListener("mousemove", (event) => {
            infobox.style.left = event.pageX + 15 + "px";
            infobox.style.top = event.pageY + 15 + "px";
        });
        newCustomer.addEventListener("mouseenter", () => {
            if (selected) {
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
                        updateMoney();
                    }, 10000);
                } else {
                    console.log("Customer already played with cat!");
                }
            } else {
                console.log("No selected cat.")
            }
        });
        let happinessdown = setInterval(() => {
            this.happiness -= 1;
            this.updateInfo();
        }, 15000);
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
                console.log("They match! Happiness increases.");
                this.happiness += 3;
                money += 3;
                return true;
            } else {
                console.log("They don't match. Customer happiness down.");
                this.happiness -= 2;;
                return false;
            }
        } else {
            console.log("Error! No cat or personality is undefined!")
        }
    }
    matchOrder(given) {
        if (given) {
            if (given == this.order) {
                console.log("Order matches! Customer happiness increases.");
                this.happiness += 2;
                money += 5;
                updateMoney();
            } else {
                console.log("They don't match. Customer happiness down.");
                this.happiness -= 2;
            }
        } else {
            console.log("Error! Order is undefined!")
        }
    }
    leave() {
        this.image.remove();
        this.infobox.remove();
        customers = customers.filter(c => c !== this);
    }
}
let cats = [
    new Cat("Luna", "Calm", [Math.floor(Math.random() * 501), Math.floor(Math.random() * 501)], "luna", "forward", 0.2), 
    new Cat("Coffee", "Energetic", [Math.floor(Math.random() * 501), Math.floor(Math.random() * 501)], "brown", "forward", 0.4),
    new Cat("Frost", "Drowsy", [Math.floor(Math.random() * 501), Math.floor(Math.random() * 501)], "frost", "forward", 0.1),
    new Cat("Leo", "Playful", [Math.floor(Math.random() * 501), Math.floor(Math.random() * 501)], "leo", "forward", 0.3),
    new Cat("Stripes", "Independent", [Math.floor(Math.random() * 501), Math.floor(Math.random() * 501)], "stripe", "forward", 0.3)
];
let orders = ["Latte", "Cappuccino", "Americano", "Croissant", "Bagel", "Breakfast Sandwich"];
let names = ["John", "Jane", "Delaney", "Nick", "Tristan", "Ethan", "Alex", "Sami", "Henry", "Jordan", "Christina", "Nyx", "Vincent"];
let personalities = ["Calm", "Energetic", "Drowsy", "Playful", "Independent"];
let customers = [];
function newcustomer() {
    let x = (Math.random() * 20 - 10) * 2;
    let y = customers.length * 140;
    let newcust = new Customer(names[Math.floor(Math.random() * names.length)], personalities[Math.floor(Math.random() * personalities.length)], [(1300 + x), (500 - y)], orders[Math.floor(Math.random() * orders.length)], "normal", 5, "forward");
    newcust.renderCustomer();
    customers.push(newcust);
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
    gamediv.appendChild(moneycount);
    gamediv.appendChild(moneyicon);
    newcustomer();
    let customerflow = setInterval(() => {
        newcustomer();
    }, 450000);
    async function happinesscheck() {
        while (true) {
            for (const c of customers) {
                if (c.happiness == 0) {
                    console.log("GAME OVER!");
                    break;
                } else {
                    console.log("everyones happy");
                    continue;
                }
            }
            await new Promise(resolve => setTimeout(resolve, 999999999999));
        }
    }
    happinesscheck();
})
    



