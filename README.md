# UniCalc | University TGPA, SGPA & CGPA Calculator

UniCalc is a premium, responsive, and visually stunning web application for calculating Term Grade Point Average (TGPA/SGPA) and Cumulative Grade Point Average (CGPA). It provides custom grading scales and official percentage conversion formulas for major Indian universities alongside standard global systems.

## Features

- **University Profiling**: Dynamically loads grading regulations, letter-grade lists, and percentage formulas for:
  - Lovely Professional University (LPU)
  - Chandigarh University (CU)
  - Dr. A.P.J. Abdul Kalam Technical University (AKTU)
  - Delhi University (DU)
  - Mumbai University (MU)
  - Visvesvaraya Technological University (VTU)
  - Anna University
  - Savitribai Phule Pune University (SPPU)
  - Standard 10-Point UGC Grading Scale
  - Standard US 4-Point GPA Scale
- **Dynamic SGPA Calculator**: Add and remove subject rows in real-time. Compute term GPAs instantly as you change values.
- **Dynamic CGPA Calculator**: Supports two modes of calculations:
  - **Semester-wise**: Input SGPA and credits for multiple terms. Plots a gorgeous progress trend chart!
  - **Summary Input**: Input existing cumulative CGPA, prior credits, current term SGPA, and current credits.
- **Two-way Converter**: Perform standalone GPA-to-percentage and percentage-to-GPA conversions based on your selected university.
- **Stunning UI**: Designed with a sleek, glowing glassmorphic Dark Mode default, toggling smoothly to a clean, high-contrast Light Mode. Animated radial SVG gauges display score summaries.
- **Exporting Options**:
  - **PDF Reports**: Custom printable layouts styled to output a clean academic transcript.
  - **CSV Spreadsheet**: Download your subject and semester breakdowns as an editable `.csv` spreadsheet file.

## Running Locally

UniCalc is lightweight and requires zero external npm package installations to run. You can start the dev server directly with native Node.js.

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine.

### Installation & Launch

1. Clone or navigate to the project directory:
   ```powershell
   cd "D:\Tgpa and cgpa cal"
   ```

2. Start the local server:
   ```powershell
   npm start
   ```
   *Alternatively, run:*
   ```powershell
   node server.js
   ```

3. Open your browser and navigate to:
   [http://localhost:4000/](http://localhost:4000/)

## Project Structure

```
├── index.html        # Main HTML skeleton and templates
├── styles.css        # Import aggregator and offline icon overrides
├── themes.css        # CSS variables, dark/light definitions, background animations
├── layout.css        # Page shells, headers, footers, sidebar profiles
├── components.css    # Card elements, forms, buttons, accordion guides, onboarding
├── gauge.css         # SVG radial gauge visuals and canvas container sizes
├── print.css         # Media print transcript styling
├── db.js             # Local universities grade database configs
├── chart.js          # Canvas line-graph trend calculator plotter
├── app.js            # Main controller managing DOM bindings, resolvers, animations
├── server.js         # Lightweight local dev web server
├── vercel.json       # Vercel deployment routes and clean URLs configuration
├── package.json      # NPM configuration metadata
└── README.md         # Documentation
```

## Deploying to Vercel

Since UniCalc is built as a highly optimized static SPA, it can be deployed on Vercel for free with zero server configurations.

### Option 1: Vercel CLI (Fastest from Terminal)

1. Open PowerShell/Terminal inside the project directory:
   ```powershell
   cd "D:\Tgpa and cgpa cal"
   ```
2. Deploy directly using `npx`:
   ```powershell
   npx vercel
   ```
3. Follow the Vercel CLI prompts:
   - Log in or sign up if prompted.
   - Set project name (e.g. `unicalc-gpa-calculator`).
   - Link to existing project? `No`
   - In which directory is your code located? `./`
   - Want to modify build settings? `No`
4. Once completed, Vercel will upload your files and provide a production link!

### Option 2: GitHub (Continuous Deployment)

1. Create a repository on GitHub.
2. Push your project files to the repository.
3. Log into your [Vercel Dashboard](https://vercel.com/).
4. Click **Add New** > **Project** and import your GitHub repository.
5. Vercel will automatically detect `index.html` and configure the project statically.
6. Click **Deploy**. Any future commits you push to GitHub will automatically trigger a new deployment!
