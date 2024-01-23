import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
  Button,
} from "@nextui-org/react";
import EmojiPicker from "emoji-picker-react";

export default function DropDownEmoji() {
  return (
    <Dropdown>
      <DropdownTrigger>
        d{/* <i class="fa-regular fa-face-smile-wink text-sm"></i> */}
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownSection title={"Actions"}>
            <DropdownItem key={"emojipicker"}>

        <EmojiPicker />
            </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}
