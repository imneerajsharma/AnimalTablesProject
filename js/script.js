class AnimalTable {
    constructor(data, tableId, sortColumns,count) {
        this.tableId = tableId;
        this.sortColumns = sortColumns;
        
        

        // Load data from localStorage or use initial data
        const savedData = localStorage.getItem(this.tableId);
        this.data = savedData ? JSON.parse(savedData) : data;
        
        // Register this table's data globally
        if (!window.allTablesData) {
        window.allTablesData = {};
        }
    window.allTablesData[this.tableId] = this.data;
        this.count = count;
        this.renderTable();
    }

    saveToLocalStorage() {
        localStorage.setItem(this.tableId, JSON.stringify(this.data));
        window.allTablesData[this.tableId] = this.data; // Update global data
    }

    renderTable() {
        const container = document.getElementById(this.tableId);
        if (!container) return;
    
        // Create table structure
        let html = '<table class="table table-bordered table-hover">';
        html += `<thead>Table :${this.count} ${this.data[0].species}<tr>`;
        
    
        // Create table headers with sorting options
        for (let key in this.data[0]) {
            if (key === "image") {
                html += `<th>${key}</th>`;
            }
            else if( key == "size"){
                html += `<th>${key} (in ft's)</th>`;
            } else if (this.sortColumns.includes(key)) {
                html += `<th>${key} 
                    <button class="btn btn-sm btn-link sort-btn" data-column="${key}">Sort</button>
                </th>`;
            } else {
                html += `<th>${key}</th>`;
            }
        }
        html += '<th>Actions</th></tr></thead><tbody>';
    
        // Render rows
        this.data.forEach((row, index) => {
            html += `<tr>`;
            for (let key in row) {
                if (key === "image") {
                    html += `<td>
                        <img src="${row[key]}" class="img-thumbnail zoomable" alt="${row.name}" style="width: 100px; height: auto;">
                    </td>`;
                } else if (this.tableId === "dogsTable" && key === "name") {
                    // Bold text for Table 2 (Dogs)
                    html += `<td><strong>${row[key]}</strong></td>`;
                } else if (this.tableId === "bigFishTable" && key === "name") {
                    // Bold, italic, blue text for Table 3 (Big Fish)
                    html += `<td><strong><em style="color: blue;">${row[key]}</em></strong></td>`;
                } else {
                    html += `<td>${row[key]}</td>`;
                }
            }
            html += `<td>
                <button class="btn btn-primary btn-sm edit-btn" data-index="${index}">Edit</button>
                <button class="btn btn-danger btn-sm delete-btn" data-index="${index}">Delete</button>
            </td>`;
            html += `</tr>`;
        });
    
        html += '</tbody></table>';
        html += `<button class="btn btn-success btn-sm add-btn">Add Animal</button>`;
        container.innerHTML = html;
    
        // Add event listeners
        this.addEventListeners();
    }
    
    addEventListeners() {
        const container = document.getElementById(this.tableId);

        // Sorting
        const sortButtons = container.querySelectorAll(".sort-btn");
        sortButtons.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const column = e.target.getAttribute("data-column");
                this.sort(column);
            });
        });

        // Deleting
        const deleteButtons = container.querySelectorAll(".delete-btn");
        deleteButtons.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const index = e.target.getAttribute("data-index");
                this.deleteEntry(index);
            });
        });

        // Editing
        const editButtons = container.querySelectorAll(".edit-btn");
        editButtons.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const index = e.target.getAttribute("data-index");
                this.editEntry(index);
            });
        });

        // Adding
        const addButton = container.querySelector(".add-btn");
        addButton.addEventListener("click", () => this.addEntry());
    }

    sort(column) {
        this.data.sort((a, b) => (a[column] > b[column] ? 1 : -1));
        this.renderTable();
    }

    deleteEntry(index) {
        this.data.splice(index, 1);
        this.saveToLocalStorage(); // Save to localStorage
        this.renderTable();
    }

    editEntry(index) {
        // Show the modal
        const editAnimalModal = new bootstrap.Modal(document.getElementById("editAnimalModal"));
        const entry = this.data[index];
    
        // Pre-fill the form with the existing data
        document.getElementById("editSpecies").value = entry.species;
        document.getElementById("editName").value = entry.name;
        document.getElementById("editSize").value = entry.size;
        document.getElementById("editLocation").value = entry.location;
        document.getElementById("editImage").value = entry.image;
    
        editAnimalModal.show();
    
        // Handle form submission
        const form = document.getElementById("editAnimalForm");
        form.onsubmit = (e) => {
            e.preventDefault();
    
            // Collect updated data from the form
            const updatedEntry = {
                species: document.getElementById("editSpecies").value.trim(),
                name: document.getElementById("editName").value.trim(),
                size: document.getElementById("editSize").value.trim(),
                location: document.getElementById("editLocation").value.trim(),
                image: document.getElementById("editImage").value.trim(),
            };


            // Stop if validation fails
        if (!this.validateEntry(updatedEntry, index)) return;

        this.data[index] = updatedEntry;
        this.saveToLocalStorage(); // Save to localStorage
        this.renderTable();
        editAnimalModal.hide();
        };
    }
    

    addEntry() {
        // Show the modal
        const addAnimalModal = new bootstrap.Modal(document.getElementById("addAnimalModal"));
        addAnimalModal.show();
    
        // Handle form submission
        const form = document.getElementById("addAnimalForm");
        form.onsubmit = (e) => {
            e.preventDefault();
    
            // Collect data from the form
            const newEntry = {
                species: document.getElementById("species").value.trim(),
                name: document.getElementById("name").value.trim(),
                size: document.getElementById("size").value.trim(),
                location: document.getElementById("location").value.trim(),
                image: document.getElementById("image").value.trim(),
            };
            const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
            const isValidImage =  imageExtensions.includes(newEntry.image);

            const errorElement = document.getElementById("error");
            const addButton = document.getElementById("add-animal");
            
            if (!isValidImage) {
                errorElement.textContent = "Invalid image URL. Please enter a valid URL with an image extension.";
                addButton.disabled = true; 
                return;
            }
            else{
                this.data.push(newEntry);
            this.saveToLocalStorage(); // Save to localStorage
            this.renderTable();
            addAnimalModal.hide();
            form.reset();
            }

    
            // // Validate and add the new entry
            // if (this.validateEntry(newEntry)) {
            //     this.data.push(newEntry);
            //     this.saveToLocalStorage(); // Save to localStorage
            //     this.renderTable();
            //     addAnimalModal.hide();
            //     form.reset(); // Clear the form
            // } else {
            //     alert("Duplicate entry or invalid format!");
            // }
            // Stop if validation fails
        if (!this.validateEntry(newEntry)) return;

        // this.data.push(newEntry);
        // this.saveToLocalStorage(); // Save to localStorage
        // this.renderTable();
        // addAnimalModal.hide();
        // form.reset(); // Clear the form
        };
    }

