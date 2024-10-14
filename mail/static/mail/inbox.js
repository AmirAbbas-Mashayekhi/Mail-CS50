document.addEventListener("DOMContentLoaded", function () {
  // Use buttons to toggle between views
  document
    .querySelector("#inbox")
    .addEventListener("click", () => load_mailbox("inbox"));
  document
    .querySelector("#sent")
    .addEventListener("click", () => load_mailbox("sent"));
  document
    .querySelector("#archived")
    .addEventListener("click", () => load_mailbox("archive"));
  document.querySelector("#compose").addEventListener("click", compose_email);

  // By default, load the inbox
  load_mailbox("inbox");
});

function compose_email() {
  // Show compose view and hide other views
  document.querySelector("#emails-view").style.display = "none";
  document.querySelector("#compose-view").style.display = "block";

  // Clear form fields
  clearComposeFields();

  // Form
  const composeForm = document.querySelector("#compose-form");
  // Add event listener for submitting the form
  composeForm.onsubmit = (event) => {
    event.preventDefault();
    // Get the submitted data from the form and POST it to the /emails route
    fetch("/emails", {
      method: "POST",
      body: JSON.stringify({
        recipients: document.querySelector("#compose-recipients").value,
        subject: document.querySelector("#compose-subject").value,
        body: document.querySelector("#compose-body").value,
      }),
    })
      .then((response) =>
        response
          .json()
          .then((data) => ({ status: response.status, body: data }))
      )
      .then(({ status, body }) => {
        if (status === 201) {
          load_mailbox("sent");
        } else if (status === 400) {
          clearComposeFields();
          showError(body.error);
        }
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  };
}

function load_mailbox(mailbox) {
  // Show the mailbox and hide other views
  document.querySelector("#emails-view").style.display = "block";
  document.querySelector("#compose-view").style.display = "none";

  // Show the mailbox name
  document.querySelector("#emails-view").innerHTML = `<h3>${
    mailbox.charAt(0).toUpperCase() + mailbox.slice(1)
  }</h3>`;

  // Send GET request to the server to get the list of emails in that mailbox
  fetch(`/emails/${mailbox}`)
    // Convert the response to json
    .then((response) => response.json())
    // For each mail in the response create a UI representation
    .then((emails) => {
      emails.forEach((email) => {
        const emailUI = document.createElement("div");
        emailUI.classList.add("card");
        // --- TODO
        // Get the parent element for these email UI's
        const emailsView = document.querySelector("#emails-view");
        emailsView.appendChild(emailUI);
      });
    });
}

function showError(errorMessage) {
  // Remove previous elements
  removeElementIfExists("#compose-error");

  // Create a div for displaying error messages
  const errorDiv = document.createElement("div");
  errorDiv.id = "compose-error";
  errorDiv.className = "alert alert-danger";
  errorDiv.innerText = errorMessage;

  // Insert the error div above the form or below the "To" input
  const form = document.querySelector("#compose-form");
  form.prepend(errorDiv);
}

function clearComposeFields() {
  // Clear out composition fields
  document.querySelector("#compose-recipients").value = "";
  document.querySelector("#compose-subject").value = "";
  document.querySelector("#compose-body").value = "";
}

function removeElementIfExists(selector) {
  const element = document.querySelector(selector);
  if (element) {
    element.remove();
  }
}
