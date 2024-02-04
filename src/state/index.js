// Create Atoms which would have

/*
  id,
  starDateTime => UTC, 
  endDateTime => UTC, 
  timezone=> 'Asia/Kolkata', 
  type = meeting, 
  title, 
  description, 
*/

// calendarState.js
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import { sampleData } from "./sampledata";

// Type for the entire calendar state
const CalendarState = {
  selectedDate: new Date(),
  events: [...sampleData],
};

// Atom for the selected date
export const selectedDateAtom = atom(CalendarState.selectedDate);

// Atom for the list of events
export const eventsAtom = atomWithStorage("events", CalendarState.events, {
  getItem(key, initialValue) {
    const storedValue = localStorage.getItem(key);
    try {
      return JSON.parse(storedValue ?? "");
    } catch {
      return initialValue;
    }
  },
  setItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  removeItem(key) {
    localStorage.removeItem(key);
  },

  subscribe(key, callback, initialValue) {
    if (
      typeof window === "undefined" ||
      typeof window.addEventListener === "undefined"
    ) {
      return;
    }
    window.addEventListener("storage", (e) => {
      if (e.storageArea === localStorage && e.key === key) {
        let newValue;
        try {
          newValue = myNumberSchema.parse(JSON.parse(e.newValue ?? ""));
        } catch {
          newValue = initialValue;
        }
        callback(newValue);
      }
    });
  },
});

// Atom and function for adding events
export const addEventAtom = atom((get) => (newEvent) => {
  const currentEvents = get(eventsAtom);
  const updatedEvents = [...currentEvents, newEvent];
  return updatedEvents;
});

// Atom and function for updating an event
export const updateEventAtom = atom((get) => (updatedEvent) => {
  const currentEvents = get(eventsAtom);
  const updatedEvents = currentEvents.map((event) =>
    event.id === updatedEvent.id ? updatedEvent : event
  );
  return updatedEvents;
});

// Atom and function for deleting an event
export const deleteEventAtom = atom((get) => (eventId) => {
  const currentEvents = get(eventsAtom);
  const updatedEvents = currentEvents.filter((event) => event.id !== eventId);
  return updatedEvents;
});

// Derive a state for events within the current week
export const eventsInCurrentWeekAtom = atom(eventsAtom, (get) => {
  const allEvents = get(eventsAtom);
  const selectedDate = get(selectedDateAtom);

  // Calculate the start and end dates for the current week
  const startDate = new Date(selectedDate);
  startDate.setDate(startDate.getDate() - selectedDate.getDay()); // Start from the first day of the week
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6); // End on the last day of the week

  // Filter events within the current week
  const eventsInWeek = allEvents.filter((event) => {
    const eventDate = new Date(event.date);
    return eventDate >= startDate && eventDate <= endDate;
  });

  return eventsInWeek;
});
