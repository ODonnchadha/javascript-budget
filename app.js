/* 
    Budget
    1. Data model for expense and income. Aggregate into one data structure.
    2. Private functions. e.g.: calculateTotal();
*/
var domain = (function() {
    var PERCENT_CANNOT_BE_CALCULATED = -1;

    // Data Structure
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = PERCENT_CANNOT_BE_CALCULATED;
    };
    Expense.prototype.calculatePercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = PERCENT_CANNOT_BE_CALCULATED;          
        }
    };
    Expense.prototype.getPercentage = function() {
        return this.percentage;
    }
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var collection = {
        items: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: PERCENT_CANNOT_BE_CALCULATED
    }

    var calculateTotal = function(type) {
        var sum = 0;
        collection.items[type].forEach(function(current) {
            sum += current.value;
        });
        collection.totals[type] = sum;
    };

    return {
        addItem: function(type, decription, value) {
            var item, id;

            if (collection.items[type].length > 0) {
                id = collection.items[type][collection.items[type].length -1].id + 1;
            } else {
                id = 0;
            }
            if (type === 'exp') {
                item = new Expense(id, decription, value);
            };
            if (type === 'inc') {
                item = new Income(id, decription, value);
            };

            collection.items[type].push(item);
            return item;
        },
        calculateBudget: function() {
            // 1. Calculate total income and expenses.
            calculateTotal('exp');
            calculateTotal('inc');
            // 2. Calculate the budget: income - expenses.
            collection.budget = collection.totals.inc - collection.totals.exp;
            // 3. Calculate the percentage of income that was spent.
            if (collection.totals.inc > 0) {
                collection.percentage = Math.round((collection.totals.exp / collection.totals.inc) * 100);
            } else {
                collection.percentage = PERCENT_CANNOT_BE_CALCULATED;
            }
        },
        calculatePercentage: function() {
            collection.items.exp.forEach(function(expense) {
                expense.calculatePercentage(collection.totals.inc);
            });
        },
        deleteItem: function(type, id) {
            // Create an array of the ids contained within the items collection.
            var ids = collection.items[type].map(function(current) {
                return current.id;
            });
            // Discover the associated index.
            var index = ids.indexOf(id);

            if (index !== -1) {
                collection.items[type].splice(index, 1);
            }
        },
        getBudget: function() {
            return {
                budget: collection.budget,
                income: collection.totals.inc,
                expenses: collection.totals.exp,
                percentage: collection.percentage
            };
        },
        getPercentage: function() {
            var percentage = collection.items.exp.map(function(expense) {
                return expense.getPercentage();
            });
            return percentage;
        }
    }
})();

var utilities = (function() {
    return {
        nodeListForEach: function(list, callback) {
            for (var i = 0; i < list.length; i++) {
                callback(list[i], i);
            }
        }
    }
})();

