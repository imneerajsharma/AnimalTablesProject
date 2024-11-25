class AnimalTable {
    constructor(data, tableId, sortColumns) {
        this.data = data; // Array of objects representing the table rows
        this.tableId = tableId; // ID of the container where the table is rendered
        this.sortColumns = sortColumns; // Columns that can be sorted
        this.renderTable();
    }

    // renderTable() {
    //     const container = document.getElementById(this.tableId);
    //     if (!container) return;

    //     // Create table structure
    //     let html = '<table class="table table-bordered table-hover">';
    //     html += '<thead><tr>';

    //     // Create table headers with sorting options
    //     for (let key in this.data[0]) {
    //         if (key === "image") {
    //             html += `<th>${key}</th>`;
    //         } else if (this.sortColumns.includes(key)) {
    //             html += `<th>${key} 
    //                 <button class="btn btn-sm btn-link sort-btn" data-column="${key}">Sort</button>
    //             </th>`;
    //         } else {
    //             html += `<th>${key}</th>`;
    //         }
    //     }
    //     html += '<th>Actions</th></tr></thead><tbody>';

    //     // Render rows
    //     this.data.forEach((row, index) => {
    //         html += `<tr>`;
    //         for (let key in row) {
    //             if (key === "image") {
    //                 html += `<td>
    //                     <img src="${row[key]}" class="img-thumbnail" alt="${row.name}" style="width: 100px; height: auto;">
    //                 </td>`;
    //             } else {
    //                 html += `<td>${row[key]}</td>`;
    //             }
    //         }
    //         html += `<td>
    //             <button class="btn btn-primary btn-sm edit-btn" data-index="${index}">Edit</button>
    //             <button class="btn btn-danger btn-sm delete-btn" data-index="${index}">Delete</button>
    //         </td>`;
    //         html += `</tr>`;
    //     });

    //     html += '</tbody></table>';
    //     html += `<button class="btn btn-success btn-sm add-btn">Add Animal</button>`;
    //     container.innerHTML = html;

    //     // Add event listeners
    //     this.addEventListeners();
    // }

    renderTable() {
        const container = document.getElementById(this.tableId);
        if (!container) return;
    
        // Create table structure
        let html = '<table class="table table-bordered table-hover">';
        html += '<thead><tr>';
    
        // Create table headers with sorting options
        for (let key in this.data[0]) {
            if (key === "image") {
                html += `<th>${key}</th>`;
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
                        <img src="${row[key]}" class="img-thumbnail" alt="${row.name}" style="width: 100px; height: auto;">
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
        this.renderTable();
    }

    // editEntry(index) {
    //     const entry = this.data[index];
    //     const newEntry = prompt("Edit entry (JSON format):", JSON.stringify(entry));
    //     if (newEntry) {
    //         try {
    //             this.data[index] = JSON.parse(newEntry);
    //             this.renderTable();
    //         } catch (err) {
    //             alert("Invalid JSON format!");
    //         }
    //     }
    // }
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
    
            // Validate and update the entry
            if (this.validateEntry(updatedEntry, index)) {
                this.data[index] = updatedEntry;
                this.renderTable();
                editAnimalModal.hide();
            } else {
                alert("Duplicate entry or invalid format!");
            }
        };
    }
    

    // addEntry() {
    //     const newEntry = prompt("Add new entry (JSON format):");
    //     if (newEntry) {
    //         try {
    //             const entry = JSON.parse(newEntry);
    //             if (this.validateEntry(entry)) {
    //                 this.data.push(entry);
    //                 this.renderTable();
    //             } else {
    //                 alert("Duplicate entry or invalid format!");
    //             }
    //         } catch (err) {
    //             alert("Invalid JSON format!");
    //         }
    //     }
    // }

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
    
            // Validate and add the new entry
            if (this.validateEntry(newEntry)) {
                this.data.push(newEntry);
                this.renderTable();
                addAnimalModal.hide();
                form.reset(); // Clear the form
            } else {
                alert("Duplicate entry or invalid format!");
            }
        };
    }
    

    // validateEntry(entry) {
    //     // Validate that the entry is unique and has all required fields
    //     const requiredFields = Object.keys(this.data[0]);
    //     const isValid = requiredFields.every((key) => entry.hasOwnProperty(key));
    //     const isDuplicate = this.data.some((row) =>
    //         requiredFields.every((key) => row[key] === entry[key])
    //     );
    //     return isValid && !isDuplicate;
    // }
    validateEntry(entry, excludeIndex = -1) {
        // Validate that the entry is unique and has all required fields
        const requiredFields = Object.keys(this.data[0]);
        const isValid = requiredFields.every((key) => entry.hasOwnProperty(key));
        const isDuplicate = this.data.some((row, index) =>
            index !== excludeIndex && requiredFields.every((key) => row[key] === entry[key])
        );
        return isValid && !isDuplicate;
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

    new AnimalTable(bigCatsData, "bigCatsTable", ["name", "size", "location"]);
    new AnimalTable(dogsData, "dogsTable", ["name", "location"]);
    new AnimalTable(bigFishData, "bigFishTable", ["size"]);
});
