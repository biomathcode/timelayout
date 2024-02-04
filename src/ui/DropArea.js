import { TrashIcon } from "@heroicons/react/24/outline";
import { nanoid } from "nanoid";
import { useState, useRef, useMemo } from "react";
import { DragPreview, useDrag, useDrop, useTooltipTrigger } from "react-aria";
import { poof } from "../animation/poof";
import { toast } from "sonner";
import { atom, useAtom, useSetAtom } from "jotai";
import { eventsAtom } from "../state";
import { format, parse, parseJSON } from "date-fns";
import { changeDate } from "../utils";

const DragItem = (props) => {
  const preview = useRef(null);
  const [events, setEvents] = useAtom(eventsAtom);
  let { dragProps, isDragging } = useDrag({
    getItems() {
      return [
        {
          "text/plain": "hello world",
          "application/json": JSON.stringify({
            ...props,
          }),
        },
      ];
    },
    preview: preview,

    onDragEnd(dropEvent) {
      console.log("dropEnvet", dropEvent);
      const updatedEvents = events.map((event) => {
        return event.id === dropEvent.id ? dropEvent : event;
      });
      setEvents(updatedEvents);
    },
  });

  const ref = useRef();

  const removeEvent = async (e) => {
    if (!ref.current) return;
    const audio = new Audio("/woosh.mp3");

    // audio.play();
    await poof(ref.current);

    toast("Event Deleted!", {
      action: {
        label: "Undo",
        onClick: () => console.log("add the event again"),
      },
    });

    props.action();
    e.stopPropagation();
  };

  return (
    <>
      <div
        ref={ref}
        {...dragProps}
        // style={{
        //   background: "#222",
        //   color: "#fff",
        //   padding: "2px 10px",
        //   borderRadius: "4px",
        //   height: "40px",
        //   zIndex: index,
        //   marginTop: "1px",
        //   marginLeft: "1px",
        //   boxShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
        // }}
        style={{
          position: "relative",
          height: "34px",
          zIndex: 20,
        }}
        role="button"
        tabIndex={0}
        className={`item draggable ${isDragging ? "dragging" : ""}`}
      >
        <div
          style={{
            position: "absolute",
            top: "2px",
            left: "50%",
            background: "#fff",
            opacity: 0.7,
            height: "2px",
            width: "20px",
            cursor: "n-resize",
            zIndex: "2222",
            borderRadius: "4px",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "2px",
            left: "50%",
            opacity: 0.7,
            background: "#fff",
            borderRadius: "4px",
            height: "2px",
            width: "20px",
            cursor: "s-resize",
            zIndex: "2222",
          }}
        />
        <div className="flex col gap-2">
          <div
            style={{
              color: "rgba(255, 255, 255, 1)",
              fontWeight: "500",
            }}
          >
            {props.title}
          </div>
          <div
            style={{
              fontWeight: "500",
              color: "rgba(255, 255, 255,1)",
              width: "fit-content",
              marginTop: "3px",
            }}
          >
            {`${format(props.startDateTime, "h:mm ")}-${format(
              props.endDateTime,
              "h:mm a"
            )}`}
          </div>
        </div>

        <button
          onClick={(e) => removeEvent(e)}
          style={{
            position: "absolute",
            right: "0px",
            top: "0px",
            padding: "1px",

            border: "none",
            color: "#eee",
            background: "#333",
            borderRadius: "4px",
            width: "14px",
            height: "14px",
            zIndex: "999999",
            cursor: "pointer",
            textAlign: "center",
            overflow: "hidden",
          }}
          role="button"
        >
          <TrashIcon color="#eee" width={12} />
        </button>
      </div>

      <DragPreview ref={preview}>
        {(items) => (
          <div className="item draggable">
            <span>{props.title}</span>
            <span>{`${props.startTime}-${props.endTime}`}</span>
          </div>
        )}
      </DragPreview>
    </>
  );
};

