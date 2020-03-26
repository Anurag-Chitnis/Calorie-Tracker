// ----------------------- UI Controller ---------------------------
// UI Controller 
const UICtrl = (function() {
    const UISelectors = {
        itemList: "#item-list",
        addBtn: ".add-btn",
        updateBtn: ".update-btn",
        deleteBtn: ".delete-btn",
        backBtn: ".back-btn",
        itemNameInput: "#item-name",
        itemCaloriesInput: "#item-calories",
        totalCalories: ".total-calories",
        collectionItem: ".collection-item"
    }
    return {
        populateItems: function(items) {
            let output = "";
            items.forEach(item => {
                output += `
                    <li class="collection-item" id="item-${item.id}">
                        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                        <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                        </a>
                    </li>
                `;
            });
            document.querySelector(UISelectors.itemList).innerHTML = output;
        },
        getItemInput: function() {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        getSelectors: function() {
            return UISelectors;
        },
        showItem: function(item) {
            // Create list item to insert in Ul
            const li = document.createElement("li");
            // Add class to list item
            li.classList.add("collection-item");
            //Add id to list item
            li.id = `item-${item.id}`;

            li.innerHTML = `
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
                </a>
            `;
            //Add element to item list 
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },
        clearInputFields: function() {
            document.querySelector(UISelectors.itemNameInput).value = "";
            document.querySelector(UISelectors.itemCaloriesInput).value = "";
        },
        showTotalCalories: function(totalCalories) {
            document.querySelector(UISelectors.totalCalories).innerHTML = totalCalories;
        },
        clearEditState: function() {
            UICtrl.clearInputFields();
            document.querySelector(UISelectors.updateBtn).style.display = "none";
            document.querySelector(UISelectors.deleteBtn).style.display = "none";
            document.querySelector(UISelectors.backBtn).style.display = "none";
            document.querySelector(UISelectors.addBtn).style.display = "inline";
        },
        showEditState: function() {
            document.querySelector(UISelectors.updateBtn).style.display = "inline";
            document.querySelector(UISelectors.deleteBtn).style.display = "inline";
            document.querySelector(UISelectors.backBtn).style.display = "inline";
            document.querySelector(UISelectors.addBtn).style.display = "none";
        },
        setValueFields: function() {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
        },
        updateListItem: function(updatedItem) {
            console.log(updatedItem);
            const collectionItems = document.querySelectorAll(UISelectors.collectionItem);
            collectionItems.forEach(item => {
                const itemID = item.getAttribute('id');
                if (itemID === `item-${updatedItem.id}`) {
                    console.log(item);
                    item.innerHTML = `
                        <strong>${updatedItem.name}: </strong> <em>${updatedItem.calories} Calories</em>
                        <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                        </a>
                    `
                }
            })
        },
        deleteItem: function(itemToDelete) {
            const items = document.querySelectorAll(UISelectors.collectionItem);
            items.forEach(item => {
                if(item.getAttribute("id") == `item-${itemToDelete.id}`) {
                    item.remove();
                }
            })
        }   
    }
})();

// ----------------------- Item Controller ---------------------------
// Item Controller 
const ItemCtrl = (function() {
    // Items Constructor
    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }
    // Data structres 
    const data = {
        items: [
            // {id: 0, name: "Steak dinner", calories: 300},
            // {id: 1, name: "Steamed Rice", calories: 100},
            // {id: 2, name: "Rice Flakes", calories: 200}
        ],
        currentState: null,
        totalCalories: 0
    }
    return {
        logData: function() {
            return data;
        },
        getItems: function() {
            return data.items;
        },
        addItem: function(name, calories) {
            // Create ID
            let ID;
            if(data.items.length > 0) {
                ID = data.items.length;
            }else {
                ID = 0; 
            }
            //parsing calories (string) to calories(number)
            calories = parseInt(calories);
            //create new instance of Item class
            const newItem = new Item(ID, name, calories);
            // Add it to data structure
            data.items.push(newItem);
            return newItem
        },
        getTotalCalories: function() {
            let totalCalories = 0
            data.items.forEach(item => {
                totalCalories += item.calories;
            });
            return totalCalories;
        },
        getItemById: function(ID) {
            let found = null;
            data.items.forEach(item => {
                if(item.id == ID) {
                    found = item;
                }
            })
            return found;
        },
        setCurrentItem: function(currentItem) {
            data.currentState = currentItem;
        },
        getCurrentItem: function() {
            return data.currentState;
        },
        updateItem: function(name, calories) {
            let found = null;
            calories = parseInt(calories);
            //Get ID of current item in edit state
            const ID = data.currentState.id;
            //Update current state
            data.items.forEach(item => {
                if (item.id == ID) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            })
            return found;
        },
        removeItem: function(currentItem) {
            let Index = -1;
            data.items.forEach(item => {
                if (item.id == currentItem.id) {
                    Index = data.items.indexOf(item);
                }
            })
            if (Index > -1) {
                data.items.splice(Index, 1);
            }
        }
    }
})();

