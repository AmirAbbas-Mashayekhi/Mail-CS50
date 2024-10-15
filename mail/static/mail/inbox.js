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
  document.querySelector("#email-detail-view").style.display = "none";
  document.querySelector("#compose-view").style.display = "block";

  // Clear out email-detail content
  ClearOutEmailDetail();

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
  document.querySelector("#email-detail-view").style.display = "none";

  // Clear out email-detail content
  ClearOutEmailDetail();

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

        // Miscellaneous
        emailUI.classList.add("btn", "hover-effect");

        // Check if email is read or not (for bg-color)
        if (email.read && mailbox !== "sent") {
          emailUI.classList.add("read-mail");
        }
        // Border
        emailUI.style.borderBottom = "1px solid #dee2e6";

        // Text truncation
        emailUI.style.overflow = "hidden";
        emailUI.style.whiteSpace = "nowrap";
        emailUI.style.textOverflow = "ellipsis";

        // Flex
        emailUI.style.display = "flex";
        emailUI.style.justifyContent = "space-between";
        emailUI.style.height = "40px";
        emailUI.style.paddingTop = "10px";

        // EmailUI Content -> Left side
        if (mailbox === "sent") {
          const emailUILeft = document.createElement("p");
          emailUILeft.innerHTML = `To: <b>${email.recipients}</b>`;
          emailUI.appendChild(emailUILeft);
        } else {
          const emailUILeft = document.createElement("p");
          emailUILeft.innerHTML = `From: <b>${email.sender}</b>`;
          emailUI.appendChild(emailUILeft);
        }
        // EmailUI Content -> Center
        const emailUICenter = document.createElement("p");
        emailUICenter.innerHTML = email.subject;
        emailUI.appendChild(emailUICenter);

        // EmailUI Content -> Right side
        const emailUIRight = document.createElement("p");
        emailUIRight.classList.add("small");
        emailUIRight.style.opacity = "50%";
        emailUIRight.innerHTML = email.timestamp;
        emailUI.appendChild(emailUIRight);

        // Get the parent element for these email UI's
        const emailsView = document.querySelector("#emails-view");
        emailsView.appendChild(emailUI);

        // Event handler for clicking on a mail
        emailUI.addEventListener("click", () => showEmailDetail(email));
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

function showEmailDetail(email) {
  // Hide other components
  document.querySelector("#emails-view").style.display = "none";
  document.querySelector("#compose-view").style.display = "none";
  document.querySelector("#email-detail-view").style.display = "block";
  // Clear out email-detail content
  ClearOutEmailDetail();

  // Check email as read
  fetch(`/emails/${email.id}`, {
    method: "PUT",
    body: JSON.stringify({
      read: true,
    }),
  });

  // Make HTTP Request
  fetch(`/emails/${email.id}`)
    .then((response) => response.json())
    .then((email) => {
      // Create email detail UI in email-detail-view div
      const emailDetailParent = document.querySelector("#email-detail-view");
      const emailDetailUI = document.createElement("div");
      emailDetailUI.id = "email-detail";

      // Creating components for the email detail
      const sender = document.createElement("p");
      const recipients = document.createElement("p");
      const subject = document.createElement("p");
      const timestamp = document.createElement("p");
      const body = document.createElement("p");

      // Modifying the HTML content for the components
      sender.innerHTML = `<b>From:</b> ${email.sender}`;
      recipients.innerHTML = `<b>To:</b> ${email.recipients}`;
      subject.innerHTML = `<b>Subject:</b> ${email.subject}`;
      timestamp.innerHTML = `<b>Timestamp:</b> ${email.timestamp} <hr>`;
      body.innerHTML = email.body;

      // Adding children
      emailDetailUI.appendChild(sender);
      emailDetailUI.appendChild(recipients);
      emailDetailUI.appendChild(subject);
      emailDetailUI.appendChild(timestamp);

      emailDetailParent.appendChild(emailDetailUI);
      emailDetailParent.appendChild(body);
    });
}

function ClearOutEmailDetail() {
  const emailDetail = document.querySelector("#email-detail-view");
  if (emailDetail) {
    emailDetail.innerHTML = "";
  }
}