/* 
    UI
    1. Defined ui constants.
    2. Public methods.
*/
var ux = (function() {
    var CONSTANTS = {
        BUDGET_LABEL: '.budget__value',
        BUDGET_EXPENSES_PERCENTAGE_LABEL: '.budget__expenses--percentage',
        BUDGET_TOTAL_EXPENSES_LABEL: '.budget__expenses--value',
        BUDGET_TOTAL_INCOME_LABEL: '.budget__income--value',
        CONTAINER: '.container',
        DATE_LABEL: '.budget__title--datetime',
        EXPENSE_CONTAINER: '.expenses__list',
        EXPENSE_PERCENTAGE_LABEL: '.item__percentage',
        INCOME_CONTAINER: '.income__list',
        INPUT_BUTTON: '.add__btn',
        INPUT_DESCRIPTION: '.add__description',
        INPUT_TYPE: '.add__type',
        INPUT_VALUE: '.add__value',
    };

    // e.g.: 2310.4778 becomes "+ 2,310.48"
    var formatNumber = function(number, type) {
        var split, int, decimal, symbol;

        number = Math.abs(number);
        // Note: This method provides us a string.
        number = number.toFixed(2);

        split = number.split('.')
        int = split[0];
        decimal = split[1];

        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }
        symbol = type === 'exp' ? '- ' : '+ ';
        return  symbol + int + '.' + decimal;
    };

    return {
        addListItem: function(type, item) {
            var html, element;
            if (type === 'inc') {
                element = CONSTANTS.INCOME_CONTAINER;
                html =  `<div class="item clearfix" id="inc-%ID%">
                            <div class="item__description">%DESCRIPTION%</div>
                            <div class="right clearfix">
                                <div class="item__value">%VALUE%</div>
                                <div class="item__delete">
                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                                </div>
                            </div>
                        </div>`.replace('%ID%', item.id).replace('%DESCRIPTION%', item.description).replace('%VALUE%', formatNumber(item.value, type));
            }
            if (type === 'exp') {
                element = CONSTANTS.EXPENSE_CONTAINER;
                html =  `<div class="item clearfix" id="exp-%ID%">
                            <div class="item__description">%DESCRIPTION%</div>
                            <div class="right clearfix">
                                <div class="item__value">%VALUE%</div>
                                <div class="item__percentage">%TODO%</div>
                                <div class="item__delete">
                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                                </div>
                            </div>
                        </div>`.replace('%ID%', item.id).replace('%DESCRIPTION%', item.description).replace('%VALUE%', formatNumber(item.value, type));
            }
            
            // insert the html into the DOM.
            document.querySelector(element).insertAdjacentHTML('beforeend', html);
        },
        changeType: function() {
            var fields = document.querySelectorAll(
                CONSTANTS.INPUT_TYPE + ',' + CONSTANTS.INPUT_DESCRIPTION + ',' + CONSTANTS.INPUT_VALUE
            );
            utilities.nodeListForEach(fields, function(current) {
                current.classList.toggle('red-focus');
            });
            document.querySelector(CONSTANTS.INPUT_BUTTON).classList.toggle('red');
        },
        clearFields: function() {
            var array = Array.prototype.slice.call(
                document.querySelectorAll(
                    CONSTANTS.INPUT_DESCRIPTION + ', ' + CONSTANTS.INPUT_VALUE));
            array.forEach(function(current, index, array) {
                current.value = '';
            });
            array[0].focus();
        },
        deleteListItem: function(id) {
            var element = document.getElementById(id);
            var parent = element.parentNode;
            parent.removeChild(element);
        },
        displayBudget: function(b) {
            var content = b.budget === 0 ? '' : b.budget > 0 ? formatNumber(b.budget, 'inc') : formatNumber(b.budget, 'exp');

            document.querySelector(CONSTANTS.BUDGET_LABEL).textContent = content;
            document.querySelector(CONSTANTS.BUDGET_TOTAL_EXPENSES_LABEL).textContent = formatNumber(b.expenses, 'exp');;
            document.querySelector(CONSTANTS.BUDGET_TOTAL_INCOME_LABEL).textContent = formatNumber(b.income, 'inc');
            document.querySelector(CONSTANTS.BUDGET_EXPENSES_PERCENTAGE_LABEL).textContent = b.percentage > 0 ? b.percentage + '%' : '';
        },
        displayDateTime: function() {
            var year, month;
            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            var now = new Date();

            year = now.getFullYear();
            month = months[now.getMonth()];
            document.querySelector(CONSTANTS.DATE_LABEL).textContent = month + ' ' + year;
        },
        // Each expense added receives a different percentage via the overall total income.
        displayPercentages: function(percentages) {
            var html = document.querySelectorAll(CONSTANTS.EXPENSE_PERCENTAGE_LABEL);
            // Remember that a DOM tree returns a node list. Hack: A node list does not containt the forEach() method.
            utilities.nodeListForEach(html, function(current, index) {
                current.textContent = percentages[index] > 0 ? percentages[index] + '%' : '';
            });
        },
        getConstants: function() {
            return CONSTANTS;
        },
        getInput: function() {
            return {
                type: document.querySelector(CONSTANTS.INPUT_TYPE).value,
                description: document.querySelector(CONSTANTS.INPUT_DESCRIPTION).value,
                value: parseFloat(document.querySelector(CONSTANTS.INPUT_VALUE).value)
            }
        }
    }
})(utilities);

/* 
    Application
    1. Events will be delegated.
    2. Methods will be consulted.
    3. Application will be initialized.
*/
var controller = (function(domain, ux) {
    var addEventListeners = function() {
        document.addEventListener('keypress', function(e) {
            if (e.keyCode === 13 || e.which === 13) {
                addItem();
            }
        });
        document.querySelector(ux.getConstants().INPUT_BUTTON).addEventListener('click', function() {
            addItem();
        });
        document.querySelector(ux.getConstants().CONTAINER).addEventListener('click', function(e) {
            deleteItem(e);
        });
        document.querySelector(ux.getConstants().INPUT_TYPE).addEventListener('change', function() {
            ux.changeType();
        });
    }

    // Methods
    var addItem = function() {
        // 1. Obtain the field input data.
        var input = ux.getInput();

        // 1a. Validation.
        if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
            // 2. Add item to the domain collection.
            var item = domain.addItem(input.type, input.description, input.value);
            // 3. Add the item to the ui.
            ux.addListItem(input.type, item);
            ux.clearFields();
            // 4. Calculate and update budget.
            updateBudget();
            // 5. Calculate and update the percentages.
            updatePercentages();
        }
    };

    var deleteItem = function(event) {
        var split, type, itemId;
        // Justification: The HTML that this event is wired up to is hard-coded elsewhere in this JavaScript.
        var id = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if (id) {
            split = id.split('-');
            type = split[0];
            itemId = parseInt(split[1]);
            // 1. Delete item from the data structure.
            domain.deleteItem(type, itemId);
            // 2. Delete the item from the UI.
            ux.deleteListItem(id);
            // 3. Update and display the new budget.
            updateBudget();
            // 4. Calculate and update the percentages.
            updatePercentages();
        }
    };

    var updateBudget = function() {
        // 1. calculate the budget.
        domain.calculateBudget();
        // 2. display the budget on the ui.
        var budget = domain.getBudget();
        ux.displayBudget(budget);
    };

    var updatePercentages = function() {
        // 1. Calculate percentages
        domain.calculatePercentage();
        // 2. Read percentages from domain.
        var percentages = domain.getPercentage();
        // 3. Update the UI with the new percentages.
        ux.displayPercentages(percentages);
    }

    return {
        init: function() {
            ux.displayBudget({
                budget: 0,
                income: 0,
                expenses: 0,
                percentage: -1
            });
            ux.displayDateTime();
            addEventListeners();
        }
    }

})(domain, ux);

controller.init();