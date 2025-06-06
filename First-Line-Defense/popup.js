document.addEventListener('DOMContentLoaded', () => {
    // Get a reference to the "Scan Current URL" button element from popup.html
    // using its unique ID 'scanUrlButton'.
    const scanUrlButton = document.getElementById('scanUrlButton');
    
    // Get a reference to the "Upload a File" button element from popup.html
    // using its unique ID 'uploadFileButton'.
    const uploadFileButton = document.getElementById('uploadFileButton');

    // Add an event listener to the 'scanUrlButton'.
    // When this button is clicked by the user, the provided anonymous function will execute.
    scanUrlButton.addEventListener('click', () => {
        // Use a try-catch block to handle any potential errors that might occur
        // during the execution of the code within this block. While `sendMessage` is
        // generally reliable, this adds an extra layer of robustness.
        try {
            // Send a message to the extension's background script (background.js).
            // Chrome extensions communicate between different parts (popup, background,
            // content scripts) using a message passing API.
            // The message is a simple JavaScript object. Here, we define an 'action'
            // property to tell the background script what task to perform.
            chrome.runtime.sendMessage({ action: 'scanUrl' });
            
            // Log a confirmation message to the console. This is useful for debugging
            // and confirming that the message was successfully initiated from the popup.
            // This log will appear in the popup's developer console.
            console.log("Message 'scanUrl' sent to background script.");
            
            // Close the popup window immediately after sending the message.
            // This provides a quick and seamless user experience, as the popup's purpose
            // is usually fulfilled once an action is triggered.
            window.close();
        } catch (error) {
            // If an error occurs during the `chrome.runtime.sendMessage` call
            // (e.g., if the background script is not available or there's a permission issue),
            // this block will catch it.
            // Log the error to the console for debugging purposes, providing details
            // about what went wrong.
            console.error("Error sending 'scanUrl' message:", error);
        }
    });

    // Add an event listener to the 'uploadFileButton', similar to the 'scanUrlButton'.
    // This function executes when the "Upload a File" button is clicked.
    uploadFileButton.addEventListener('click', () => {
        // Use a try-catch block for robust error handling during message sending.
        try {
            // Send a message to the background script to indicate that the user
            // wants to open the file upload page on VirusTotal.
            chrome.runtime.sendMessage({ action: 'uploadFile' });
            
            // Log a confirmation message to the console.
            console.log("Message 'uploadFile' sent to background script.");
            
            // Close the popup window after sending the message.
            window.close();
        } catch (error) {
            // Log any errors that occur while sending the 'uploadFile' message.
            console.error("Error sending 'uploadFile' message:", error);
        }
    });
});