var emails = [
    {
        subject: 'Hello',
        sender: 'john@example.com',
        message: 'This is the first email.'
    },
    {
        subject: 'Greetings',
        sender: 'jane@example.com',
        message: 'This is the second email.'
    },
];
// Assuming you have a container element with an id "email-container" in your HTML
var container = document.getElementById('email-container');
// Function to create and append email elements to the container
function displayEmails(emails) {
    // Clear the existing content of the container
    container.innerHTML = '';
    // Iterate over each email object
    emails.forEach(function (email) {
        // Create HTML elements for each email
        var emailDiv = document.createElement('div');
        var subjectHeading = document.createElement('h2');
        var senderPara = document.createElement('p');
        var messagePara = document.createElement('p');
        // Set the text content of the elements
        subjectHeading.textContent = email.subject;
        senderPara.textContent = "From: " + email.sender;
        messagePara.textContent = email.message;
        // Append the elements to the email div
        emailDiv.appendChild(subjectHeading);
        emailDiv.appendChild(senderPara);
        emailDiv.appendChild(messagePara);
        // Append the email div to the container
        container.appendChild(emailDiv);
    });
}
