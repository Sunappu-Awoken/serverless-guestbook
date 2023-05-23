/**
 * Web application
 */
const apiUrl = 'https://us-south.functions.appdomain.cloud/api/v1/web/ff8f65a9-7213-4413-91f0-f9f3a2f2cd40/guestbook';

const guestbook = {
  // Retrieve the existing guestbook entries
  get() {
    return fetch(`${apiUrl}/read-guestbook-entries-sequence.json`)
      .then(response => response.json())
      .catch(error => {
        console.error('Error:', error);
        throw error;
      });
  },

  // Add a single guestbook entry
  add(name, email, comment) {
    console.log('Sending', name, email, comment);
    return fetch(`${apiUrl}/save-guestbook-entry-sequence.json`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        name,
        email,
        comment,
      }),
    })
      .then(response => response.json())
      .catch(error => {
        console.error('Error:', error);
        throw error;
      });
  },
};

(function () {
  let entriesTemplate;

  function prepareTemplates() {
    entriesTemplate = Handlebars.compile($('#entries-template').html());
  }

  // Retrieve entries and update the UI
  function loadEntries() {
    console.log('Loading entries...');
    $('#entries').html('Loading entries...');
    guestbook
      .get()
      .then(result => {
        if (!result.entries) {
          return;
        }

        const context = {
          entries: result.entries,
        };
        $('#entries').html(entriesTemplate(context));
      })
      .catch(error => {
        $('#entries').html('No entries');
        console.error(error);
      });
  }

  // Intercept the click on the submit button, add the guestbook entry and reload entries on success
  $(document).on('submit', '#addEntry', function (e) {
    e.preventDefault();

    guestbook
      .add(
        $('#name').val().trim(),
        $('#email').val().trim(),
        $('#comment').val().trim()
      )
      .then(result => {
        // Reload entries
        loadEntries();
      })
      .catch(error => {
        console.error(error);
      });
  });

  $(document).ready(function () {
    prepareTemplates();
    loadEntries();
  });
})();
