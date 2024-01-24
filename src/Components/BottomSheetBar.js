"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import Link from "next/link";


function usePrevious(value) {
  const previousValueRef = useRef();
  useEffect(() => {
    previousValueRef.current = value;
  }, [value]);
  
  return previousValueRef.current;
}

function BottomSheet({ isClosed, setIsClosed, buttonRef }) {
  const [isOpen, setIsOpen] = useState(false);
  const divRef = useRef(null)

  function onClose() {
    setIsOpen(false);
  }

  function onOpen() {
    setIsOpen(true);
  }

  function onToggle() {
    setIsOpen(!isOpen);
  }

  const prevIsOpen = usePrevious(isOpen);
  const controls = useAnimation();

  function onDragEnd(event, info) {
    const shouldClose =
      info.velocity.y > 20 || (info.velocity.y >= 0 && info.point.y > 45);
    if (shouldClose) {
      controls.start("closed");
      onClose();
    } else {
      controls.start("visible");
      onOpen();
    }
  }

  useEffect(() => {
    document.addEventListener('click', (e)=>{
      if (divRef.current && !divRef.current.contains(e.target) && buttonRef.current && !buttonRef.current.contains(e.target)) {
        setIsClosed(false)
      }
    });
  
    return () => {
      document.removeEventListener('click', (e)=>{
        if (divRef.current && !divRef.current.contains(e.target)) {
          setIsClosed(false)
        }})
    };
  }, [])
  
  useEffect(() => {
    if (prevIsOpen && !isOpen) {
      controls.start("visible");
    } else if (!prevIsOpen && isOpen) {
      controls.start("visible");
    } else if (isClosed) {
      controls.start("closed");
    } else if (!isClosed) {
      controls.start("visible");
    }
  }, [controls, isOpen, isClosed, prevIsOpen]);

  const handleDoubleClick = (e) => {
    switch (e.detail) {
      case 1:
        // console.log("click");
        break;
      case 2:
        if (!prevIsOpen && isOpen) {
          controls.start("hidden");
          setIsOpen(false);
          // console.log("double click visible");
        } else if (prevIsOpen && !isOpen) {
          controls.start("visible");
          setIsOpen(true);

          // console.log("double click hidden");
        }

        break;

      default:
        return;
    }
  };

  return (
    <motion.div
      drag="y"
      onDragEnd={onDragEnd}
      initial="closed"
      animate={controls}
      transition={{
        type: "spring",
        damping: 40,
        stiffness: 400,
      }}
      variants={{
        visible: { y: "50%" },
        hidden: { y: "74%" },
        closed: { y: "100%" },
      }}
      dragConstraints={{ top: 0 }}
      dragElastic={0.2}
      ref={divRef}
      className="fixed bottom-0 left-0 w-full z-[100000] dark:bg-[#151515] bg-white text-black dark:text-white rounded-xl h-1/2"
    >
      <div className="w-full h-8 flex items-center justify-center">
        <div
          className=" w-1/4 h-1 rounded-full dark:bg-white bg-black"
          onClick={handleDoubleClick}
        ></div>
      </div>
      <div className="h-full pb-4 w-full  flex flex-col justify-start gap-4 pt-2 ">
        <div className="w-full flex items-center justify-start text-2xl px-4">
          <Link
            href="/setting"
            className="flex items-center justify-center gap-4"
          >
            <i className="fa-solid fa-gear  select-none text-lg"></i>
            Setting
          </Link>
        </div>
        <div className="w-full flex items-center justify-start px-4 gap-4 text-2xl">
          <Link
            href="/projectrepo"
            className="flex items-center justify-center gap-4"
          >
            <i className="fa-solid fa-question"></i>About
          </Link>
        </div>
        <div
        className="w-full flex items-center justify-start text-2xl px-4"
        onClick={() => setIsClosed(true)}
      >
        <div className="flex items-center justify-center gap-4">
          <i className="fa-solid fa-gear  select-none text-lg"></i>
          Close
        </div>
      </div>
      </div>
      
    </motion.div>
  );
}


export default function BottomSheetBar() {
  const [isClosed, setIsClosed] = useState(true);
  const buttonRef = useRef(null);
  return (
    <>
      <button className="" onClick={() => setIsClosed(!isClosed)} ref={buttonRef}>
        <i className="fa-solid fa-bars text-lg select-none"></i>
      </button>
      <BottomSheet isClosed={isClosed} setIsClosed={setIsClosed} buttonRef={buttonRef}/>
    </>
  );
}
