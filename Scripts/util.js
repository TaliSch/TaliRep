function setAdmin(state) {
    localStorage.setItem("admin", String(state));
}

function resetAdmin(state) {
    if (getAdmin() == null)
        setAdmin(state);
}

function getAdmin() {
    resetAdmin(String(false));
    return Boolean(localStorage.admin);
}