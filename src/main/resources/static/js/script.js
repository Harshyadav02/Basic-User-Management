document.addEventListener('DOMContentLoaded', () => {
    loadUsers();

    document.getElementById('userForm').addEventListener('submit', saveUser);
    document.getElementById('cancelEdit').addEventListener('click', resetForm);
});

async function loadUsers() {
    const response = await fetch('/api/users');
    const users = await response.json();
    const tableBody = document.getElementById('userTableBody');
    tableBody.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editUser(${user.id})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

async function saveUser(event) {
    event.preventDefault();

    const id = document.getElementById('userId').value;
    const user = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value
    };

    const url = id ? `/api/users/${id}` : '/api/users';
    const method = id ? 'PUT' : 'POST';

    await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    });

    resetForm();
    loadUsers();
}

async function editUser(id) {
    const response = await fetch(`/api/users/${id}`);
    const user = await response.json();

    document.getElementById('userId').value = user.id;
    document.getElementById('name').value = user.name;
    document.getElementById('email').value = user.email;
    document.getElementById('formTitle').textContent = 'Edit User';
    document.getElementById('cancelEdit').style.display = 'inline-block';
}

async function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        await fetch(`/api/users/${id}`, { method: 'DELETE' });
        loadUsers();
    }
}

function resetForm() {
    document.getElementById('userForm').reset();
    document.getElementById('userId').value = '';
    document.getElementById('formTitle').textContent = 'Add User';
    document.getElementById('cancelEdit').style.display = 'none';
}