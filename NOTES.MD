# Culled from The Complete JavaScript Course 2020: Build Real Projects!
- An UDEMY class created by Jonas Schmedtmann

## Putting It All Together: The Budget App Project
1. BUDGET => domain.
2. APPLICATION = > controller.
3. UI => ux.

- Module pattern:
1. Public and private data.
2. Encapsulation. Hiding the implementation details from the outside scope.
3. Seperation of concerns.

- Closures and IIFEs:
1. IIFE creates privacy due to its new scope.
2. The returned function will always have access to its innards, because a closure has been created.

- Event Listeners:
1. Key Press event. Note: The '.' is the class selector.

- Init function:
1. How and why to create an initialization function.

- Function constructors:
1. How to choose function constructors.
2. How to set up a proper data structure.
- How to store our income and expense data within our domain.
    a. Function constructors are used to instantiate lots of objects. Thus, we create a custom data type.

1. Avaid conflicts in data structures.
2. How/why to pass data from one module to another.

- Convert a list to an array:
1. document.querySelectorAll returns a node list, not an array. Thus, no 'array' methods available. 
- e.g.: Use this trick: .slice() returns a copy of an array. e.g.: var array = Array.prototype.slice.call(fields);
2. Anonymous callback function: function(current, index, array) { } has access to:
    a. Current value
    b. Index Number
    c. Entire array

- Convert field input to number.
1. Currently our value is a string. e.g.: use parseFloat() to convert to a Number.
- Prevent false input(s). e.g.: !isNaN(input.value)

- How and why to create simple, reuseable functions with one purpose.
- How to sum all elements of an array using the forEach() method.
1. With only expenses, we achieve 'infinity' with our percentage calculation. e.g.: divide anything by 0.

- Event Delegation:
1. Event Bubbling: When an event is trigged on some DOM element, the exact same event is also triggered on the parent elements. 
    a. One at a time. The event bubbles up in the DOM tree. The target element is the event 'creator.' The parent elements will know the target element.
2.  If the event bubbles up in the DOM tree, and if we know where the event was fired, we can simply attach an event handler to the a parent element and wait for the event to bubble up, and then do what we'd like with the target element. This is event delegation.
3. e.g.: Do not set up the handler on the original element, but attach an event handler to a parent element and 'catch' the event there. Use target to react.
    a. We may have an element with lots of child elements that we are ointerested in.
    b. We want an event handler attached to an element that is not yet in the DOM when our page is loaded.

- Event bubbling, target element, and unique Ids. And the parent node property for DOM traversing.
1. e.g.: <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
2. Discern an overarching element that is common to all associated events.
3. We are interested in the parent element. e.g.: <div class="item clearfix" id="income-%ID%"> We are going to focus on the 'id' obtained from the event.
    a. We will traverse the DOM in order to obtain this value. We will want the parent node. e.g.: event.target.parentNode;
    b. In our HTML example, we will need to move up four (4) elements to obtain our payload. e.g.: event.target.parentNode.parentNode.parentNode.parentNode.id;
4. Our payload will contain both the type and the array id. e.g.: inc-0 or exp-40.

- Map:
1. This will not work provided that the ids are not in order: e.g.: collection.items[type][id];
    a. forEach iterates. Map returns a brand new array.

- Removing an Element from the DOM:
1. We cannot delete elements. We can only delete a child. So we traverse upward.
```javascript
    var element = document.getElementById(id);
    var parent = element.parentNode;
    parent.removeChild(element);
```

- String methods for manipulation:
1. Number alignment with + or - indicators. Plus, we'll be using commas.

- Date object consrtuctor
1. Christmas. Month is 0-based: new Date(2020, 11, 25);

- Finishing touches. Polishing our 'user interface.'
1. Change Events. With an expense added, outline controls with a red border. Add event listener to the +/- selection.
    a. current.classList.toggle('red-focus'); 'toggle' adds/removes dynamically.