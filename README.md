# Cat Café Management Game
**WEB-115 Final Project Proposal**
Student: Nikhil Bhalla | Repository: `WEB-115_FinalProject_Bhalla`

---

https://dudemillion.github.io/WEB-115_FinalProject_Bhalla/

## Overview

This is a web-based game that will stage you as a manager and sole-runner of a cat café. Your job is to keep customer ratings and happiness up while balancing service between each of them. The player will be shown a tutorial to start, then be let off into the game. It will progressively get harder with more customers and upgrades (if time permits) will present themselves when affordable and reasonable, such as more tables, more cats, friendlier cats, etc. The goal is to gain as much money as possible.

The target user is anyone who enjoys cats and wants a nice, easy, and calm game to play to reflect that interest.
---

## Features

- Tutorial explaining controls to the player.
- System that gives you randomly generated cats to start with differing personalities.
- Randomly generated customers with differing personalities as well
- Customer happiness meter, adjusting with factors such as matching personalities and correct orders, as well as wait time.
- Simple drink-making minigame for each possible order.
- Money counter that increments scaled based off customer happiness and game progression.
- If customer happiness hits zero, the game ends with a final money count.

---

## Core Requirements Coverage

| Requirement | Implementation |
|---|---|
| **If Statements & Loops** | There will be various loops and conditional statements used. For example, a conditional checking if the order provided to the given customer matched what they had ordered. An example of a loop is the temporal loop of spawning customers to keep business running along, not leaving much ample time to rest within a work day. |
| **Event Listeners** | Click listeners all over the place with HTML Canvas. To create a functional UI, I would need to add click listeners and respective functions that perform specific tasks respective to the button that was pressed. |
| **DOM Element Creation** | Most of the UI created on the page will be created and added dynamically through Javascript. Simple elements I can reference and use will be inital in the HTML code, otherwise it will be the former. |
| **Classes & Subclasses** | There will be 2 primary classes. The first, the `Cat` class, which will store personality values, position, as well as possible pelt variations to keep cats unique if time permits. It would have methods such as `MoveTo()`, where the cat would move to the selected customer, and `GetPersonality()`, where it would return it's personality value for checking. The second, `Customer`, will also store personality values for later checking with matching personalities, as well as storing their order, position, and appearance variations, again, if time permits. It will have methods such as `GetOrder()`, where it returns the customer's given order value, `GetPersonality()`, again, for personality matching, returning the customer's given personality, `GetHappiness()`, returning the happiness value, etc. A possible subclass, extending `Customer`, would be `VIP`, where this customer's function is slightly different, having happiness drain faster and paying more for their order. |

---

## DLC - Additional Topics

### HTML Canvas
This project will primarily include the HTML `<canvas>` element for most of it's complex visuals. The cats, the customers, the overall background, etc. It will move the cats and customers respective to their current goal.

---

## Tech Stack
- HTML, CSS, Vanilla Javascript
- HTML Canvas for most rendering
- VS Code + Github