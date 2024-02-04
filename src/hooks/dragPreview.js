// first event is mouseDown => Add Preview
// then on mouseUp we

import { useAtom } from "jotai";
import { useEffect, useState, useRef } from "react";
import { eventsAtom } from "../state";
import { nanoid } from "nanoid";
import { parse } from "date-fns";

const useDragPreview = (className) => {
  const dragging = useRef(false);
  const cursorPositionRef = useRef({ x: 0, y: 0 });
  const [atom, setAtom] = useAtom(eventsAtom);
  const starTimeSlot = useRef();
  const topElement = useRef();
  const endTimeSlot = useRef();
  const handleMouseDown = (element) => {
    const time = element.dataset.time;
    const date = element.dataset.date;

    console.log(time, date);

    topElement.current = element;
    // console.log("mousedown", time, date);
    // Copy the width and position of the element
    starTimeSlot.current = element.dataset.time;
    const elementRect = element.getBoundingClientRect();
    const elementWidth = elementRect.width;
    const elementTop = elementRect.top;
    const elementLeft = elementRect.left;

    // Create a portal

    const portalContainer = document.getElementById("portal");
    const infoBoxElement = document.createElement("div");
    infoBoxElement.id = "info-box";
    infoBoxElement.classList.add("info-box");
    infoBoxElement.style.width = `${100}px`; // Apply the width
    infoBoxElement.style.position = "fixed";
    infoBoxElement.style.pointerEvents = "none";
    infoBoxElement.style.background = "#4d90fe";
    infoBoxElement.style.borderRadius = "4px";
    infoBoxElement.style.padding = "4px 8px";
    infoBoxElement.style.color = "white";
    infoBoxElement.style.fontSize = "10px";
    infoBoxElement.style.zIndex = 2;

    //   infoBoxElement.style.opacity = "0.2";
    infoBoxElement.style.top = `${elementTop}px`; // Apply the top position
    infoBoxElement.style.left = `${elementLeft}px`; // Apply the left position
    infoBoxElement.innerHTML = `
           <span>Time: ${time}</span>
           <span>Date: ${date}</span>
         `;
    portalContainer.appendChild(infoBoxElement);

    dragging.current = true;

    // Add your mouse down event handling logic here
  };

  const handleMouseMove = (event) => {
    // Calculate the height based on the cursor position

    const element = topElement.current;

    const elementRect = element.getBoundingClientRect();
    const elementWidth = elementRect.width;
    const elementTop = elementRect.top;
    const elementLeft = elementRect.left;

    const infoBox = document.getElementById("info-box");

    const height = event.clientY - elementTop;

    cursorPositionRef.current = { x: event.clientX, y: event.clientY };

    // Update the height of the info box
    infoBox.style.height = `${height}px`;
  };

  const handleMouseUp = (e) => {
    const time = e.dataset.time;
    const dateTime = e.dataset.date;

    // if (e.dataset.time === starTimeSlot.current) {
    //   dragging.current = false;
    //   return;
    // }
    endTimeSlot.current = e.dataset.time;

    // setAtom((e) => [...e, ])
    const startDate = parse(
      new Date(dateTime).toDateString() + starTimeSlot.current,
      "EEE MMM dd yyyyHH:mm:ss",
      new Date()
    );
    const endDateTime = parse(
      new Date(dateTime).toDateString() + endTimeSlot.current,
      "EEE MMM dd yyyyHH:mm:ss",
      new Date()
    );
    const newItem = {
      id: nanoid(),
      desciption: "this is a description",
      title: "Drag Event Added Title",
      startDateTime: startDate,
      endDateTime: endDateTime,
    };

    setAtom((e) => [...e, newItem]);

    endTimeSlot.current = null;
    starTimeSlot.current = null;

    const portalContainer = document.getElementById("portal");

    while (portalContainer.firstChild) {
      portalContainer.removeChild(portalContainer.firstChild);
    }

    // document.removeEventListener("mousemove", handleMouseMove);

    dragging.current = false;
    // Add your mouse up event handling logic here
  };

  useEffect(() => {
    const elements = document.querySelectorAll(`.${className}`);

    elements.forEach((element) => {
      element.addEventListener("mousedown", () => handleMouseDown(element));
      element.addEventListener("mouseup", () => handleMouseUp(element));
      element.addEventListener("drag", () => {
        dragging.current = false;
        const portalContainer = document.getElementById("portal");

        while (portalContainer.firstChild) {
          portalContainer.removeChild(portalContainer.firstChild);
        }
      });
    });

    document.addEventListener("mousemove", (e) => {
      if (dragging.current) {
        handleMouseMove(e);
      }
    });

    // Clean up event listeners when the component is unmounted
    return () => {
      elements.forEach((element) => {
        element.removeEventListener("mousedown", () =>
          handleMouseDown(element)
        );
        element.removeEventListener("mouseup", () => handleMouseUp(element));
      });
    };
  }, [className]); // Re-run the effect when className changes

  // Return any values or functions that you want to expose from the hook
  return {
    // You can expose values or functions here if needed
  };
};

export default useDragPreview;
