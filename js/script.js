class AnimalTable {
    constructor(data, tableId, sortColumns, count) {
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
            // Convert column name to CamelCase
            const camelCaseKey = key.charAt(0).toUpperCase() + key.slice(1);

            if (key === "image") {
                html += `<th class="text-center align-top">${camelCaseKey}</th>`;
            } else if (key === "size") {
                html += `<th class="text-center align-top">${camelCaseKey} (in ft's)</th>`;
            } else if (this.sortColumns.includes(key)) {
                html += `<th class="text-center align-top">${camelCaseKey} 
                    <button class="btn btn-link btn-sm sort-btn" data-column="${key}" style="padding: 0;">
                        <img src="images/sort.png" alt="Sort" style="width: 16px; height: 16px;">
                    </button>
                </th>`;
            } else {
                html += `<th class="text-center align-top">${camelCaseKey}</th>`;
            }
        }
        html += `<th class="text-center align-top">Actions</th>`; // For Actions

        // Render rows
        this.data.forEach((row, index) => {
            html += `<tr>`;
            for (let key in row) {
                if (key === "image") {
                    html += `<td>
                        <img src="${row[key]}" class="img-thumbnail zoomable" alt="${row.name}" style="width: 100px; height: auto;">
                    </td>`;
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
                const column = e.target.closest("button").getAttribute("data-column");
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

            const updatedEntry = {
                species: document.getElementById("editSpecies").value.trim(),
                name: document.getElementById("editName").value.trim(),
                size: document.getElementById("editSize").value.trim(),
                location: document.getElementById("editLocation").value.trim(),
                image: document.getElementById("editImage").value.trim(),
            };

            if (!this.validateEntry(updatedEntry, index, "edit")) return;

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

        const form = document.getElementById("addAnimalForm");
        form.onsubmit = (e) => {
            e.preventDefault();

            const newEntry = {
                species: document.getElementById("species").value.trim(),
                name: document.getElementById("name").value.trim(),
                size: document.getElementById("size").value.trim(),
                location: document.getElementById("location").value.trim(),
                image: document.getElementById("image").value.trim(),
            };

            const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
            const isValidImage = imageExtensions.some((ext) => newEntry.image.toLowerCase().endsWith(ext.toLowerCase()));

            const errorElement = document.getElementById("error");
            if (!isValidImage) {
                errorElement.textContent = "Invalid image URL. Please enter a valid URL with an image extension.";
                return;
            }

            if (this.validateEntry(newEntry, -1, "add")) {
                this.data.push(newEntry);
                this.saveToLocalStorage();
                this.renderTable();
                addAnimalModal.hide();
                form.reset();
            }
        };
    }

    validateEntry(entry, excludeIndex = -1, action) {
        const requiredFields = Object.keys(this.data[0]);
        const isValid = requiredFields.every((key) => entry[key] && entry[key].trim().length > 0);
        if (!isValid) {
            this.showErrorModal("All fields are required.");
            return false;
        }

        const normalizedEntry = {};
        requiredFields.forEach((key) => {
            normalizedEntry[key] = entry[key].toLowerCase().trim();
        });

        const isDuplicate = Object.values(window.allTablesData).some((tableData) =>
            tableData.some((row, index) => {
                if (this.data === tableData && index === excludeIndex) return false;
                return requiredFields.every((key) => row[key].toLowerCase().trim() === normalizedEntry[key]);
            })
        );

        if (isDuplicate) {
            const errorMessage = action === "add" ? "Duplicate entry found!" : "No changes made.";
            this.showErrorModal(errorMessage);
            return false;
        }

        return true;
    }

    showErrorModal(message) {
        const modalBody = document.querySelector("#errorModal .modal-body");
        if (modalBody) {
            modalBody.textContent = message;
        }
        const errorModal = new bootstrap.Modal(document.getElementById("errorModal"));
        errorModal.show();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const bigCatsData = [
        { species: "Big Cats", name: "Tiger", size: 10, location: "Asia", image: "images/tiger.png" },
        { species: "Big Cats", name: "Lion", size: 8, location: "Africa", image: "images/Lion.png" },
    ];
    const dogsData = [
        { species: "Dog", name: "Rottweiler", size: 2, location: "Germany", image: "images/Rotwailer.png" },
        { species: "Dog", name: "Labrador", size: 2, location: "UK", image: "images/Labrador.png" },
    ];
    const bigFishData = [
        { species: "Big Fish", name: "Humpback Whale", size: 15, location: "Atlantic Ocean", image: "images/HumpbackWhale.png" },
        { species: "Big Fish", name: "Killer Whale", size: 12, location: "Atlantic Ocean", image: "images/Killer_Whale.png" },
    ];

    let count = 0;
    new AnimalTable(bigCatsData, "bigCatsTable", ["name", "size", "location"], ++count);
    new AnimalTable(dogsData, "dogsTable", ["name", "location"], ++count);
    new AnimalTable(bigFishData, "bigFishTable", ["name", "size", "location"], ++count);
});

// Responsive adjustments
window.addEventListener("resize", () => {
    if (window.innerWidth < 768) {
        document.querySelectorAll(".table").forEach((table) => {
            table.classList.add("table-responsive");
        });
    }
});

if (window.innerWidth < 768) {
    document.querySelectorAll(".table").forEach((table) => {
        table.classList.add("table-responsive");
    });
}
