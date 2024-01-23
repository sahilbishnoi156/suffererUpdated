import React from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
  Button,
} from "@nextui-org/react";

export default function CommentInfoM({ comment, user, handleDelete }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <button onClick={() => onOpen()}>
        <i className="fa-solid fa-ellipsis "></i>
      </button>
      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
      >
        <ModalContent
          className={`bg-white dark:bg-[#151515] dark:text-white text-black `}
        >
          {(onClose) => (
            <>
              <ModalBody className="flex flex-col items-center justify-center  w-full px-0">
                {comment?.creator?._id === user?._id && (
                  <>
                    <button
                      className={`text-red-400`}
                      onClick={handleDelete}
                    >
                      Delete
                    </button>
                    <div className="w-full h-[.5px] bg-slate-700"></div>
                  </>
                )}
                <button className="text-red-400">Report</button>
                <div className="w-full h-[.5px] bg-slate-700"></div>
                <button onClick={() => onClose()}>Close</button>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
