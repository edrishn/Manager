import React, { useEffect, useState } from "react";
import {Chip, List, ListItem, ListItemIcon, ListItemText, IconButton, InputBase, Modal, Card, CardContent, Popover} from "@material-ui/core";
import {AccountCircleIcon, AddCircleIcon, RemoveCircleOutlineIcon, SearchIcon,AddIcon} from "./Icons";
// import ListItemAvatar from "@material-ui/core/ListItemAvatar";
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
    justifyContent: "center"
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  },
  chip: {
    margin: 4
  },
  listItem: {
    alignItems: "start"
  },
  listItemText: {
    maxWidth: 250
  },
  roleBox: {
    display: "flex",
    flexDirection: "column"
  }
}));
let database = {
  Role: [
    { Name: "Manager" },
    { Name: "Developer" },
    { Name: "Admin" },
    { Name: "Designer" },
    { Name: "Tester" }
  ],
  User: [
    {
      ID: 1,
      Name: "Joe",
      Roles: ["Admin", "Developer"],
      Staffs: ["Modir Fanni"],
      DeniedRoles: [],
      Mobile: "09351234567"
    },
    {
      ID: 2,
      Name: "Matthew",
      Roles: ["Manager"],
      Staffs: ["Modir Mali"],
      DeniedRoles: ["Admin"],
      Mobile: "09371234567"
    }
  ],
  Staff: [
    { ID: 1, Name: "Modir Mali", Roles: ["Admin", "Tester"] },
    { ID: 2, Name: "Modir Fanni", Roles: ["Tester", "Manager"] },
    { ID: 3, Name: "Modir ManabeEnsani", Roles: ["Admin", "Manager"] }
  ]
};

