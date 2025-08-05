// components/UserManagement.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  Grid,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  addUser,
  updateUser,
  deleteUser,
} from "../redux/userSlice";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import AddIcon from "@mui/icons-material/Add";

const UserManagement = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.users);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [sort, setSort] = useState({ key: "", direction: "" });
  const [editing, setEditing] = useState(false);
  const [initialValues, setInitialValues] = useState({
    id: "",
    name: "",
    email: "",
    company: { name: "" },
  });

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    company: Yup.object({
      name: Yup.string().required("Company name is required"),
    }),
  });

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleOpen = (user = null) => {
    if (user) {
      setInitialValues(user);
      setEditing(true);
    } else {
      setInitialValues({
        id: Date.now(),
        name: "",
        email: "",
        company: { name: "" },
      });
      setEditing(false);
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const getValue = (obj, path) => {
    return path.split(".").reduce((value, key) => value?.[key], obj);
  };

  const paginatedUsers = [...list].sort((a, b) => {
    const aValue = getValue(a, sort.key);
    const bValue = getValue(b, sort.key);

    if (aValue < bValue) return sort.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sort.direction === "asc" ? 1 : -1;
    return 0;
  });

  const filteredUsers = paginatedUsers.filter((user) =>
    user.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  const sortedData = filteredUsers.slice((page - 1) * 5, page * 5);

  const handleSort = (key) => {
    let direction = "asc";
    if (sort.key === key && sort.direction === "asc") {
      direction = "desc";
    }
    setSort({ key, direction });
  };

  return (
    <Box>
      <h2 component="h3">User List</h2>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
      >
        <TextField
          label="Search by Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: "300px" }}
          size="small"
        />
        <Button variant="contained" onClick={() => handleOpen(null)}>
          {<AddIcon />}Add User
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell onClick={() => handleSort("name")}>
                Name{" "}
                {sort.key === "name"
                  ? sort.direction === "asc"
                    ? "↑"
                    : "↓"
                  : ""}
              </TableCell>
              <TableCell onClick={() => handleSort("email")}>
                Email
                {sort.key === "email"
                  ? sort.direction === "asc"
                    ? "↑"
                    : "↓"
                  : ""}
              </TableCell>
              <TableCell onClick={() => handleSort("company.name")}>
                Company
                {sort.key === "company.name"
                  ? sort.direction === "asc"
                    ? "↑"
                    : "↓"
                  : ""}
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.company.name}</TableCell>
                <TableCell>
                  <EditIcon
                    color="primary"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleOpen(user)}
                  />
                  &nbsp;
                  <DeleteForeverIcon
                    color="warning"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      Swal.fire({
                        title: "Are you sure?",
                        text: "This action cannot be undone!",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#d33",
                        cancelButtonColor: "#3085d6",
                        confirmButtonText: "Yes, delete it!",
                      }).then((result) => {
                        if (result.isConfirmed) {
                          console.log("Deleting item with ID:", user.id);
                          dispatch(deleteUser(user.id));
                          Swal.fire(
                            "Deleted!",
                            "The item has been deleted.",
                            "success"
                          );
                        }
                      });
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
            {sortedData.length <= 0 && (
              <TableCell colSpan={5} align="center">
                No Data Found
              </TableCell>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="flex-end">
        <Pagination
          count={Math.ceil(filteredUsers.length / 5)}
          page={page}
          onChange={(e, val) => setPage(val)}
          sx={{ mt: 2 }}
        />
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editing ? "Edit User" : "Add User"}</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              if (editing) {
                dispatch(updateUser(values));
              } else {
                dispatch(addUser(values));
              }
              handleClose();
            }}
            enableReinitialize
          >
            {({ errors, touched, handleChange, handleBlur, values }) => (
              <Form>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Name"
                  name="name"
                  value={values?.name}
                  onBlur={handleBlur}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Email"
                  name="email"
                  value={values?.email}
                  onBlur={handleBlur}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Company Name"
                  name="company.name"
                  value={values?.company?.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    touched?.company?.name && Boolean(errors?.company?.name)
                  }
                  helperText={touched?.company?.name && errors?.company?.name}
                />
                <Box display={"flex"} justifyContent={"flex-end"} gap={"10px"}>
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button type="submit" variant="contained">
                    {editing ? "Update" : "Add"}
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