// ----------------------- Main Controller ---------------------------
// Main Controller 
const App = (function(UICtrl, ItemCtrl) {
    // Loads all the event listeners 
    const LoadEventListener = function() {
        //Getting UI selectors
        const UISelectors = UICtrl.getSelectors();
        //Add Meal
        document.querySelector(UISelectors.addBtn).addEventListener("click", addItem);
        document.querySelector(UISelectors.itemList).addEventListener("click", itemEditClick);
        document.querySelector(UISelectors.updateBtn).addEventListener("click", itemUpdateSubmit);
        document.querySelector(UISelectors.deleteBtn).addEventListener("click", itemDeleteSubmit)
    }
    const addItem = function(e) {
        e.preventDefault();
        // Fetch input values from form
        const inputs = UICtrl.getItemInput();
        // Validate inputs and ensure value not NULL
        if (inputs.name !== "" && inputs.calories !== "") {
            // Add item
            const newItem = ItemCtrl.addItem(inputs.name, inputs.calories);
            // Show Item
            UICtrl.showItem(newItem);
            //Show Total calories 
            const totalCalories = ItemCtrl.getTotalCalories();
            //Display the total calories in the UI
            UICtrl.showTotalCalories(totalCalories);
            //Clear input fields
            UICtrl.clearInputFields();
        }
    }
    const itemEditClick = function(e) {
        if (e.target.classList.contains("edit-item")) {
            //Set the clicked item to current item (change state)
            const listId = e.target.parentElement.parentElement.id;
            //Split list item id - ex (item-0) into ["item", "0"] 
            const listItemArray = listId.split("-");
            //Fetch the actual Id
            const ID = listItemArray[1];
            // Set current state in ItemCtrl 
            const currentItem = ItemCtrl.getItemById(ID);
            //Set current item
            ItemCtrl.setCurrentItem(currentItem);
            //Set value fields with current item
            UICtrl.setValueFields();
            //Call showEditState
            UICtrl.showEditState();
        }
    }
    const itemUpdateSubmit = function(e) {
        e.preventDefault();
        // Fetch input values from form
        const inputs = UICtrl.getItemInput();
        //Update item
        const updatedItem = ItemCtrl.updateItem(inputs.name, inputs.calories);
        console.log(updatedItem);
        //Update list item in UI
        UICtrl.updateListItem(updatedItem);
        //Show Total calories 
        const totalCalories = ItemCtrl.getTotalCalories();
        //Display the total calories in the UI
        UICtrl.showTotalCalories(totalCalories);
        UICtrl.clearEditState();
    }
    const itemDeleteSubmit = function(e) {
        e.preventDefault();
        const currentItem = ItemCtrl.getCurrentItem();
        // remove item from data structure
        ItemCtrl.removeItem(currentItem);
        //Delete item from UI
        UICtrl.deleteItem(currentItem);
        //Show Total calories 
        const totalCalories = ItemCtrl.getTotalCalories();
        //Display the total calories in the UI
        UICtrl.showTotalCalories(totalCalories);

        UICtrl.clearEditState();

    }

    return {
        init: function() {
            UICtrl.clearEditState();
            //Get items from data structure 
            const items = ItemCtrl.getItems();
            // Populate items in Unordered list
            UICtrl.populateItems(items);

            //LoadEventListeners
            LoadEventListener();
        }
    }
})(UICtrl, ItemCtrl);

App.init();