export default function UserManager() {
  let serverURL = "https://cu6by.sse.codesandbox.io";
  

  const classes = useStyles();

  useEffect(() => {
    Axios.post(`${serverURL}/Reset`, database).then((res) => {
      console.log("Reset");
      Axios.get(`${serverURL}/GetUsers`).then((res) => {
        console.log(res);
        setAllUsers(res.data);
        setUsers(res.data);
        Axios.get(`${serverURL}/GetRoles`).then((res) => {
          setRoles(res.data);
          setAllRoles(res.data);
          setLoadAddRole(true);
          Axios.get(`${serverURL}/GetStaffs`).then((res) => {
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
      (role: any) => !user.Roles.includes(role)
    );
    setRoles(filteredRoles);
  };

  const handleRoleDelete = (user: any, role: any) => {
    let newUsers = [...users];
    let targetUser = newUsers.find((item) => item.ID === user.ID);
    let targetUserIndex = newUsers.findIndex((item) => item.ID === user.ID);
    let roleIndex = targetUser.Roles.indexOf(role);
    targetUser.Roles.splice(roleIndex, 1);
    newUsers.splice(targetUserIndex, 1);
    newUsers.push(targetUser);

    Axios.put(`${serverURL}/RemoveUserRole?id=${user.ID}&role=${role}`).then(
      () => {
        setUsers(newUsers);
      }
    );
  };

  const handleRoleItemClick = (role: string, user: any) => {
    let newUsers = [...users];
    let targetUser = newUsers.find((item) => item.ID === user.ID);
    let targetUserIndex = newUsers.findIndex((item) => item.ID === user.ID);
    targetUser.Roles.push(role);
    newUsers.splice(targetUserIndex, 1);
    newUsers.push(targetUser);
    Axios.post(`${serverURL}/AddUserRole?id=${user.ID}&role=${role}`).then(
      () => {
        setUsers(newUsers);
        setSelectedUser(targetUser);
        setAnchorElRole(null);
      }
    );
  };

  const handleAddStaffClick = (event: any, user: any) => {
    setAnchorElStaff(event.currentTarget);
    setSelectedUser(user);
    let filteredStaffs = allStaffs.filter(
      (staff: any) => !user.Staffs.includes(staff.Name)
    );
    setStaffs(filteredStaffs);
  };

  const handleStaffDelete = (user: any, staff: string) => {
    let newUsers = [...users];
    let newStaffs = [...allStaffs];
    let targetStaff = newStaffs.find((item) => item.Name === staff);
    let targetUser = newUsers.find((item) => item.ID === user.ID);
    let targetUserIndex = newUsers.findIndex((item) => item.ID === user.ID);
    let staffIndex = targetUser.Staffs.indexOf(staff);
    targetUser.Staffs.splice(staffIndex, 1);
    newUsers.splice(targetUserIndex, 1);
    newUsers.push(targetUser);
    Axios.put(
      `${serverURL}/RemoveUserStaff?id=${user.ID}&staffId=${targetStaff.ID}`
    ).then(() => {
      setUsers(newUsers);
    });
  };

  const handleDenyStaffRole = (user: any, staff: string, role: string) => {
    let newUsers = [...users];
    let newStaffs = [...allStaffs];
    let targetStaff = newStaffs.find((item) => item.Name === staff);
    let targetUser = newUsers.find((item) => item.ID === user.ID);
    let targetUserIndex = newUsers.findIndex(
      (item) => item.ID === targetUser.ID
    );

    targetUser.DeniedRoles.push(role);
    newUsers.splice(targetUserIndex, 1);
    newUsers.push(targetUser);

    Axios.put(
      `${serverURL}/DenyStaffRole?id=${user.ID}&staffId=${targetStaff.ID}&role=${role}`
    ).then(() => {
      setUsers(newUsers);
    });
  };

  const handleAllowStaffRole = (user: any, staff: string, role: string) => {
    let newUsers = [...users];
    let newStaffs = [...allStaffs];
    let targetStaff = newStaffs.find((item) => item.Name === staff);
    let targetUser = newUsers.find((item) => item.ID === user.ID);
    let targetUserIndex = newUsers.findIndex(
      (item) => item.ID === targetUser.ID
    );
    let deniedRoleIndex = targetUser.DeniedRoles.findIndex(
      (item: any) => item === role
    );
    targetUser.DeniedRoles.splice(deniedRoleIndex, 1);
    newUsers.splice(targetUserIndex, 1);
    newUsers.push(targetUser);

    Axios.post(
      `${serverURL}/AllowStaffRole?id=${user.ID}&staffId=${targetStaff.ID}&role=${role}`
    ).then(() => {
      setUsers(newUsers);
    });
  };

  const handleStaffItemClick = (staff: string, user: any) => {
    let newUsers = [...users];
    let targetUser = newUsers.find((item) => item.ID === user.ID);
    let targetUserIndex = newUsers.findIndex((item) => item.ID === user.ID);
    let targetStaff = allStaffs.find((item: any) => item.Name === staff);
    targetUser.Staffs.push(staff);
    newUsers.splice(targetUserIndex, 1);
    newUsers.push(targetUser);
    Axios.post(
      `${serverURL}/AddUserStaff?id=${user.ID}&staffId=${targetStaff.ID}`
    ).then(() => {
      setSelectedUser(targetUser[0]);
      setUsers(newUsers);
      setAnchorElStaff(null);
    });
  };

  const handlePopoverClose = () => {
    setAnchorElRole(null);
    setAnchorElStaff(null);
  };

  const handleSearchRole = (e: any) => {
    let newRoles = [...allRoles];
    let matchedRoles = newRoles.filter(
      (role: any) =>
        role.Name.toLowerCase().includes(e.currentTarget.value.toLowerCase()) &&
        !selectedUser.Roles.includes(role.Name)
    );
    setRoles(matchedRoles);
  };

  const handleSearchStaff = (e: any) => {
    let newStaffs = [...allStaffs];
    let matchedStaffs = newStaffs.filter(
      (staff: any) =>
        staff.Name.toLowerCase().includes(
          e.currentTarget.value.toLowerCase()
        ) && !selectedUser.Staffs.find((item: any) => item === staff.Name)
    );
    setStaffs(matchedStaffs);
  };

  const handleSearchUser = (e: any) => {
    let newUsers = [...allUsers];
    let matchedUsers = newUsers.filter((user: any) =>
      user.Name.toLowerCase().includes(e.currentTarget.value.toLowerCase())
    );
    setUsers(matchedUsers);
  };

  const handleInviteClick = () => {
    setInviteResponse(null);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleInviteNewUserChange = (newUser: any) => {
    let data = { Name: newUser.UserName, Mobile: newUser.Mobile };

    Axios.post(`${serverURL}/AddUser`, data).then((response) => {
      let addedUser = {
        ID: response.data.ID,
        Name: newUser.UserName,
        Roles: [],
        Staffs: [],
        DeniedRoles: [],
        Mobile: newUser.Mobile
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
        <InputBase placeholder="Search for User" onChange={handleSearchUser} />
        <IconButton>
          <SearchIcon />
        </IconButton>
        {users.map((user: any) => {
          return (
            <Card>
              <CardContent>
                <ListItem key={user.Name} className={classes.listItem}>
                  <ListItemIcon>
                    <AccountCircleIcon />
                  </ListItemIcon>
                  <ListItemText
                    id={user.Name}
                    primary={user.Name}
                    className={classes.listItemText}
                  />
                  <div className={classes.roleBox}>
                    <div>
                      {user.Roles.map((role: string) => (
                        <Chip
                          key={role}
                          color="primary"
                          onDelete={() => handleRoleDelete(user, role)}
                          label={role}
                          className={classes.chip}
                        />
                      ))}

                      {loadAddRole && (
                        <IconButton
                          onClick={(e) => handleAddRoleClick(e, user)}
                        >
                          <AddCircleIcon />
                        </IconButton>
                      )}
                    </div>
                    <div>
                      {user.Staffs.map((staff: string) => {
                        let newStaffs = [...allStaffs];
                        let targetStaff = newStaffs.find(
                          (item) => item.Name === staff
                        );
                        let items = [];
                        items.push(
                          <Chip
                            key={staff}
                            color="secondary"
                            onDelete={() => handleStaffDelete(user, staff)}
                            label={staff}
                            className={classes.chip}
                          />
                        );
                        targetStaff &&
                          targetStaff.Roles.map((role: any) => {
                            let deny = false;
                            if (user.DeniedRoles.includes(role)) deny = true;

                            items.push(
                              <Chip
                                key={staff + "-" + role}
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
                        <IconButton
                          onClick={(e) => handleAddStaffClick(e, user)}
                        >
                          <AddCircleIcon />
                        </IconButton>
                      )}
                    </div>
                  </div>
                </ListItem>
              </CardContent>
            </Card>
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
