self.addEventListener("push", (event) => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: data.icon,
  });

  // Send a message to update notification count
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => client.postMessage("new-notification"));
  });
});
