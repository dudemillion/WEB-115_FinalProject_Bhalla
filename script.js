const start = document.getElementById("start");
const title = document.getElementById("title");
const cap1 = document.getElementById("cap1");
const cap2 = document.getElementById("cap2");
const gamediv = document.getElementById("game");
const animframes = ["", "Lpaw", "", "Rpaw"];
let selected = null;
const loaddelay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
class Cat {
    constructor(name, personality, position, pelt, spritedir) {
        this.name = name;
        this.personality = personality;
        this.position = position;
        this.pelt = pelt;
        this.spritedir = spritedir;
        this.index = 0;
    }
    renderCat() {
        let newCat = document.createElement("img");
        newCat.src = "media/" + this.pelt + this.spritedir + ".png";
        newCat.style.minHeight = "64px";
        newCat.style.position = "absolute";
        newCat.style.left = this.position[0] + "px";
        newCat.style.top = this.position[1] + "px";
        this.image = newCat;
        gamediv.appendChild(newCat);
    }
    moveTo(target) {
        let anim = setInterval(() => {
            this.index = (this.index + 1) % animframes.length;
            this.image.src = "media/" + this.pelt + this.spritedir + animframes[this.index] + ".png";
        }, 200);
        let movement = this.image.animate([
            {top: this.position[0] + "px", left: this.position[1] + "px"},
            {top: target[0] + "px", left: target[1] + "px"}
        ], {
            duration: 1000,
            fill: 'forwards'
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
    constructor(name, personality, position, order, variation, happiness, spritedir) {
        this.name = name;
        this.personality = personality;
        this.position = [0, 0];
        this.order = order;
        this.variation = variation;
        this.happiness = 5;
        this.spritedir = spritedir;
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
async function addclickmove() {
    await loaddelay(100);
    window.addEventListener("click", function(event) {
        if (selected) {
            let x = event.clientX - 32;
            let y = event.clientY - 64;
            selected.moveTo([y, x]);
            selected = null;
        }
    })
}
start.addEventListener("click", function () {
    let luna = new Cat("Luna", "Calm", [0, 0], "luna", "forward");
    luna.renderCat();
    luna.image.addEventListener("click", function() {
        if (selected !== luna) {
            selected = luna;
            console.log("Player selected " + luna);
            luna.style.borderStyle = "solid";
            luna.style.borderWidth = "1px";
            luna.style.borderColor = "yellow";
        } else {
            selected = null;
            console.log("Player deselected " + this);
            newCat.style.borderStyle = "none";
        }
    })
    addclickmove();
})
    



