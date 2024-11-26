class AnimalTable {
    constructor(data, tableId, sortColumns, count) {
      this.tableId = tableId;
      this.sortColumns = sortColumns;
  
      // Load data from localStorage or use initial data
      const savedData = localStorage.getItem(this.tableId);
      this.data = savedData ? JSON.parse(savedData) : (data.length > 0 ? data : []);
  
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
      html += `<thead>Table :${this.count}<tr>`;
  
      // Create table headers
      if (this.data.length > 0) {
        const headers = Object.keys(this.data[0]);
        headers.forEach((key) => {
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
        });
        html += `<th class="text-center align-top">Actions</th></tr></thead><tbody>`;
  
        // Render rows
        this.data.forEach((row, index) => {
          html += `<tr>`;
          Object.keys(row).forEach((key) => {
            if (key === "image") {
              html += `<td>
                            <img src="${row[key]}" class="img-thumbnail zoomable" alt="${row.name}" style="width: 100px; height: auto;">
                        </td>`;
            } else {
              html += `<td>${row[key] || ""}</td>`;
            }
          });
          html += `<td>
                    <button class="btn btn-primary btn-sm edit-btn" data-index="${index}">Edit</button>
                    <button class="btn btn-danger btn-sm delete-btn" data-index="${index}">Delete</button>
                </td>`;
          html += `</tr>`;
        });
  
        html += "</tbody></table>";
      } else {
        html += "<tbody></tbody></table>";
      }
  
      html += `<button class="btn btn-success btn-sm add-btn">Add Animal</button>`;
      container.innerHTML = html;
  
      // Add event listeners
      this.addEventListeners();
    }
  
    addEventListeners() {
      const container = document.getElementById(this.tableId);
  
      const sortButtons = container.querySelectorAll(".sort-btn");
      sortButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const column = e.target.closest("button").getAttribute("data-column");
          this.sort(column);
        });
      });
  
      const deleteButtons = container.querySelectorAll(".delete-btn");
      deleteButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const index = e.target.getAttribute("data-index");
          this.deleteEntry(index);
        });
      });
  
      const editButtons = container.querySelectorAll(".edit-btn");
      editButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const index = e.target.getAttribute("data-index");
          this.editEntry(index);
        });
      });
  
      const addButton = container.querySelector(".add-btn");
      addButton.addEventListener("click", () => this.addEntry());
    }
  
    sort(column) {
      this.data.sort((a, b) => (a[column] > b[column] ? 1 : -1));
      this.renderTable();
    }
  
    deleteEntry(index) {
      this.data.splice(index, 1);
      this.saveToLocalStorage();
      this.renderTable();
    }
  
    editEntry(index) {
      const editAnimalModal = new bootstrap.Modal(
        document.getElementById("editAnimalModal")
      );
      const entry = this.data[index];
  
      // Populate the fields with existing data
      document.getElementById("editSpecies").value = entry.species;
      document.getElementById("editName").value = entry.name;
      document.getElementById("editSize").value = entry.size;
      document.getElementById("editLocation").value = entry.location;
  
      const editPreviewImage = document.getElementById("editPreviewImage");
      editPreviewImage.src = entry.image || "";
      editPreviewImage.style.display = entry.image ? "block" : "none";
  
      const editImageUpload = document.getElementById("editImageUpload");
      const saveButton = document.getElementById("saveChangesButton");
      saveButton.disabled = true;
  
      // Store initial data for comparison
      const originalEntry = { ...entry };
  
      // Enable the Save Changes button if any field is changed
      const fields = [
        document.getElementById("editSpecies"),
        document.getElementById("editName"),
        document.getElementById("editSize"),
        document.getElementById("editLocation"),
        editImageUpload,
      ];
  
      fields.forEach((field) => {
        field.addEventListener("input", () => {
          const isChanged =
            document.getElementById("editSpecies").value.trim() !==
              originalEntry.species ||
            document.getElementById("editName").value.trim() !==
              originalEntry.name ||
            document.getElementById("editSize").value.trim() !==
              originalEntry.size ||
            document.getElementById("editLocation").value.trim() !==
              originalEntry.location ||
            editImageUpload.files.length > 0;
  
          saveButton.disabled = !isChanged; // Enable or disable the button
        });
      });
  
      editAnimalModal.show();
  
      const form = document.getElementById("editAnimalForm");
      form.onsubmit = (e) => {
        e.preventDefault();
  
        const updatedEntry = {
          species: document.getElementById("editSpecies").value.trim(),
          name: document.getElementById("editName").value.trim(),
          size: document.getElementById("editSize").value.trim(),
          location: document.getElementById("editLocation").value.trim(),
          image: entry.image,
        };
  
        if (editImageUpload.files.length > 0) {
          const file = editImageUpload.files[0];
          const reader = new FileReader();
          reader.onload = () => {
            updatedEntry.image = reader.result;
            this.updateEntry(index, updatedEntry, editAnimalModal);
          };
          reader.readAsDataURL(file);
        } else {
          this.updateEntry(index, updatedEntry, editAnimalModal);
        }
      };
    }
  
    updateEntry(index, updatedEntry, modal) {
      const currentEntry = this.data[index];
  
      const hasFieldChanges = Object.keys(updatedEntry).some((key) => {
        if (key === "image") return false;
        return updatedEntry[key].trim().toLowerCase() !== currentEntry[key]?.trim().toLowerCase();
      });
  
      const hasImageChange = updatedEntry.image !== currentEntry.image;
  
      if (!hasFieldChanges && !hasImageChange) {
        this.showErrorModal("No changes made.");
        return;
      }
  
      if (hasFieldChanges) {
        const isDuplicate = this.data.some((row, i) => {
          if (i === index) return false;
          return row.name.toLowerCase().trim() === updatedEntry.name.toLowerCase().trim();
        });
  
        if (isDuplicate) {
          this.showErrorModal("Duplicate name found!");
          return;
        }
      }
  
      this.data[index] = updatedEntry;
      this.saveToLocalStorage();
      this.renderTable();
      modal.hide();
    }
  
    addEntry() {
      const addAnimalModal = new bootstrap.Modal(
        document.getElementById("addAnimalModal")
      );
      addAnimalModal.show();
  
      const form = document.getElementById("addAnimalForm");
      form.onsubmit = (e) => {
        e.preventDefault();
  
        const newEntry = {
          species: document.getElementById("species").value.trim(),
          name: document.getElementById("name").value.trim(),
          size: document.getElementById("size").value.trim(),
          location: document.getElementById("location").value.trim(),
          image: document.getElementById("imageUpload").files[0]
            ? URL.createObjectURL(document.getElementById("imageUpload").files[0])
            : "",
        };
  
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
      const requiredFields = ["species", "name", "size", "location"];
  
      const isValid = requiredFields.every(
        (key) => entry[key] && entry[key].trim().length > 0
      );
  
      if (!isValid) {
        this.showErrorModal("All fields are required.");
        return false;
      }
  
      const normalizedEntry = entry.name.toLowerCase().trim();
  
      const isDuplicate = this.data.some((row, index) => {
        if (index === excludeIndex) return false;
        return row.name.toLowerCase().trim() === normalizedEntry;
      });
  
      if (isDuplicate) {
        this.showErrorModal(
          action === "add"
            ? "Duplicate name found in the table!"
            : "Duplicate name found!"
        );
        return false;
      }
  
      return true;
    }
  
    showErrorModal(message) {
      const modalBody = document.querySelector("#errorModal .modal-body");
      if (modalBody) {
        modalBody.textContent = message;
      }
      const errorModal = new bootstrap.Modal(
        document.getElementById("errorModal")
      );
      errorModal.show();
    }
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    const bigCatsData = []; // Start with an empty dataset
    const dogsData = [];
    const bigFishData = [];
  
    let count = 0;
    new AnimalTable(bigCatsData, "bigCatsTable", ["name", "size", "location"], ++count);
    new AnimalTable(dogsData, "dogsTable", ["name", "location"], ++count);
    new AnimalTable(bigFishData, "bigFishTable", ["name", "size", "location"], ++count);
  });
  