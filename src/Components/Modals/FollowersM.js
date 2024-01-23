import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import UserIds from "../UserIds";

export default function FollowersM({ text, users, type, setIsGetUserClicked, followersLoading}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  
  return (
    <div className="flex flex-col gap-2  ">
      <button onClick={()=>{
        setIsGetUserClicked(true)
        onOpen();
      }}>{text}</button>
      <Modal
        isOpen={isOpen}
        backdrop="blur"
        placement="top"
        onOpenChange={()=>{
          onOpenChange()
        }
        }
        scrollBehavior={"inside"}
      >
        <ModalContent className="bg-white dark:bg-[#151515] dark:text-white text-black">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-4 ">
              {followersLoading ? "Loading..." : type}
              {!followersLoading &&
              <form
                  className="w-full flex items-center justify-between p-2 border-2 border-slate-700 rounded-lg"
                  //   onSubmit={handleUserSearch}
                >
                  <input
                    type="text"
                    className="bg-transparent outline-none w-full h-full"
                    placeholder="Currently Disabled"
                    disabled
                    // value={searchInput}
                    // onChange={handleUserSearch}
                  />
                  <button className="p-2" type="submit">
                    <svg
                      className="w-4 h-4 text-gray-400 dark:text-gray-300"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                      />
                    </svg>
                  </button>
                </form>}
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4 pb-4">
                {users?.length === 0 && "Nothing here"}
                  {users?.map((user) => {
                    return (
                      <UserIds
                        user={user}
                        key={user?.username}
                      />
                    );
                  })}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
