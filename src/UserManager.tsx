import React, { useEffect, useState } from "react";
import Chip from "@material-ui/core/Chip";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
// import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
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
  listItemText: {
    maxWidth: 250,
  },
  roleBox: {
    display: "flex",
    flexDirection: "column",
  },
}));

export default function UserManager() {
  const classes = useStyles();

  useEffect(() => {
    Axios.get("/Reset").then((res) => {
      console.log("Reset");
      Axios.get("/GetUsers").then((res) => {
        setAllUsers(res.data);
        setUsers(res.data);
        Axios.get("/GetRoles").then((res) => {
          setRoles(res.data);
          setAllRoles(res.data);
          setLoadAddRole(true);
          Axios.get("/GetStaffs").then((res) => {
            setStaffs(res.data);
            setLoadAddStaff(true);
            setAllStaffs(res.data);
          });
        });
      });
    });
  }, []);

  const [users, setUsers] = useState([] as any);
  const [allUsers, setAllUsers] = useState([] as any);
  const [anchorElRole, setAnchorElRole] = useState(null);
  const [anchorElStaff, setAnchorElStaff] = useState(null);
  const [selectedUser, setSelectedUser] = useState({} as any);
  const [roles, setRoles] = useState([] as any);
  const [allRoles, setAllRoles] = useState([] as any);
  const [openModal, setOpenModal] = useState(false);
  const [inviteResponse, setInviteResponse] = useState(null);
  const [staffs, setStaffs] = useState([] as any);
  const [allStaffs, setAllStaffs] = useState([] as any);
  const [loadAddRole, setLoadAddRole] = useState(false);
  const [loadAddStaff, setLoadAddStaff] = useState(false);

  const handleAddRoleClick = (event: any, user: any) => {
    setAnchorElRole(event.currentTarget);
    setSelectedUser(user);
    let filteredRoles = allRoles.filter(
      (role: any) => !user.roles.includes(role)
    );
    setRoles(filteredRoles);
  };

  const handleRoleDelete = (user: any, role: any) => {
    let newUsers = [...users];
    let targetUser = newUsers.find((item) => item.id === user.id);
    let targetUserIndex = newUsers.findIndex((item) => item.id === user.id);
    let roleIndex = targetUser.roles.indexOf(role);
    targetUser.roles.splice(roleIndex, 1);
    newUsers.splice(targetUserIndex, 1);
    newUsers.push(targetUser);

    Axios.put(`/RemoveUserRole?id=${user.id}&role=${role}`).then(() => {
      setUsers(newUsers);
    });
  };

  const handleRoleItemClick = (role: string, user: any) => {
    let newUsers = [...users];
    let targetUser = newUsers.find((item) => item.id === user.id);
    let targetUserIndex = newUsers.findIndex((item) => item.id === user.id);
    targetUser.roles.push(role);
    newUsers.splice(targetUserIndex, 1);
    newUsers.push(targetUser);
    Axios.post(`/AddUserRole?id=${user.id}&role=${role}`).then(() => {
      setUsers(newUsers);
      setSelectedUser(targetUser);
      setAnchorElRole(null);
    });
  };

  const handleAddStaffClick = (event: any, user: any) => {
    setAnchorElStaff(event.currentTarget);
    setSelectedUser(user);
    let filteredStaffs = allStaffs.filter(
      (staff: any) => !user.staffs.includes(staff)
    );
    setStaffs(filteredStaffs);
  };

  const handleStaffDelete = (user: any, staff: any) => {
    let newUsers = [...users];
    let targetUser = newUsers.find((item) => item.id === user.id);
    let targetUserIndex = newUsers.findIndex((item) => item.id === user.id);
    let staffIndex = targetUser.staffs.indexOf(staff);
    targetUser.staffs.splice(staffIndex, 1);
    newUsers.splice(targetUserIndex, 1);
    newUsers.push(targetUser);
    Axios.put(`/RemoveUserStaff?id=${user.id}&staffId=${staff.id}`).then(() => {
      setUsers(newUsers);
    });
  };

  const handleDenyStaffRole = (user: any, staff: any, role: any) => {
    let newUsers = [...users];
    let targetUser = newUsers.find((item) => item.id === user.id);
    let targetUserIndex = newUsers.findIndex(
      (item) => item.id === targetUser.id
    );

    targetUser.deniedRoles.push(role);
    newUsers.splice(targetUserIndex, 1);
    newUsers.push(targetUser);

    Axios.put(
      `/DenyStaffRole?id=${user.id}&staffId=${staff.id}&role=${role}`
    ).then(() => {
      setUsers(newUsers);
    });
  };

  const handleAllowStaffRole = (user: any, staff: any, role: any) => {
    let newUsers = [...users];
    let targetUser = newUsers.find((item) => item.id === user.id);
    let targetUserIndex = newUsers.findIndex(
      (item) => item.id === targetUser.id
    );
    let deniedRoleIndex = targetUser.deniedRoles.findIndex(
      (item: any) => item === role
    );
    targetUser.deniedRoles.splice(deniedRoleIndex, 1);
    newUsers.splice(targetUserIndex, 1);
    newUsers.push(targetUser);

    Axios.post(
      `/AllowStaffRole?id=${user.id}&staffId=${staff.id}&role=${role}`
    ).then(() => {
      setUsers(newUsers);
    });
  };

  const handleStaffItemClick = (staff: string, user: any) => {
    let newUsers = [...users];
    let targetUser = newUsers.find((item) => item.id === user.id);
    let targetUserIndex = newUsers.findIndex((item) => item.id === user.id);
    let targetStaff = allStaffs.find((item: any) => item.name === staff);
    targetUser.staffs.push(targetStaff);
    newUsers.splice(targetUserIndex, 1);
    newUsers.push(targetUser);
    Axios.post(`/AddUserStaff?id=${user.id}&staffId=${targetStaff!.id}`).then(
      () => {
        setSelectedUser(targetUser[0]);
        setUsers(newUsers);
        setAnchorElStaff(null);
      }
    );
  };

  const handlePopoverClose = () => {
    setAnchorElRole(null);
    setAnchorElStaff(null);
  };

  const handleSearchRole = (e: any) => {
    let newRoles = [...allRoles];
    let matchedRoles = newRoles.filter(
      (role: any) =>
        role.name.toLowerCase().includes(e.currentTarget.value.toLowerCase()) &&
        !selectedUser.roles.includes(role.name)
    );
    setRoles(matchedRoles);
  };

  const handleSearchStaff = (e: any) => {
    let newStaffs = [...allStaffs];
    let matchedStaffs = newStaffs.filter(
      (staff: any) =>
        staff.name
          .toLowerCase()
          .includes(e.currentTarget.value.toLowerCase()) &&
        !selectedUser.staffs.find((item: any) => item.id === staff.id)
    );
    setStaffs(matchedStaffs);
  };

  const handleInviteClick = () => {
    setInviteResponse(null);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleInviteNewUserChange = (newUser: any) => {
    let data = { name: newUser.Username, mobile: newUser.Mobile };

    Axios.post("/AddUser", data).then((response) => {
      let addedUser = {
        id: response.data.id,
        name: newUser.Username,
        roles: [],
        staffs: [],
        mobile: newUser.Mobile,
      };
      let newUsers = [...users];
      newUsers.push(addedUser);
      setUsers(newUsers);
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
              <ListItemText
                id={user.name}
                primary={user.name}
                className={classes.listItemText}
              />
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

                  {loadAddRole && (
                    <IconButton onClick={(e) => handleAddRoleClick(e, user)}>
                      <AddCircleIcon />
                    </IconButton>
                  )}
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
                    staff.roles.map((role: any) => {
                      let deny = false;
                      if (user.deniedRoles.includes(role)) deny = true;

                      items.push(
                        <Chip
                          key={staff.name + "-" + role}
                          color={deny ? undefined : "primary"}
                          deleteIcon={
                            deny ? (
                              <AddCircleIcon />
                            ) : (
                              <RemoveCircleOutlineIcon />
                            )
                          }
                          onDelete={() =>
                            deny
                              ? handleAllowStaffRole(user, staff, role)
                              : handleDenyStaffRole(user, staff, role)
                          }
                          label={role}
                          className={classes.chip}
                        />
                      );
                    });
                    return <div>{items}</div>;
                  })}

                  {loadAddStaff && (
                    <IconButton onClick={(e) => handleAddStaffClick(e, user)}>
                      <AddCircleIcon />
                    </IconButton>
                  )}
                </div>
              </div>
            </ListItem>
          );
        })}

        {openAddRolePopover ? (
          <AddPopover
            open={openAddRolePopover}
            anchorEl={anchorElRole}
            onClose={handlePopoverClose}
            onChange={handleSearchRole}
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
            onChange={handleSearchStaff}
            data={staffs}
            inputPlaceHolder="Staff"
            onItemClick={handleStaffItemClick}
            selectedUser={selectedUser}
          />
        ) : null}
      </List>
    </div>
  );
}
