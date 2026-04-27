const start = document.getElementById("start");
const title = document.getElementById("title");
const cap1 = document.getElementById("cap1");
const cap2 = document.getElementById("cap2");
class Cat {
    constructor(name, personality, position, pelt, sprite) {
        this.name = name;
        this.personality = personality;
        this.position = position;
        this.pelt = pelt;
        this.sprite = sprite;
    }
    renderCat() {
        let newCat = document.createElement("img");
        newCat.src = this.sprite;
        document.body.appendChild(newCat);
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
    constructor(name, personality, position, order, variation, happiness=0, sprite) {
        this.name = name;
        this.personality = personality;
        this.position = position;
        this.order = order;
        this.variation = variation;
        this.happiness = happiness;
        this.sprite = sprite;
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