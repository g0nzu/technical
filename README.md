# 🌐 Dynamic Web Page Management System – Technical Test

This project implements a **dynamic web page management system** as a technical test. It enables users to **create, edit, list, and delete HTML pages** through a web-based administration panel. Built with **Node.js**, **Express**, and **Handlebars (HBS)**, the system stores page metadata in a JSON file and page content as HTML files. A REST API and a frontend JavaScript component facilitate seamless interaction with the backend.

---

## ✨ Features

- **Dynamic Page Creation**: Create custom pages with unique routes (e.g., `/nosotros`, `/servicios`) via an admin panel.
- **Default Main Page**: A protected `main` page always exists at `/` and cannot be deleted.
- **CRUD Operations**:
  - **Create**: Add new pages with custom routes and HTML content.
  - **Read**: List all pages and view their content dynamically.
  - **Update**: Edit existing pages using a simple HTML textarea.
  - **Delete**: Remove pages (except the `main` page).
- **Admin Panel**: Accessible at `/admin`, provides a user-friendly interface to manage pages.
- **REST API**: Exposes endpoints to interact with page management functionality.
- **Frontend JavaScript Component**: Simplifies API consumption for admin panel interactions.
- **File-Based Storage**:
  - Page routes stored in `webs.json`.
  - Page content saved as HTML files in the `web/` directory.
- **Handlebars Templating**: Renders pages dynamically with a consistent layout.
- **Simple HTML Editor**: Uses a textarea for editing raw HTML content.
- **Responsive UI**: Built with Bootstrap for a clean and modern interface.

---

## 📂 Project Structure

```
.
├── app.js                    # Main Express application setup
├── data/
│   ├── myweb.js             # Backend module for managing pages
│   └── webs.json            # JSON file storing page routes and metadata
├── public/
│   ├── css/
│   │   └── styles.css       # Custom CSS for admin panel and frontend
│   └── js/
│       ├── admin.js         # Frontend logic for /admin panel
│       └── mycomponent.js   # JavaScript component for REST API interaction
├── routes/
│   ├── api.js               # REST API routes
│   └── index.js             # Frontend and admin routes
├── views/
│   ├── admin.hbs            # Admin panel template
│   ├── home.hbs             # Main page template
│   ├── page.hbs             # Generic template for dynamic pages
│   └── layouts/
│       ├── admin.hbs        # Layout for admin panel
│       └── main.hbs         # Layout for frontend pages
├── web/                     # Directory storing HTML page content
│   ├── main.html            # Default main page content
│   ├── asdsasdsad.html      # Example custom page
│   ├── asd.html             # Example custom page
│   └── sss.html             # Example custom page
├── package.json             # Project dependencies and scripts
└── README.md                # Project documentation
```

---

## ⚙️ Installation and Setup

### Prerequisites
- **Node.js**: Version 14 or higher.
- **npm**: Included with Node.js.
- A modern web browser for testing.

### Installation Steps
1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/dynamic-web-cms.git
   cd dynamic-web-cms
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

   Required packages:
   - `express`: Web server framework.
   - `express-handlebars`: Handlebars templating engine.
   - `fs-extra`: File system operations.
   - `morgan`: HTTP request logging.
   - `bootstrap`: Frontend styling (included via CDN or local files).

3. **Initialize `webs.json`**
   Create a `webs.json` file in the `data/` directory with the following structure (or use the provided example):
   ```json
   {
     "webs": [
       {"route": "main", "title": "Main Page", "file": "web/main.html"},
       {"route": "asdsasdsad", "title": "Custom Page 1", "file": "web/asdsasdsad.html"},
       {"route": "asd", "title": "Custom Page 2", "file": "web/asd.html"},
       {"route": "sss", "title": "Custom Page 3", "file": "web/sss.html"}
     ]
   }
   ```

4. **Create `web/` Directory**
   Ensure the `web/` directory exists and contains a `main.html` file with default content (e.g., `<h1>Welcome to the Main Page</h1>`).

5. **Start the Server**
   ```bash
   npm start
   ```
   The server will run at `http://localhost:3000`.

---

## 📌 Usage

### Frontend Routes
- **`/`**: Renders the default `main` page using `home.hbs` and content from `web/main.html`.
- **`/:route`**: Renders dynamic pages (e.g., `/nosotros`, `/servicios`) using `page.hbs` and content from the corresponding HTML file in `web/`.
- **`/admin`**: Access the admin panel for managing pages.

### Admin Panel (`/admin`)
- **List Pages**: Displays a table of all pages with their routes, titles, and actions (edit, delete).
- **Create Page**: Form to input a new route, title, and HTML content via a textarea.
- **Edit Page**: Load existing HTML content into a textarea for editing.
- **Delete Page**: Remove a page and its associated HTML file (except `main`).
- **UI Features**:
  - Responsive table with Bootstrap styling.
  - Confirmation dialogs for delete actions.
  - Simple HTML textarea for content editing.

### REST API Endpoints
The API is accessible under `/api/` and interacts with the `myweb.js` module. Example response for `/api/list`:
```json
{
  "webs": [
    {"route": "main", "title": "Main Page", "file": "web/main.html"},
    {"route": "asdsasdsad", "title": "Custom Page 1", "file": "web/asdsasdsad.html"},
    {"route": "asd", "title": "Custom Page 2", "file": "web/asd.html"},
    {"route": "sss", "title": "Custom Page 3", "file": "web/sss.html"}
  ]
}
```

- **GET `/api/list`**:
  - Returns the list of all pages from `webs.json`.
  - Response: JSON array of page objects.
