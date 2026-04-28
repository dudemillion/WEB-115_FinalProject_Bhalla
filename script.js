const start = document.getElementById("start");
const title = document.getElementById("title");
const cap1 = document.getElementById("cap1");
const cap2 = document.getElementById("cap2");
const gamediv = document.getElementById("game");
class Cat {
    constructor(name, personality, position, pelt, spritedir) {
        this.name = name;
        this.personality = personality;
        this.position = [0, 0];
        this.pelt = pelt;
        this.spritedir = "forward";
    }
    renderCat() {
        let newCat = document.createElement("img");
        newCat.src = "media/" + this.pelt + this.spritedir + ".png";
        newCat.style.minHeight = "64px";
        gamediv.appendChild(newCat);
    }
    moveTo(target) {
        // Currently going to teleport, will add a movement animation if time
        if (target && target.position) {
            this.position = target.position;
        } else {
            console.log("Target does not exist or position is undefined!");
        }
    }
}
class Customer {
    constructor(name, personality, position, order, variation, happiness, sprite) {
        this.name = name;
        this.personality = personality;
        this.position = [0, 0];
        this.order = order;
        this.variation = variation;
        this.happiness = 5;
        this.sprite = [1, 1];
    }
    renderCustomer() {
        let newCustomer = document.createElement("img");
        newCustomer.src = this.sprite;
        document.body.appendChild(newCustomer);
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
let luna = new Cat("Luna", "Calm", [0, 0], "luna", "back");
luna.renderCat();