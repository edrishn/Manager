import { createServer, Model } from "miragejs";

export default function startServer() {
  let mirageServer = createServer({
    models: {
      user: Model,
      role: Model,
      staff: Model,
    },

    routes() {
      // let id = 20;
      let database = {
        Role: [{ name: "Manager" }, { name: "Developer" }, { name: "Admin" }],
        User: [
          {
            name: "Joe",
            roles: ["Admin", "Developer"],
            staffs: [{ name: "Modir Fanni", roles: ["role1", "role3"] }],
          },
          {
            name: "Matthew",
            roles: ["Manager"],
            staffs: [{ name: "Modir Mali", roles: ["role1", "role2"] }],
          },
        ],
        Staff: [
          { name: "Modir Mali", roles: ["role1", "role2"] },
          { name: "Modir Fanni", roles: ["role1", "role3"] },
          { name: "Modir ManabeEnsani", roles: ["role2", "role4"] },
        ],
      };
      // let database = {"Role":[{name: "Manager"},{name: "Developer"}, {name: "Admin"}], "User":[{name: "Joe", roles:["Admin","Developer"], staffs:["Modir Fanni"]}, {name:"Matthew", roles:["Manager"], staffs:["Modir Mali"]}], "Staff":[{name: "Modir Mali"},{name: "Modir Fanni"},{name: "Modir ManabeEnsani"}]}
      let databaseExist = localStorage.getItem("Database");
      if (!databaseExist) {
        localStorage.setItem("Database", JSON.stringify(database));
      }

      function DbToLocalStorage(schema) {
        let keys = Object.keys(schema);
        let keysFiltered = keys.filter(
          (key) =>
            key !== "isSaving" &&
            key !== "_registry" &&
            key !== "_dependentAssociations" &&
            key !== "db"
        );

        let finalKeys = [];
        keysFiltered.map((key) => {
          let camelize = schema[key].camelizedModelName;
          let upperFirstLetter =
            camelize.charAt(0).toUpperCase() + camelize.slice(1);
          finalKeys.push(upperFirstLetter);
        });

        let objFromDbForLS = {};
        for (let i = 0; i < finalKeys.length; i++) {
          let arry = [];
          schema.db[keysFiltered[i]].map((item) => arry.push(item));
          objFromDbForLS[finalKeys[i]] = arry;
        }
        localStorage.setItem("Database", JSON.stringify(objFromDbForLS));
      }

      this.get("/getUsers", (schema) => {
        return schema.users.all().models;
      });

      this.get("/getRoles", (schema) => {
        return schema.roles.all().models;
      });

      this.get("/getStaffs", (schema) => {
        return schema.staffs.all().models;
      });

      // this.get("/getStaffRoles/:name", (schema, request) => {
      //     let staffName = request.params.name;
      //     return schema.staffs.findBy({name:staffName}).roles;
      // })

      this.patch("/RemoveStaffRole/:name", (schema, request) => {
        let name = request.params.name;
        let attrs = JSON.parse(request.requestBody);
        let targetUser = schema.users.findBy({ name: name });
        let staffRoleIndex = targetUser.staffs[attrs.index].roles.indexOf(
          attrs.role
        );

        targetUser.staffs[attrs.index].roles.splice(staffRoleIndex, 1);
        schema.users.findBy({ name: name }).update(targetUser.attrs);
        DbToLocalStorage(schema);
      });

      this.patch("/AddStaff/:name", (schema, request) => {
        let name = request.params.name;
        let attrs = JSON.parse(request.requestBody);
        let newStaff = schema.staffs.findBy({ name: attrs.staff });
        attrs.user.staffs.push(newStaff);
        schema.users.findBy({ name: name }).update(attrs.user);
        DbToLocalStorage(schema);
      });

      this.patch("/RemoveStaff/:name", (schema, request) => {
        let name = request.params.name;
        let staffIndex = request.requestBody;
        let targetUser = schema.users.findBy({ name: name });
        targetUser.staffs.splice(staffIndex, 1);
        schema.users.findBy({ name: name }).update(targetUser.attrs);
        DbToLocalStorage(schema);
      });

      this.patch("/AddRole/:name", (schema, request) => {
        let name = request.params.name;
        let attrs = JSON.parse(request.requestBody);

        attrs.user.roles.push(attrs.role);
        schema.users.findBy({ name: name }).update(attrs.user);
        DbToLocalStorage(schema);
      });

      this.patch("/RemoveRole/:name", (schema, request) => {
        let name = request.params.name;
        let roleIndex = request.requestBody;
        let targetUser = schema.users.findBy({ name: name });
        targetUser.roles.splice(roleIndex, 1);
        schema.users.findBy({ name: name }).update(targetUser.attrs);
        DbToLocalStorage(schema);
      });

      this.post("/AddUser", (schema, request) => {
        let newUser = JSON.parse(request.requestBody);
        schema.users.create(newUser);
        DbToLocalStorage(schema);
        // let response = {LoginLink: "", Message:"Invited Successfully"}
        if (newUser.mobile.startsWith("0935")) {
          return { LoginLink: "https://google.com", Message: "" };
        } else if (newUser.mobile.startsWith("0912"))
          return { LoginLink: "", Message: "Invited Successfully" };

        // return response
      });
    },

    seeds(server) {
      let getDb = localStorage.getItem("Database");
      let getDbParsed = JSON.parse(getDb);
      Object.keys(getDbParsed).forEach((key) => {
        getDbParsed[key].forEach((item) => {
          server.create(key.toLowerCase(), item);
        });
      });
    },
  });
}
