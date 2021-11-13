import React, { useEffect, useState } from "react";
import Chip from "@material-ui/core/Chip";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
// import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import IconButton from "@material-ui/core/IconButton";
import Popover from "@material-ui/core/Popover";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import AddIcon from "@material-ui/icons/Add";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core";
import Axios from "axios";
import AddPopover from "./AddPopover";
// import InviteNewUser from "./InviteNewUser";
// import InviteResponse from "./InviteResponse";
import { InviteResponse, InviteNewUser } from "./Invite";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  chip: {
    margin: 4,
  },
  listItem: {
    alignItems: "start",
  },
  roleBox: {
    display: "flex",
    flexDirection: "column",
  },
}));

export default function UserManager() {
  const classes = useStyles();

  let allRoles = [
    { name: "Admin" },
    { name: "Developer" },
    { name: "Manager" },
  ];
  // let allRoles = ["Admin", "Developer", "Manager"];
  // let allStaffs = ["Modir Mali", "Modir Fanni", "Modir ManabeEnsani"]
  let allStaffs = [
    { name: "Modir Mali", roles: [""] },
    { name: "Modir Fanni", roles: [""] },
    { name: "Modir ManabeEnsani", roles: [""] },
  ];

  // const[users, setUsers] = useState([{name:"Joe",roles:["Admin","Developer"]},{name:"Matthew",roles:["Manager"]}])
  const [users, setUsers] = useState([
    { name: "", roles: [""], staffs: [{ name: "", roles: [""] }] },
  ]);
  const [anchorElRole, setAnchorElRole] = useState(null);
  const [anchorElStaff, setAnchorElStaff] = useState(null);
  const [selectedUser, setSelectedUser] = useState({
    name: "",
    roles: [""],
    staffs: [{ name: "", roles: [""] }],
  });
  const [roles, setRoles] = useState(allRoles);
  const [openModal, setOpenModal] = useState(false);
  const [inviteResponse, setInviteResponse] = useState(null);
  const [staffs, setStaffs] = useState(allStaffs);

  useEffect(() => {
    getUsers();

    Axios.get("/getRoles").then((res) => {
      setRoles(res.data);
      allRoles = res.data;
    });

    Axios.get("/getStaffs").then((res) => {
      setStaffs(res.data);
      allStaffs = res.data;
    });
  }, []);

  function getUsers() {
    Axios.get("/getUsers").then((res) => {
      setUsers(res.data);
    });
  }

  const handleAddRoleClick = (event: any, user: any) => {
    setAnchorElRole(event.currentTarget);
    setSelectedUser(user);
    let filteredRoles = allRoles.filter((role) => !user.roles.includes(role));
    setRoles(filteredRoles);
  };

  const handleRoleDelete = (user: any, role: any) => {
    console.log("Role Deleted", user);
    let newUsers = [...users];
    let targetUser = newUsers.filter((item) => item.name === user.name);
    let index = targetUser[0].roles.indexOf(role);

    Axios.patch(`RemoveRole/${targetUser[0].name}`, index).then(() => {
      getUsers();
    });
  };

  const handleRoleItemClick = (role: string, user: any) => {
    let newUsers = [...users];
    let targetUser = newUsers.filter((item) => item.name === user.name);
    // targetUser[0].roles.push(role);
    setSelectedUser(targetUser[0]);
    // setUsers(newUsers);
    Axios.patch(`/AddRole/${targetUser[0].name}`, {
      user: targetUser[0],
      role: role,
    }).then(() => {
      getUsers();
    });
    setAnchorElRole(null);
  };

  const handleAddStaffClick = (event: any, user: any) => {
    setAnchorElStaff(event.currentTarget);
    setSelectedUser(user);
    let filteredStaffs = allStaffs.filter(
      (staff) => !user.staffs.includes(staff)
    );
    setStaffs(filteredStaffs);
  };

  const handleStaffDelete = (user: any, staff: any) => {
    let newUsers = [...users];
    let targetUser = newUsers.filter((item) => item.name === user.name);
    let index = targetUser[0].staffs.indexOf(staff);

    Axios.patch(`RemoveStaff/${targetUser[0].name}`, index).then(() => {
      getUsers();
    });
  };

  const handleStaffRoleDelete = (user: any, staff: any, role: any) => {
    let newUsers = [...users];
    let targetUser = newUsers.filter((item) => item.name === user.name);
    let index = targetUser[0].staffs.indexOf(staff);
    Axios.patch(`/RemoveStaffRole/${targetUser[0].name}`, {
      role: role,
      index: index,
    }).then(() => {
      getUsers();
    });
  };

  const handleStaffItemClick = (staff: string, user: any) => {
    let newUsers = [...users];
    let targetUser = newUsers.filter((item) => item.name === user.name);
    // targetUser[0].roles.push(role);
    setSelectedUser(targetUser[0]);
    // setUsers(newUsers);
    Axios.patch(`/AddStaff/${targetUser[0].name}`, {
      user: targetUser[0],
      staff: staff,
    }).then(() => {
      getUsers();
    });
    setAnchorElStaff(null);
  };

  const handlePopoverClose = () => {
    setAnchorElRole(null);
    setAnchorElStaff(null);
  };

  const handleSearch = (e: any) => {
    let newRoles = [...allRoles];
    let matchedRoles = newRoles.filter(
      (role) =>
        role.name.toLowerCase().includes(e.currentTarget.value.toLowerCase()) &&
        !selectedUser.roles.includes(role.name)
    );
    setRoles(matchedRoles);
  };

  const handleInviteClick = () => {
    setInviteResponse(null);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleInviteNewUserChange = (newUser: any) => {
    let data = { name: newUser.Username, roles: [], mobile: newUser.Mobile };

    Axios.post("/AddUser", data).then((response) => {
      getUsers();
      console.log("response: ", response);
      setInviteResponse(response.data);
    });
  };

  const handleResponseConfirm = () => {
    setOpenModal(false);
  };

  const openAddRolePopover = Boolean(anchorElRole);
  const openAddStaffPopover = Boolean(anchorElStaff);

  return (
    <div>
      <IconButton onClick={handleInviteClick}>
        <AddIcon />
      </IconButton>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        className={classes.modal}
      >
        <div className={classes.paper}>
          {inviteResponse ? (
            <InviteResponse
              onConfirm={handleResponseConfirm}
              response={inviteResponse}
            />
          ) : (
            <InviteNewUser onChange={handleInviteNewUserChange} />
          )}
        </div>
      </Modal>

      <List>
        {users.map((user: any) => {
          return (
            <ListItem key={user.name} className={classes.listItem}>
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText id={user.name} primary={user.name} />
              <div className={classes.roleBox}>
                <div>
                  {user.roles.map((role: string) => (
                    <Chip
                      key={role}
                      color="primary"
                      onDelete={() => handleRoleDelete(user, role)}
                      label={role}
                      className={classes.chip}
                    />
                  ))}

                  <IconButton onClick={(e) => handleAddRoleClick(e, user)}>
                    <AddCircleIcon />
                  </IconButton>
                </div>
                <div>
                  {user.staffs.map((staff: any) => {
                    let items = [];
                    items.push(
                      <Chip
                        key={staff.name}
                        color="secondary"
                        onDelete={() => handleStaffDelete(user, staff)}
                        label={staff.name}
                        className={classes.chip}
                      />
                    );
                    staff.roles.map((role: any) =>
                      items.push(
                        <Chip
                          key={staff.name + "-" + role}
                          color="primary"
                          onDelete={() =>
                            handleStaffRoleDelete(user, staff, role)
                          }
                          label={role}
                          className={classes.chip}
                        />
                      )
                    );
                    return <div>{items}</div>;
                  })}

                  <IconButton onClick={(e) => handleAddStaffClick(e, user)}>
                    <AddCircleIcon />
                  </IconButton>
                </div>
              </div>
            </ListItem>
          );
        })}

        {/*<Popover open={openAddRolePopover} anchorOrigin={{vertical: 'bottom',horizontal: 'center'}} anchorEl={anchorElRole} onClose={handlePopoverClose}>*/}
        {/*    <div>*/}
        {/*        <InputBase  onChange={handleSearch} placeholder="Role"/>*/}
        {/*        <IconButton>*/}
        {/*            <SearchIcon />*/}
        {/*        </IconButton>*/}
        {/*        <List>*/}
        {/*            {roles.map(role => {*/}
        {/*                return(*/}
        {/*                    <ListItem key={role} onClick={() =>handleRoleItemClick(role, selectedUser)}>*/}
        {/*                        <ListItemText id={role} primary={role} />*/}
        {/*                    </ListItem>*/}
        {/*                )*/}
        {/*            })}*/}
        {/*        </List>*/}
        {/*    </div>*/}
        {/*</Popover>*/}
        {openAddRolePopover ? (
          <AddPopover
            open={openAddRolePopover}
            anchorEl={anchorElRole}
            onClose={handlePopoverClose}
            onChange={handleSearch}
            data={roles}
            inputPlaceHolder="Role"
            onItemClick={handleRoleItemClick}
            selectedUser={selectedUser}
          />
        ) : null}
        {openAddStaffPopover ? (
          <AddPopover
            open={openAddStaffPopover}
            anchorEl={anchorElStaff}
            onClose={handlePopoverClose}
            onChange={handleSearch}
            data={staffs}
            inputPlaceHolder="Staff"
            onItemClick={handleStaffItemClick}
            selectedUser={selectedUser}
          />
        ) : null}
        {/*<Popover open={openAddStaffModal} anchorOrigin={{vertical: 'bottom',horizontal: 'center'}} anchorEl={anchorElStaff} onClose={handlePopoverClose}>*/}
        {/*    <div>*/}
        {/*        <InputBase  onChange={handleSearch} placeholder="Staff"/>*/}
        {/*        <IconButton>*/}
        {/*            <SearchIcon />*/}
        {/*        </IconButton>*/}
        {/*        <List>*/}
        {/*            {staffs.map(staff => {*/}
        {/*                return(*/}
        {/*                    <ListItem key={staff} onClick={() =>handleStaffItemClick(staff, selectedUser)}>*/}
        {/*                        <ListItemText id={staff} primary={staff} />*/}
        {/*                    </ListItem>*/}
        {/*                )*/}
        {/*            })}*/}
        {/*        </List>*/}
        {/*    </div>*/}
        {/*</Popover>*/}
      </List>
    </div>
  );
}
