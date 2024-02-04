import { useRef } from "react";
import styled from "styled-components";
import {
  useCalendarCell,
  useDateFormatter,
  useFocusRing,
  mergeProps,
} from "react-aria";
import DropArea from "./DropArea";
import { TimeTracker } from "./Grid";

const Button = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default;
  height: 40px;
  width: 96%;

  padding: 4px 2px;
  font-size: 12px;

  background: ${(props) => (props.isSelected ? "#333" : "")};
  color: ${(props) => (props.isSelected ? "white" : "")};
  outline: none;
  position: relative;

  &:after {
    content: "";
    position: absolute;
    inset: -2px;
    border-radius: 100%;
    box-shadow: ${(props) =>
      props.isFocusVisible ? "0 0 0 2px seagreen" : ""};
  }
`;

export function CalendarCell(props) {
  let ref = useRef();

  let dateFormatter = useDateFormatter({
    weekday: "short",
    day: "numeric",
    timeZone: props.state.timeZone,
    calendar: props.date.calendar.identifier,
  });

  let isSelected = props.state.isSelected(props.date);
  let { focusProps, isFocusVisible } = useFocusRing();

  let showTicker =
    new Date(props.date.toDate(props.date.timeZone)).toDateString() ===
    new Date().toDateString();

  return (
    <div className="column relative flex col">
      {showTicker && <TimeTracker totalHours={24} />}

      <Button
        ref={ref}
        {...mergeProps(focusProps)}
        isSelected={isSelected}
        isFocusVisible={isFocusVisible}
      >
        {dateFormatter
          .format(props.date.toDate(props.state.timeZone))
          .toUpperCase()}
      </Button>

      <DropArea
        timeZone={props.state.timeZone}
        dateTime={props.date.toDate(props.state.timeZone)}
        date={dateFormatter.format(props.date.toDate(props.state.timeZone))}
      />
    </div>
  );
}
