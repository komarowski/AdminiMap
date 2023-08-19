
const main = function() {
    initModalCloseButtons();
    openModal("openAddModal", "addModal");
    openEditModal("edit-user", "editModal", "/User/Overlord/Users?handler=User");
};

main();