const emails = [

{
    subject: 'Hello',
    sender: 'john@example.com',
    message: 'This is the first email.',
  },
  {
    subject: 'Greetings',
    sender: 'jane@example.com',
    message: 'This is the second email.',
  },
  // Add more email objects as needed
 ];
 
 // Assuming you have a container element with an id "email-container" in your HTML
 const container = document.getElementById('email-container');
 
 // Function to create and append email elements to the container
 function displayEmails(emails) {
  // Clear the existing content of the container
  container.innerHTML = '';
 
  // Iterate over each email object
  emails.forEach((email) => {
    // Create HTML elements for each email
    const emailDiv = document.createElement('div');
    const subjectHeading = document.createElement('h2');
    const senderPara = document.createElement('p');
    const messagePara = document.createElement('p');
 
    // Set the text content of the elements
    subjectHeading.textContent = email.subject;
    senderPara.textContent = `From: ${email.sender}`;
    messagePara.textContent = email.message;
 
    // Append the elements to the email div
    emailDiv.appendChild(subjectHeading);
    emailDiv.appendChild(senderPara);
    emailDiv.appendChild(messagePara);
 
    // Append the email div to the container
    container.appendChild(emailDiv);
  });
 }