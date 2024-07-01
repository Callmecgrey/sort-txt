document.getElementById('file-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const directoryInput = document.getElementById('directory');
    const keywordInput = document.getElementById('keyword');
    const messageElement = document.getElementById('message');
    const loadingBar = document.getElementById('loading-bar');
    const progress = document.getElementById('progress');

    if (!directoryInput.files.length) {
        messageElement.textContent = 'Please select a folder.';
        return;
    }

    const files = Array.from(directoryInput.files);
    const keyword = keywordInput.value;

    loadingBar.style.display = 'block';
    progress.style.width = '0%';

    let processed = 0;
    for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('keyword', keyword);

        try {
            await fetch('/process-file', {
                method: 'POST',
                body: formData
            });
            processed++;
            progress.style.width = `${(processed / files.length) * 100}%`;
        } catch (error) {
            console.error(error);
            messageElement.textContent = 'An error occurred while processing the files.';
            break;
        }
    }

    loadingBar.style.display = 'none';
    messageElement.textContent = 'Files have been moved based on the keyword.';
});