import React from "react";
import {IconButton, Popover, InputBase, List, ListItem, ListItemText} from "@material-ui/core";
import {SearchIcon} from "./Icons";

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
            item = item.Name;
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
