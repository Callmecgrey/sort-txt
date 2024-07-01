# SORT TXT

SORT TXT is a simple Node.js application that allows users to sort `.txt` files based on the presence of a specified keyword. The files are moved into separate directories based on whether they contain the keyword or not.

## Features

- Select a folder containing `.txt` files.
- Enter a keyword to search within the files.
- Files containing the keyword are moved to the `with_keyword` directory.
- Files not containing the keyword are moved to the `without_keyword` directory.
- Original files in the `uploads` directory are removed after processing.
- A loading bar is displayed during the file processing.

## Requirements

- Node.js (v12.x or later)
- npm (v6.x or later)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/callmecgrey/sort-txt.git
    cd file-keyword-sorter
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

## Usage

1. Start the server:

    ```bash
    node server.js
    ```

2. Open your browser and navigate to:

    ```
    http://localhost:3008
    ```

3. Select a folder containing `.txt` files and enter the keyword to search.

4. Click the "Process Files" button to start the sorting process.

5. The files will be moved to the following directories based on the presence of the keyword:
    - `uploads/with_keyword`
    - `uploads/without_keyword`

## File Structure

- `public/index.html`: Frontend HTML file for selecting the folder and entering the keyword.
- `server.js`: Backend Node.js server file for processing the files.
- `uploads/with_keyword`: Directory for files containing the keyword.
- `uploads/without_keyword`: Directory for files not containing the keyword.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## Acknowledgements

- [Express.js](https://expressjs.com/)
- [Multer](https://github.com/expressjs/multer)

