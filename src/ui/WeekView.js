import { useRef } from "react";
import styled from "styled-components";

import { useCalendarState } from "react-stately";

import {
  useCalendar,
  useCalendarGrid,
  useLocale,
  useDateFormatter,
} from "react-aria";

import { createCalendar } from "@internationalized/date";
import { Button } from "./Button";
import { CalendarCell } from "./CalenderCell";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import VerticalGrid from "./Grid";
import useDragPreview from "../hooks/dragPreview";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useKBar } from "kbar";

const StyledWeekView = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: calc(100vw - 200px);
`;

const Title = styled.h3`
  font-size: 14px;
  font-weight: 500;
`;

export function WeekView(props) {
  let { locale } = useLocale();
  let state = useCalendarState({
    ...props,
    visibleDuration: { weeks: 1 },
    locale,
    createCalendar,
  });
  let ref = useRef();
  let { calendarProps, prevButtonProps, nextButtonProps } = useCalendar(
    props,
    state,
    ref
  );
  let { gridProps } = useCalendarGrid(props, state);

  let startDate = state.visibleRange.start;

  let dateFormatter = useDateFormatter({
    dateStyle: "long",
    calendar: startDate.calendar.identifier,
  });

  useDragPreview("dropbox");

  console.log("gridprops", gridProps);

  const { query } = useKBar();

  return (
    <StyledWeekView {...calendarProps} ref={ref}>
      <div className="header">
        <div className="flex center">
          <Button {...prevButtonProps}>
            <ChevronLeftIcon style={{ width: 20, height: 20 }} />
          </Button>

          <Title>
            {dateFormatter.formatRange(
              state.visibleRange.start.toDate(state.timeZone),
              state.visibleRange.end.toDate(state.timeZone)
            )}
          </Title>
          <Button {...nextButtonProps}>
            <ChevronRightIcon style={{ width: 20, height: 20 }} />
          </Button>
          <Button>Today</Button>
        </div>
        <div className="flex center">
          <kbd>cmd + k</kbd>
        </div>
      </div>

      <div className="flex">
        <VerticalGrid />
        <div {...gridProps} className="flex">
          {state
            .getDatesInWeek(0)
            .map((date, i) =>
              date ? (
                <CalendarCell key={i} state={state} date={date} />
              ) : (
                <td key={i} />
              )
            )}
        </div>
      </div>
    </StyledWeekView>
  );
}
