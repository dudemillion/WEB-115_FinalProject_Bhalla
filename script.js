const start = document.getElementById("start");
const title = document.getElementById("title");
const cap1 = document.getElementById("cap1");
const cap2 = document.getElementById("cap2");
const gamediv = document.getElementById("game");
const animframes = ["", "Lpaw", "", "Rpaw"];
let selected = null;
let selectedcat = document.createElement("p");
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
    constructor(name, personality, position, pelt, spritedir, speed) {
        this.name = name;
        this.personality = personality;
        this.position = position;
        this.pelt = pelt;
        this.spritedir = spritedir;
        this.index = 0;
        this.speed = speed;
    }
    renderCat() {
        let newCat = document.createElement("img");
        newCat.src = "media/" + this.pelt + this.spritedir + ".png";
        newCat.style.minHeight = "64px";
        newCat.style.position = "absolute";
        newCat.style.left = this.position[0] + "px";
        newCat.style.top = this.position[1] + "px";
        this.image = newCat;
        newCat.addEventListener("click", (event) => {
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
        let rect = this.image.getBoundingClientRect();
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
        movement.onfinish = () => {
            clearInterval(anim);
            this.image.src = "media/" + this.pelt + this.spritedir + ".png";
            this.index = 0;
            this.position = [target[0] + "px", target[1] + "px"]
        }
    }
}
class Customer {
    constructor(name, personality, position, order, variation, happiness, spritedir, sprite) {
        this.name = name;
        this.personality = personality;
        this.position = position;
        this.order = order;
        this.variation = variation;
        this.happiness = 5;
        this.spritedir = spritedir;
        this.sprite = "media/person.png";
    }
    renderCustomer() {
        let newCustomer = document.createElement("img");
        newCustomer.src = this.sprite;
        newCustomer.style.maxHeight = "200px";
        newCustomer.style.position = "absolute";
        let infobox = document.createElement("div");
        infobox.innerHTML = "Name: " + this.name + "<br>" + "Order: " + this.order + "<br>" + "Personality: " + this.personality;
        infobox.hidden = true;
        newCustomer.addEventListener("mousemove", (event) => {
            infobox.style.left = event.pageX + 15 + "px";
            infobox.style.top = event.pageX + 15 + "px";
        });
        newCustomer.addEventListener("mouseenter", () => {
            infobox.hidden = false;
        });
        newCustomer.addEventListener("mouseleave", () => {
            infobox.hidden = true;
        });
        gamediv.appendChild(newCustomer);
    }
    matchPersonality(cat) {
        if (cat && cat.personality) {
            if (cat.personality == this.personality) {
                console.log("They match! Happiness increases.");
                this.happiness += 1;
            } else {
                console.log("They don't match. Customer happiness remains.");
            }
        } else {
            console.log("Error! No cat or personality is undefined!")
        }
    }
    matchOrder(given) {
        if (given) {
            if (given == this.order) {
                console.log("Order matches! Customer happiness increases.");
                this.happiness += 1;
            } else {
                console.log("They don't match. Customer happiness remains.");
            }
        } else {
            console.log("Error! Order is undefined!")
        }
    }
}
let cats = [
    new Cat("Luna", "Calm", [Math.floor(Math.random() * 501), Math.floor(Math.random() * 501)], "luna", "forward", 0.2), 
    new Cat("Coffee", "Energetic", [Math.floor(Math.random() * 501), Math.floor(Math.random() * 501)], "brown", "forward", 0.4),
    new Cat("Frost", "Drowsy", [Math.floor(Math.random() * 501), Math.floor(Math.random() * 501)], "frost", "forward", 0.1),
    new Cat("Leo", "Playful", [Math.floor(Math.random() * 501), Math.floor(Math.random() * 501)], "leo", "forward", 0.3),
    new Cat("Stripes", "Independent", [Math.floor(Math.random() * 501), Math.floor(Math.random() * 501)], "stripe", "forward", 0.3)
];
let orders = ["latte", "cappuccino", "americano", "croissant", "bagel", "breakfastsandwich"];
let names = ["John", "Jane", "Delaney", "Nick", "Tristan", "Ethan", "Alex", "Sami", "Henry", "Jordan", "Christina", "Nyx", "Vincent"];
let personalities = ["Calm", "Energetic", "Drowsy", "Playful", "Independent"];
let customers = [];
function newcustomer() {
    let newcust = new Customer(names[Math.floor(Math.random() * names.length)], personalities[Math.floor(Math.random() * personalities.length)], [41, 0], orders[Math.floor(Math.random() * orders.length)], "normal", 5, "forward");
    newcust.renderCustomer();
    customers.append(newcust);
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
        } else {
            selected.image.style.borderStyle = "none";
            selected.moveTo([x, y]);
            selected = null;
            selectedcat.innerHTML = "Selected Cat: ";
        }
    })
    title.style.display = "none";
    cap1.style.display = "none";
    cap2.style.display = "none";
    document.body.style.setProperty("--before-image", "''")
    gamediv.append(selectedcat);
    newcustomer();
    let customerflow = setInterval(() => {
        newcustomer();
    }, 45000);
})
    