validateEntry(entry, excludeIndex = -1) {
    const requiredFields = Object.keys(this.data[0]);

    // Validate that the entry has all required fields and no empty values
    const isValid = requiredFields.every((key) => entry.hasOwnProperty(key) && entry[key].trim().length > 0);
    if (!isValid) {
        //alert("All fields are required and cannot be empty.");
        this.showErrorModal("All fields are required and cannot be empty.");
        return false;
    }

    // Normalize the entry for case-insensitive comparison
    const normalizedEntry = {};
    requiredFields.forEach((key) => {
        normalizedEntry[key] = typeof entry[key] === 'string' ? entry[key].toLowerCase().trim() : entry[key];
    });

    // Check for duplicates across all tables
    const isDuplicate = Object.values(window.allTablesData).some((tableData) =>
        tableData.some((row, index) => {
            if (tableData === this.data && index === excludeIndex) return false; // Skip current entry during editing

            const normalizedRow = {};
            requiredFields.forEach((key) => {
                normalizedRow[key] = typeof row[key] === 'string' ? row[key].toLowerCase().trim() : row[key];
            });

            return requiredFields.every((key) => normalizedRow[key] === normalizedEntry[key]);
        })
    );

    if (isDuplicate) {
       //alert("Duplicate entry found! The animal is already in the table.");

       this.showErrorModal("Duplicate entry found! The animal is already in the table.");
       return false;
    }

    // return !isDuplicate; // Return true only if no duplicate is found
    return true; // Validation passed
}

showErrorModal(message) {
    // Set the error message dynamically
    const modalBody = document.querySelector("#errorModal .modal-body");
    if (modalBody) {
        modalBody.textContent = message;
    }
    // Show the modal using Bootstrap's modal API
    const errorModal = new bootstrap.Modal(document.getElementById("errorModal"));
    errorModal.show();
}

    
    
}

// Example data initialization
document.addEventListener("DOMContentLoaded", () => {
    const bigCatsData = [
        { species: "Big Cats", name: "Tiger", size: "10 ft", location: "Asia", image: "images/tiger.png" },
        { species: "Big Cats", name: "Lion", size: "8 ft", location: "Africa", image: "images/Lion.png" }
    ];
    const dogsData = [
        { species: "Dog", name: "Rottweiler", size: "2 ft", location: "Germany", image: "images/Rotwailer.png" },
        { species: "Dog", name: "Labrador", size: "2 ft", location: "UK", image: "images/Labrodar.png" }
    ];
    const bigFishData = [
        { species: "Big Fish", name: "Humpback Whale", size: "15 ft", location: "Atlantic Ocean", image: "images/HumpbackWhale.png" },
        { species: "Big Fish", name: "Killer Whale", size: "12 ft", location: "Atlantic Ocean", image: "images/Killer_Whale.png" }
    ];

    // new AnimalTable(bigCatsData, "bigCatsTable", ["name", "size", "location"]);
    // new AnimalTable(dogsData, "dogsTable", ["name", "location"]);
    // new AnimalTable(bigFishData, "bigFishTable", ["size"]);

    let count = 0;
    new AnimalTable(bigCatsData, "bigCatsTable", ["name", "size", "location"],count +=1);
    new AnimalTable(dogsData, "dogsTable", ["name", "location"], count +=1);
    new AnimalTable(bigFishData, "bigFishTable", ["size"], count +=1);
    
    
});


// Responsive table adjustment for smaller screens
window.addEventListener("resize", () => {
    if (window.innerWidth < 768) {
        document.querySelectorAll(".table").forEach((table) => {
            table.classList.add("table-responsive");
        });
    }
});

// Ensure responsiveness on initial load
if (window.innerWidth < 768) {
    document.querySelectorAll(".table").forEach((table) => {
        table.classList.add("table-responsive");
    });
}