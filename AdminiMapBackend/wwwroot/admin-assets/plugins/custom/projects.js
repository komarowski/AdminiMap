
const main = function () {
    initModalCloseButtons();
    openModal("openAddModal", "addModal");
    openEditModal("edit-project", "editModal", "/User/Overlord/Projects?handler=Project");
};

main();