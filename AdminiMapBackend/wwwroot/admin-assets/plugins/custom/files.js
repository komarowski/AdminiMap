
const main = function () {

    // Dropdown functions
    function toggleDropdown() {
        document.getElementById("dropdown-content").classList.toggle("show");
    }

    document.getElementById("dropdown-button").addEventListener("click", function () {
        toggleDropdown();
    });

    window.onclick = function (event) {
        if (!event.target.matches('.dropdown-button')) {
            let element = document.getElementById("dropdown-content");
            if (element.classList.contains('show')) {
                element.classList.remove('show');
            }
        }
    }

    initModalCloseButtons();
    openModal("openNewFileModal", "newFileModal");
    openModal("openNewFolderModal", "newFolderModal");
    openModal("openUploadModal", "uploadModal");
    openEditModal("edit-file", "editModal", "/User/Overlord/Files?handler=EditText");
    openEditModal("rename-file", "renameModal", "/User/Overlord/Files?handler=RenameName");
};

main();