const manage_queue = document.getElementById("manage-queue");
manage_queue.addEventListener("click", () => {
    let id = window.location.pathname.split("/")[3];
    window.location = `/me/servers/${id}/player`;
});