document.addEventListener('DOMContentLoaded', () => {
    const scanUrlButton = document.getElementById('scanUrlButton');
    const uploadFileButton = document.getElementById('uploadFileButton');

    // Add event listener for the "Scan Current URL" button
    scanUrlButton.addEventListener('click', () => {
        // Send a message to the background script to perform the URL scan
        chrome.runtime.sendMessage({ action: 'scanUrl' });
        // Close the popup after sending the message
        window.close();
    });

    // Add event listener for the "Upload a File" button
    uploadFileButton.addEventListener('click', () => {
        // Send a message to the background script to open the file upload page
        chrome.runtime.sendMessage({ action: 'uploadFile' });
        // Close the popup after sending the message
        window.close();
    });
});