const timeSlots = Array.from({ length: 48 }, (_, index) => {
  const slotId = index + 1;
  const startTime = new Date(2022, 0, 1, 0, 0); // Start from midnight
  const slotTime = new Date(startTime.getTime() + index * 30 * 60 * 1000);
  const endTime = new Date(slotTime.getTime() + 30 * 60 * 1000);

  return {
    id: slotId,
    slot: `Slot ${slotId}`,
    startTime: slotTime.toTimeString().split(" ")[0], // Extracting only the time part
    endTime: endTime.toTimeString().split(" ")[0],
    isHour: index % 2 !== 0, // True for hour, false for half-hour
  };
});

const DropArea = ({ date, timeZone, dateTime }) => {
  // Create an array of time slots from 0 to 24 hours with half-hour intervals
  const DropSlots = timeSlots;

  const [events] = useAtom(eventsAtom);

  const dateEvents = events.filter(
    (e) =>
      new Date(e.startDateTime).toDateString() ===
      new Date(dateTime).toDateString()
  );

  // console.log(events);

  // console.log("dateEvent", dateEvents);

  return (
    <div className="drop-grid-container">
      {DropSlots.map((time, index) => {
        const items = dateEvents.filter((event) => {
          const startTimeString = new Date(event.startDateTime)
            .toTimeString()
            .split(" ")[0];
          return startTimeString === time.startTime;
        });
        return (
          <div key={index} className="drop-item">
            <DropItem
              items={items}
              time={time.startTime}
              date={date}
              end={time.endTime}
              dateTime={dateTime}
            />
          </div>
        );
      })}
    </div>
  );
};

const DropItem = ({ items, date, time, end, dateTime }) => {
  let [events, setEvent] = useAtom(eventsAtom);
  let ref = useRef(null);

  const ltDate = dateTime?.toDateString() + time;
  const startDate = parse(ltDate, "EEE MMM dd yyyyHH:mm:ss", new Date());
  let { dropProps, isDropTarget } = useDrop({
    ref,
    async onDrop(e) {
      let items = await Promise.all(
        e.items
          .filter(
            (item) => item.kind === "text" && item.types.has("application/json")
          )
          .map((item) => item.getText("application/json"))
      );
      const parseItem = JSON.parse(items);

      const newStartDate = changeDate(
        parseItem.startDateTime,
        dateTime.toISOString()
      );
      //TODO: get the difference of the star and end date
      // then setthe startDate as the dropDate + Time
      // set endDate =  startDate + difference

      console.log("Drop", newStartDate);

      console.log("on Drop Json", parseItem, dateTime.toISOString());
    },
    onDropActivate(e) {},
  });

  const deleteIconById = (id) => {
    const newItems = events.filter((e) => id !== e.id);

    setEvent(newItems);
  };

  return (
    <ul
    // onClick={() => {
    //   // console.log("click");
    //   const ltDate = dateTime.toDateString() + time;
    //   const startDate = parse(ltDate, "EEE MMM dd yyyyHH:mm:ss", new Date());
    //   const endDateTime = parse(
    //     dateTime.toDateString() + end,
    //     "EEE MMM dd yyyyHH:mm:ss",
    //     new Date()
    //   );

    //   const newItem = {
    //     id: nanoid(),
    //     desciption: "this is a description",
    //     title: "second Title",
    //     startDateTime: startDate,
    //     endDateTime: endDateTime,
    //   };

    //   setEvent((e) => [...e, newItem]);

    //   console.log(events);
    // }}
    >
      <div
        {...dropProps}
        role="button"
        tabIndex={0}
        data-time={time}
        data-date={dateTime}
        ref={ref}
        className={`items dropbox droppable ${isDropTarget ? "target" : ""}`}
      >
        {items?.map((e) => {
          return (
            <DragItem
              action={() => deleteIconById(e.id)}
              title={e.title}
              startDateTime={e.startDateTime}
              endDateTime={e.endDateTime}
              id={e.id}
              key={e.id}
            />
          );
        })}
      </div>
    </ul>
  );
};

export default DropArea;
