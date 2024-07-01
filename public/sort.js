document.getElementById('file-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const directoryInput = document.getElementById('directory');
    const keywordInput = document.getElementById('keyword');
    const files = directoryInput.files;
    const keywords = keywordInput.value;
    const sessionId = generateSessionId();

    if (!files.length || !keywords) {
        showAlert('Please select files and enter keywords.');
        return;
    }

    // Show custom confirmation modal
    showModal(() => {
        const formData = new FormData();
        for (const file of files) {
            formData.append('files', file);
        }
        formData.append('keywords', keywords);
        formData.append('sessionId', sessionId);

        document.getElementById('loading-bar').style.display = 'block';

        processFiles(formData, sessionId);
    });
});

async function processFiles(formData, sessionId) {
    try {
        const response = await fetch('/process-files', {
            method: 'POST',
            body: formData
        });

        const message = await response.text();
        document.getElementById('message').innerText = message;

        if (response.ok) {
            // Show download options
            document.getElementById('download-options').style.display = 'block';
            document.getElementById('download-with-keyword').dataset.sessionId = sessionId;
            document.getElementById('download-without-keyword').dataset.sessionId = sessionId;

            showCheckmarkAnimation();
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        document.getElementById('loading-bar').style.display = 'none';
    }
}

document.getElementById('download-with-keyword').addEventListener('click', (event) => {
    const sessionId = event.target.dataset.sessionId;
    window.location.href = `/download/${sessionId}/with_keyword`;
});

document.getElementById('download-without-keyword').addEventListener('click', (event) => {
    const sessionId = event.target.dataset.sessionId;
    window.location.href = `/download/${sessionId}/without_keyword`;
});

window.addEventListener('beforeunload', async () => {
    const sessionId = document.getElementById('download-with-keyword').dataset.sessionId;
    if (sessionId) {
        await fetch('/cleanup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sessionId })
        });
    }
});

function generateSessionId() {
    return crypto.getRandomValues(new Uint32Array(4)).join('-');
}

function showModal(onConfirm) {
    const modal = document.getElementById('confirmation-modal');
    const closeButton = modal.querySelector('.close-button');
    const confirmButton = document.getElementById('confirm-upload');
    const cancelButton = document.getElementById('cancel-upload');

    modal.style.display = 'block';

    closeButton.onclick = () => {
        modal.style.display = 'none';
    };

    confirmButton.onclick = () => {
        modal.style.display = 'none';
        onConfirm();
    };

    cancelButton.onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

function showCheckmarkAnimation() {
    const checkmark = document.getElementById('checkmark-animation');
    checkmark.style.display = 'block';
    setTimeout(() => {
        checkmark.style.display = 'none';
    }, 2000);
}

function showAlert(message) {
    const alertBox = document.createElement('div');
    alertBox.className = 'alert-box';
    alertBox.innerText = message;

    document.body.appendChild(alertBox);
    setTimeout(() => {
        alertBox.remove();
    }, 3000);
}