- **POST `/api/new`**:
  - Creates a new page.
  - Body: `{ "route": "nosotros", "title": "About Us", "content": "<h1>About Us</h1>" }`.
  - Creates a new HTML file in `web/` and updates `webs.json`.
- **POST `/api/edit`**:
  - Updates an existing page’s content.
  - Body: `{ "route": "nosotros", "content": "<h1>Updated Content</h1>" }`.
  - Overwrites the corresponding HTML file.
- **POST `/api/delete`**:
  - Deletes a page (except `main`).
  - Body: `{ "route": "nosotros" }`.
  - Removes the HTML file and updates `webs.json`.
- **GET `/api/content/:route`**:
  - Retrieves the HTML content of a specific page.
  - Example: `/api/content/nosotros` returns the raw HTML from `web/nosotros.html`.

### Backend Module (`data/myweb.js`)
A Node.js module using the **Object Literal Pattern** for managing pages. It handles file operations and JSON updates.

**Functions**:
- `list()`: Returns the array of pages from `webs.json`.
- `new(route, title, content)`: Creates a new HTML file and adds an entry to `webs.json`.
- `edit(route, content)`: Updates the HTML content of an existing page.
- `delete(route)`: Removes a page’s HTML file and its entry in `webs.json` (blocked for `main`).

**Usage Example**:
```javascript
const myweb = require('./data/myweb.js');
myweb.list(); // Returns array of pages
myweb.new('nosotros', 'About Us', '<h1>About Us</h1>');
myweb.edit('nosotros', '<h1>Updated About Us</h1>');
myweb.delete('nosotros');
```

### Frontend JavaScript Component (`public/js/mycomponent.js`)
A JavaScript module (Object Literal Pattern) that consumes the REST API.

**Functions**:
- `list(callback)`: Fetches the list of pages via `/api/list`.
- `new({ route, title, content }, callback)`: Creates a new page via `/api/new`.
- `edit({ route, content }, callback)`: Updates a page via `/api/edit`.
- `delete(route, callback)`: Deletes a page via `/api/delete`.
- `getContent(route, callback)`: Retrieves page content via `/api/content/:route`.

**Usage Example**:
```javascript
const mywebs = new MyComponentWeb();
mywebs.list((data) => {
  console.log(data); // Array of pages
});
mywebs.new({ route: 'nosotros', title: 'About Us', content: '<h1>About Us</h1>' }, () => {
  console.log('Page created');
});
```

### Admin UI (`public/js/admin.js`)
The admin panel’s JavaScript logic uses `mycomponent.js` to interact with the API and dynamically render the UI.

**Features**:
- **Table Display**: Lists all pages with columns for route, title, and actions (edit/delete).
- **Create Form**: Input fields for route, title, and HTML content.
- **Edit Modal**: Populates a textarea with existing content for editing.
- **Delete Confirmation**: Prompts before deleting a page.
- **Bootstrap Integration**: Responsive design with modals and alerts.

**Example**:
```javascript
const mywebs = new MyComponentWeb();
mywebs.list((data) => {
  // Render table with data.webs
  const table = document.getElementById('pages-table');
  data.webs.forEach((web) => {
    table.innerHTML += `<tr><td>${web.route}</td><td>${web.title}</td><td>...</td></tr>`;
  });
});
```

---

## 🛠️ Technical Stack
- **Node.js + Express**: Backend server and routing.
- **Handlebars (HBS)**: Templating engine for rendering pages.
- **fs-extra**: Enhanced file system operations for JSON and HTML files.
- **Bootstrap 5**: Frontend styling (via CDN or local files).
- **morgan**: HTTP request logging for development.
- **Fetch API**: Used in `mycomponent.js` for REST API calls.

---

## 📝 Notes
- **Reserved Routes**: `admin`, `root`, `system`, `null`, `undefined` are reserved and cannot be used for custom pages.
- **Main Page Protection**: The `main` page cannot be deleted.
- **Validation**: Routes should use alphanumeric characters and hyphens (e.g., `a-z`, `0-9`, `-`).
- **Error Handling**: Basic error handling for invalid routes, file operations, and API requests.
- **Development Workflow**:
  - Separate videos were recorded for each module (backend, API, frontend component, admin UI) as per requirements.
  - A final video summarizes the project and demonstrates functionality.

---

## 🚀 Potential Improvements
- **Authentication**: Add user login to secure the `/admin` panel.
- **Rich Text Editor**: Replace textarea with a WYSIWYG editor (e.g., TinyMCE, Quill).
- **Search and Pagination**: Enhance the admin panel’s table with search and pagination.
- **Input Validation**: Add stricter validation for routes and HTML content.
- **Unit Tests**: Implement tests using Jest or Mocha for backend and frontend components.
- **Docker Support**: Containerize the application for easier deployment.
- **Real-Time Preview**: Add live preview for HTML content in the admin panel.
- **Versioning**: Track page versions for rollback capabilities.

---

## 📚 Development Process
The project was developed in modular stages, with each component recorded separately as per the test requirements:
1. **Backend Module (`myweb.js`)**: File and JSON management logic.
2. **REST API (`api.js`)**: Endpoints for CRUD operations.
3. **Frontend Component (`mycomponent.js`)**: API consumption logic.
4. **Admin UI (`admin.js` and `admin.hbs`)**: User interface for page management.
5. **Final Summary**: A video demonstrating the complete system, including creating, editing, and deleting pages.

For further details, refer to the recorded videos submitted with the project.