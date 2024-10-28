import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Button,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  IconButton,
} from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useCookies } from "react-cookie"; 

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filter, setFilter] = useState({ type: "name", value: "" });
  const [filterOpen, setFilterOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingUser, setEditingUser] = useState({
    fullName: "",
    address: "",
    phoneNumber: "",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    fullName: "",
    address: "",
    phoneNumber: "",
  });

  const [cookies] = useCookies(['user']); // Access the cookie that stores the username

  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(savedUsers);
  }, []);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewUser({ fullName: "", address: "", phoneNumber: "" });
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    const newUserToAdd = {
      id: users.length > 0 ? Math.max(...users.map((user) => user.id)) + 1 : 1,
      fullName: newUser.fullName,
      address: newUser.address,
      phoneNumber: newUser.phoneNumber,
    };
    const updatedUsers = [...users, newUserToAdd];
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    handleCloseDialog();
  };

  const handleDeleteUser = (id) => {
    const updatedUsers = users.filter((user) => user.id !== id);
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  const handleEditClick = (user) => {
    setEditingUserId(user.id);
    setEditingUser({
      fullName: user.fullName,
      address: user.address,
      phoneNumber: user.phoneNumber,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingUser({ ...editingUser, [name]: value });
  };

  const handleSaveEdit = (id) => {
    const updatedUsers = users.map((user) =>
      user.id === id ? { ...user, ...editingUser } : user
    );
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setEditingUserId(null);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  const handleFilterIconClick = () => {
    setFilterOpen((prev) => !prev);
  };

  const filteredUsers = users.filter((user) => {
    if (filter.value === "") return true;
    switch (filter.type) {
      case "name":
        return user.fullName.toLowerCase().includes(filter.value.toLowerCase());
      case "id":
        return user.id.toString().includes(filter.value);
      case "phone":
        return user.phoneNumber.includes(filter.value);
      case "address":
        return user.address.toLowerCase().includes(filter.value.toLowerCase());
      default:
        return true;
    }
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper>
      <div
        style={{
          margin: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h2 style={{ backgroundColor: "#1976d2", color: "#fff", padding: "10px", borderRadius: "4px" }}>Welcome, {cookies.user || 'Guest'}!</h2> {/* Display the logged-in user or a default message */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <IconButton onClick={handleFilterIconClick} color="primary">
            <FilterListIcon />
          </IconButton>
          {filterOpen && (
            <>
              <FormControl
                variant="outlined"
                style={{ minWidth: 150, marginRight: "10px" }}
              >
                <InputLabel>Filter By</InputLabel>
                <Select
                  value={filter.type}
                  onChange={(e) =>
                    setFilter({ ...filter, type: e.target.value })
                  }
                  label="Filter By"
                >
                  <MenuItem value="id">ID</MenuItem>
                  <MenuItem value="name">Full Name</MenuItem>
                  <MenuItem value="address">Address</MenuItem>
                  <MenuItem value="phone">Phone Number</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Filter"
                variant="outlined"
                name="value"
                value={filter.value}
                onChange={handleFilterChange}
              />
            </>
          )}
        </div>
        <Button variant="contained" color="primary" onClick={handleOpenDialog}>
          Add User
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>
                    {editingUserId === user.id ? (
                      <TextField
                        name="fullName"
                        value={editingUser.fullName}
                        onChange={handleEditChange}
                      />
                    ) : (
                      user.fullName
                    )}
                  </TableCell>
                  <TableCell>
                    {editingUserId === user.id ? (
                      <TextField
                        name="address"
                        value={editingUser.address}
                        onChange={handleEditChange}
                      />
                    ) : (
                      user.address
                    )}
                  </TableCell>
                  <TableCell>
                    {editingUserId === user.id ? (
                      <TextField
                        name="phoneNumber"
                        value={editingUser.phoneNumber}
                        onChange={handleEditChange}
                      />
                    ) : (
                      user.phoneNumber
                    )}
                  </TableCell>
                  <TableCell>
                    {editingUserId === user.id ? (
                      <IconButton
                        onClick={() => handleSaveEdit(user.id)}
                        color="primary"
                      >
                        <SaveIcon />
                      </IconButton>
                    ) : (
                      <>
                        <IconButton
                          onClick={() => handleEditClick(user)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => {if(window.confirm('Are you sure you want to delete data')){handleDeleteUser(user.id)} }}
                          color="secondary"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10]}
        component="div"
        count={filteredUsers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Full Name"
            type="text"
            fullWidth
            value={newUser.fullName}
            onChange={(e) =>
              setNewUser({ ...newUser, fullName: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Address"
            type="text"
            fullWidth
            value={newUser.address}
            onChange={(e) =>
              setNewUser({ ...newUser, address: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Phone Number"
            type="text"
            fullWidth
            value={newUser.phoneNumber}
            onChange={(e) =>
              setNewUser({ ...newUser, phoneNumber: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddUser} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default UserTable;
