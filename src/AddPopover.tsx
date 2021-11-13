import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Popover from "@material-ui/core/Popover";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

export default function AddPopover(props: any) {
  return (
    <Popover
      open={props.open}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      anchorEl={props.anchorEl}
      onClose={props.onClose}
    >
      <div>
        <InputBase
          onChange={props.onChange}
          placeholder={props.inputPlaceHolder}
        />
        <IconButton>
          <SearchIcon />
        </IconButton>
        <List>
          {props.data.map((item: any) => {
            // if(typeof(item) === "object")
            item = item.name;
            return (
              <ListItem
                key={item}
                onClick={() => props.onItemClick(item, props.selectedUser)}
              >
                <ListItemText id={item} primary={item} />
              </ListItem>
            );
          })}
        </List>
      </div>
    </Popover>
  );
}
