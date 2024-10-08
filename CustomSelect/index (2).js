
    const CustomSelect = {
    init: function(elements = null){
    const styleElement = document.createElement("style");
    styleElement.textContent  = `

         :root {
           --color-black: #1a1a1a;
           --color-darks: #333;
           --color-greys: #ccc;
           --color-light: #f5f5f5;
           --color-white: #fff;
           --color-blues: #3c83f6;
           --shadow-small: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
           --shadow-medium: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
           --shadow-large: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
       a, button {
         cursor: pointer;
         border: none;
         outline: none;
         background: none;
         box-shadow: none;
         color: inherit;
         text-decoration: none;
      }
       img, video {
         display: block;
         max-width: 100%;
         height: auto;
         object-fit: cover;
      }
       .section {
         margin: 0 auto;
         padding: 5rem 0 2rem;
      }
       .container {
         max-width: 75rem;
         height: auto;
         margin: 0 auto;
         padding: 0 1.25rem;
      }
       .centered {
         margin-bottom: 1rem;
         text-align: center;
         vertical-align: middle;
      }
       .form-group {
         position: relative;
      }
       .form-arrow {
         position: absolute;
         top: 0.65rem;
         right: 0.5rem;
         z-index: 10;
         font-size: 1.35rem;
         line-height: inherit;
         color: var(--color-darks);
      }
       .custom-select-parent{
         position: relative;
      }
       .custom-select-parent .custom-dropdown-select {
         position: relative;
         font-family: inherit;
         font-size: 1rem;
         font-weight: 400;
         line-height: 1.5;
         cursor: pointer;
         user-select: none;
         width: 100%;
         height: auto;
         padding: 0.75rem 1.25rem;
         border: none;
         outline: none;
         border-radius: 0.25rem;
         color: var(--color-black);
         background-clip: padding-box;
         background-color: var(--color-white);
         box-shadow: var(--shadow-medium);
         transition: all 0.3s ease-in-out;
      }
       .custom-select-parent .custom-dropdown-menu {
         /*position: absolute; */
         position: relative;
         display: none;
         top: 100%;
         left: 0;
         width: 100%;
         margin-bottom: 20px;
         z-index: 10;
         border-radius: 0.25rem;
         background-color: var(--color-white);
         box-shadow: var(--shadow-large);
         transition: all 0.3s ease-in-out;
      }
       .custom-select-parent .custom-dropdown-menu-inner {
         max-height: 16rem;
         overflow-y: scroll;
         overflow-x: hidden;
      }
       .custom-select-parent .custom-dropdown-menu-inner::-webkit-scrollbar {
         width: 5px;
         height: auto;
      }
       .custom-select-parent .custom-dropdown-menu-inner::-webkit-scrollbar-thumb {
         border-radius: 0.25rem;
         background-color: var(--color-greys);
         box-shadow: var(--shadow-small);
      }
       .custom-select-parent .custom-dropdown-menu-item {
         font-family: inherit;
         font-size: 1rem;
         font-weight: normal;
         line-height: inherit;
         cursor: pointer;
         user-select: none;
         padding: 0.65rem 1.25rem;
         background-color: var(--color-white);
         transition: all 0.2s ease-in-out;
      }
       .custom-select-parent .custom-dropdown-menu-item:hover {
         color: var(--color-black);
         background-color: var(--color-greys);
      }
       .custom-select-parent .custom-dropdown-menu-item.is-select, .custom-select-parent .custom-dropdown-menu-item.is-select:hover {
         color: var(--color-white);
         background-color: var(--color-blues);
      }
       .custom-select-parent .custom-dropdown-menu-search {
         display: block;
         font-family: inherit;
         font-size: 1rem;
         font-weight: 400;
         line-height: 1.5;
         width: 100%;
         height: auto;
         padding: 0.65rem 1.25rem;
         border: none;
         outline: none;
         color: var(--color-black);
         background-clip: padding-box;
         background-color: var(--color-light);
      }
       .wrapper-column {
         max-width: 40rem;
         height: auto;
         margin: 0 auto;
         padding: 5rem 3rem;
         border-radius: 0.25rem;
         background-color: var(--color-white);
         box-shadow: var(--shadow-medium);
      }

      .custom-select-parent .disabled, .custom-select-parent-disabled{
        pointer-events: none !important;
        background-color: #EBEBE4 !important;
        color: #C6C6C6 !important;
      }
       `;

    document.head.appendChild(styleElement);

    // const form = document.querySelector(".form");
    let dropdowns = document.querySelectorAll(".custom-select");
    if (elements !== null) {
    if (elements instanceof HTMLElement) {
      dropdowns = [elements];
    }else if(elements instanceof NodeList || Array.isArray(elements) ){
      // convert to array to iterate to extract html elements only
      let new_elements = Array.from(elements);
      new_elements = new_elements.filter(_el => _el instanceof HTMLElement);
      dropdowns = new_elements;
    }else{
      dropdowns = document.querySelectorAll(elements);
    }
    }


    // Check if Dropdowns are Exist
    // Loop Dropdowns and Create Custom Dropdown for each Select Element
    if (dropdowns.length > 0) {
     dropdowns.forEach((dropdown) => {
       // console.dir(dropdown);
       if (dropdown.tagName == "SELECT") {
         CustomSelect.createCustomDropdown(dropdown);
         dropdown.CustomSelect = CustomSelect.single(dropdown);
       }
     });
    }


    },
    triggerEvent: function(element, eventName){
      var event; // The custom event that will be created
      if(document.createEvent){
        event = document.createEvent("HTMLEvents");
        event.initEvent(eventName, true, true);
        event.eventName = eventName;
        element.dispatchEvent(event);
      } else {
        event = document.createEventObject();
        event.eventName = "dataavailable";
        event.eventType = "dataavailable";
        element.fireEvent("on" + event.eventType, event);
      }
    },
    triggerChange: function(element){
      const EventsArray = ['change'];
      EventsArray.map(_evt=>{
      CustomSelect.triggerEvent(element, _evt);
      });

    },

    createCustomDropdown: function(element){
    const dropdown = element;
    // Create Custom Dropdown
    // function createCustomDropdown(dropdown) {
     // Get All Select Options
     // And Convert them from NodeList to Array
     const options = dropdown.querySelectorAll("option");
     const optionsArr = Array.prototype.slice.call(options);

     let customDropdown;
     // Create Custom Dropdown Element and Add Class Dropdown or find previous element
     // if (dropdown.nextElementSibling) {
     //   console.dir(dropdown.nextElementSibling)
     //   console.dir(dropdown.nextElementSibling.classList.contains("custom-select-parent"))
     // }
     if (!dropdown.nextElementSibling) {
       customDropdown = document.createElement("div");
     }else if(dropdown.nextElementSibling.classList.contains("custom-select-parent")){
       customDropdown = dropdown.nextElementSibling;
       // exmpty the innerHTML of the custom div
       customDropdown.innerHTML = '';
     }else{
       customDropdown = document.createElement("div");
     }



     customDropdown.classList.add("custom-select-parent");
     dropdown.insertAdjacentElement("afterend", customDropdown);

     // Create Element for Selected Option
     const selected = document.createElement("div");
     selected.classList.add("custom-dropdown-select");


      if (dropdown.disabled == true) {
        selected.classList.add("custom-select-parent-disabled");
      }else{
        selected.classList.remove("disabled");
      }

     // retain the classes that came with the element
     dropdown.classList.forEach(function(className) {
         // Add each class to the target element
         selected.classList.add(className);
     });

     selected.textContent = optionsArr[0].textContent;
     customDropdown.appendChild(selected);

     // Create Element for Dropdown Menu
     // Add Class and Append it to Custom Dropdown
     const menu = document.createElement("div");
     menu.classList.add("custom-dropdown-menu");
     customDropdown.appendChild(menu);
     selected.addEventListener("click", toggleDropdown.bind(menu));

     // Create Search Input Element
     const search = document.createElement("input");
     search.placeholder = "Search...";
     search.type = "text";
     search.classList.add("custom-dropdown-menu-search");
     menu.appendChild(search);

     // Create Wrapper Element for Menu Items
     // Add Class and Append to Menu Element
     const menuInnerWrapper = document.createElement("div");
     menuInnerWrapper.classList.add("custom-dropdown-menu-inner");
     menu.appendChild(menuInnerWrapper);

     // Loop All Options and Create Custom Option for Each Option
     // And Append it to Inner Wrapper Element
     optionsArr.forEach((option) => {
       // console.log(option);
        const item = document.createElement("div");
        item.classList.add("custom-dropdown-menu-item");
        item.dataset.value = option.value;
        item.textContent = option.textContent;

        if (option.disabled === true) {
          item.classList.add("disabled");
        }

        menuInnerWrapper.appendChild(item);


        item.addEventListener(
           "click",
           setSelected.bind(item, selected, dropdown, menu)
        );
     });

     // Add Selected Class to First Custom Select Option
     menuInnerWrapper.querySelector("div").classList.add("selected");

     // Add Input Event to Search Input Element to Filter Items
     // Add Click Event to Element to Close Custom Dropdown if Clicked Outside
     // Hide the Original Dropdown(Select)
     search.addEventListener("input", filterItems.bind(search, optionsArr, menu));
     document.addEventListener(
        "click",
        closeIfClickedOutside.bind(customDropdown, menu)
     );
     dropdown.style.display = "none";
    // }

    // Toggle for Display and Hide Dropdown
    function toggleDropdown() {
    // console.log(this);
     if (this.offsetParent !== null) {
        this.style.display = "none";
     } else {
        this.style.display = "block";
        this.querySelector("input").focus();
     }
    }

    // Set Selected Option
    function setSelected(selected, dropdown, menu) {
     // triggerChangeEvent
     // Get Value and Label from Clicked Custom Option
     const value = this.dataset.value;
     const label = this.textContent;

     // Change the Text on Selected Element
     // Change the Value on Select Field
     selected.textContent = label;
     dropdown.value = value;

     // Close the Menu
     // Reset Search Input Value
     // Remove Selected Class from Previously Selected Option
     // And Show All Div if they Were Filtered
     // Add Selected Class to Clicked Option
     menu.style.display = "none";
     menu.querySelector("input").value = "";
     menu.querySelectorAll("div").forEach((div) => {
        if (div.classList.contains("is-select")) {
           div.classList.remove("is-select");
        }
        if (div.offsetParent === null) {
           div.style.display = "block";
        }
     });
     this.classList.add("is-select");

     CustomSelect.triggerChange(dropdown);

    }

    // Filter the Items
    function filterItems(itemsArr, menu) {
     // Get All Custom Select Options
     // Get Value of Search Input
     // Get Filtered Items
     // Get the Indexes of Filtered Items
     const customOptions = menu.querySelectorAll(".custom-dropdown-menu-inner div");
     const value = this.value.toLowerCase();
     const filteredItems = itemsArr.filter((item) =>
        item.innerText.toLowerCase().includes(value)
     );
     const indexesArr = filteredItems.map((item) => itemsArr.indexOf(item));

     // Check if Option is not Inside Indexes Array
     // And Hide it and if it is Inside Indexes Array and it is Hidden Show it
     itemsArr.forEach((option) => {
        if (!indexesArr.includes(itemsArr.indexOf(option))) {
           customOptions[itemsArr.indexOf(option)].style.display = "none";
        } else {
           if (customOptions[itemsArr.indexOf(option)].offsetParent === null) {
              customOptions[itemsArr.indexOf(option)].style.display = "block";
           }
        }
     });
    }

    // Close Dropdown if Clicked Outside Dropdown Element
    function closeIfClickedOutside(menu, e) {
     if (
        e.target.closest(".custom-select-parent") === null &&
        e.target !== this &&
        menu.offsetParent !== null
     ) {
        menu.style.display = "none";
     }
    }
    },

    single:function (element){
    // Single Element functions
      return {
        update: function(data = null){
          // check if data is object
          let new_options = '<option disabled>Select</option>';
          if ([null, undefined].includes(data)) {
            new_options = element.innerHTML;
          }else if(Array.isArray(data)){
            console.log("array");

            new_options = data.map(function(_val) {
                // console.log(key + ': ' + myObject[key]);
                return `<option value="${_val}">${_val}</option>`
            }).join("");
          }else if(typeof data === 'object' && data !== null){
            console.log("object");
            new_options = Object.keys(data).map(function(key) {
                // console.log(key + ': ' + myObject[key]);
                return `<option value="${key}">${data[key]}</option>`
            }).join("");
          }else if(typeof data === 'string' || data instanceof String){
            console.log("string");
            const regex = /<option(?:\s+\w+=".*")*>.*<\/option>/;
            if (regex.test(data)) {
              new_options = data;
            }
          }

          element.innerHTML = new_options;
          CustomSelect.createCustomDropdown(element);



        }
      }
    }
    }

// export default CustomSelect;
