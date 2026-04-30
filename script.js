const start = document.getElementById("start");
const title = document.getElementById("title");
const cap1 = document.getElementById("cap1");
const cap2 = document.getElementById("cap2");
const gamediv = document.getElementById("game");
const animframes = ["", "Lpaw", "", "Rpaw"];
let selected = null;
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
        newCat.addEventListener("click", function(event) {
            event.stopPropagation();
            if (selected !== this) {
                selected = this;
                console.log("Player selected " + this);
                newCat.style.borderStyle = "solid";
                newCat.style.borderWidth = "1px";
                newCat.style.borderColor = "yellow";
            } else {
                selected = null;
                console.log("Player deselected " + this);
                newCat.style.borderStyle = "none";
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
            {top: startX + "px", left: startY + "px"},
            {top: target[0] + "px", left: target[1] + "px"}
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
    constructor(name, personality, position, order, variation, happiness, spritedir) {
        this.name = name;
        this.personality = personality;
        this.position = position;
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
let cats = [
    new Cat("Luna", "Calm", [Math.floor(Math.random() * 501), Math.floor(Math.random() * 501)], "luna", "forward", 0.2), 
    new Cat("Coffee", "Energetic", [Math.floor(Math.random() * 501), Math.floor(Math.random() * 501)], "brown", "forward", 0.4),
    new Cat("Frost", "Drowsy", [Math.floor(Math.random() * 501), Math.floor(Math.random() * 501)], "frost", "forward", 0.1),
    new Cat("Leo", "Playful", [Math.floor(Math.random() * 501), Math.floor(Math.random() * 501)], "leo", "forward", 0.3),
    new Cat("Stripes", "Independent", [Math.floor(Math.random() * 501), Math.floor(Math.random() * 501)], "stripe", "forward", 0.3)
];
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
            if (/luna.*/.test(selected.src)) {
                cats[0].moveTo([y, x]);
            } else if (/brown.*/.test(selected.src)) {
                cats[1].moveTo([y, x]);
            } else if (/frost.*/.test(selected.src)) {
                cats[2].moveTo([y, x]);
            } else if (/leo.*/.test(selected.src)) {
                cats[3].moveTo([y, x]);
            } else if (/stripe.*/.test(selected.src)) {
                cats[4].moveTo([y, x])
            } else {
                console.log("Unknown cat?")
            }
            selected = null;
        }
    })
    title.style.display = "none";
    cap1.style.display = "none";
    cap2.style.display = "none";
    document.body.style.setProperty("--before-image", "''")
})
    



