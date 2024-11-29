# Animal Tables Application

## Screenshot :
<img width="1680" alt="image" src="https://user-images.githubusercontent.com/47946810/222601503-4c754fc5-585c-4cab-af4b-be02898d324d.png">

## Overview
The Animal Tables Application is a responsive web app designed to manage animal data in a tabular format. It supports CRUD operations (Create, Read, Update, Delete) on animal data, sorting functionalities, and local storage for data persistence.

---

## File Structure

### 1. `index.html`
The main HTML file containing the structure of the application, including modals for adding and editing animals.

### 2. `style.css`
The CSS file that styles the application, including table responsiveness and modal designs.

### 3. `script.js`
The JavaScript file containing the functionality of the application, including table rendering, event handling, and local storage management.

### 4. `manifest.json`
The manifest file defining metadata for the app, such as name, description, and icons.

---

## Features

- **CRUD Operations**:
  Add, edit, delete, and view animals in the table.
  
- **Responsive Design**:
  Tables are scrollable on smaller screens.

- **Image Zoom**:
  Hovering over images zooms them for better visibility.

- **Sorting**:
  Sortable columns with an icon for better usability.

- **Validation**:
  Prevents duplicate entries and enforces required fields.

- **Local Storage**:
  Data is saved in `localStorage`, preserving it between sessions.

---

## Usage Instructions

### 1. **Open the Application**
   - Open `index.html` in a browser to view the app.

### 2. **Adding a New Animal**
   - Click the "Add Animal" button.
   - Fill out the form in the modal and click "Add Animal."

### 3. **Editing an Existing Animal**
   - Click the "Edit" button next to an animal entry.
   - Update the fields in the modal and click "Save Changes."

### 4. **Deleting an Animal**
   - Click the "Delete" button next to an animal entry to remove it.

### 5. **Sorting**
   - Click the sorting icon in the column headers to sort by that column.

---

## File Details

### 1. `index.html`
- **Purpose**: The main layout of the application.
- **Key Components**:
  - **Container for Tables**:
    ```html
    <div class="container my-4">
        <h1 class="text-center">Animal Tables</h1>
        <div class="table-responsive" id="bigCatsTable"></div>
        <div class="table-responsive" id="dogsTable"></div>
        <div class="table-responsive" id="bigFishTable"></div>
    </div>
    ```
  - **Modals**:
    - Add Animal Modal
    - Edit Animal Modal
    - Error Modal
  - **Scripts**:
    Includes Bootstrap and custom JavaScript files:
    ```html
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="js/script.js"></script>
    ```

---

### 2. `style.css`
- **Purpose**: Styling for the application.
- **Key Features**:
  - **Zoomable Images**:
    ```css
    img.zoomable:hover {
        transform: scale(1.5);
        border: 4px solid black;
    }
    ```
  - **Table Styling**:
    ```css
    table {
        table-layout: fixed;
        width: 100%;
    }
    th, td {
        word-wrap: break-word;
        text-align: center;
        vertical-align: top;
    }
    ```
  - **Responsive Design**:
    Ensures tables are scrollable on smaller screens using `.table-responsive`.

---

### 3. `script.js`
- **Purpose**: Implements functionality for managing animal tables.
- **Key Methods**:
  - **Constructor (`AnimalTable`)**:
    Initializes the table with data, table ID, sortable columns, and count.
  - **`renderTable()`**:
    - Dynamically creates table headers and rows.
    - Adds sorting buttons with images for specific columns.
  - **`addEventListeners()`**:
    - Handles sorting, editing, deleting, and adding actions.
  - **`sort(column)`**:
    Sorts the table data by the specified column.
  - **`deleteEntry(index)`**:
    Deletes an entry from the table based on the index.
  - **`editEntry(index)`**:
    Opens the "Edit Animal" modal and pre-fills the data for editing.
  - **`addEntry()`**:
    Opens the "Add Animal" modal and handles form submissions to add a new animal.
  - **`validateEntry(entry, excludeIndex, action)`**:
    - Validates the data for completeness and checks for duplicates.
    - Displays an error message using the `showErrorModal()` method if validation fails.

---

### 4. `manifest.json`
- **Purpose**: Metadata for the web app.
- **Key Properties**:
  - **`name`**: Full name of the app ("Animal Tables").
  - **`short_name`**: Shortened name ("Animals").
  - **`start_url`**: Entry point of the app (`index.html`).
  - **`icons`**:
    Defines app icons in multiple sizes for various devices.

---

## Future Enhancements

- **Image Upload**:
  Allow users to upload custom images for animals.
  
- **Pagination**:
  Add pagination for large datasets.
  
- **Search Functionality**:
  Enable searching through table data.
  
- **Export/Import**:
  Allow exporting and importing data as JSON or CSV files.

---

## Responsive Design

- Uses Bootstrap for mobile-first responsiveness.
- Tables automatically become scrollable on smaller screens.

---

## License

This project is open-source and can be used freely under the [MIT License](LICENSE).
