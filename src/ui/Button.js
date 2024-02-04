import { useRef } from "react";
import styled from "styled-components";
import { useButton } from "@react-aria/button";
import { useFocusRing } from "@react-aria/focus";
import { mergeProps } from "@react-aria/utils";

const StyledButton = styled.button`
  appearance: none;
  border: none;
  background: none;
  color: black;
  height: 20px;
  width: fit-content;
  border-radius: 10px;
  padding: 4px 10px;

  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
  box-shadow: ${(props) => (props.isFocusVisible ? "0 0 0 2px seagreen" : "")};

  &:hover {
    background: #888;
  }

  &:active {
    background: #222;
  }
`;

export function Button(props) {
  let ref = useRef();
  let { buttonProps } = useButton(props, ref);
  let { focusProps, isFocusVisible } = useFocusRing();
  return (
    <StyledButton
      {...mergeProps(buttonProps, focusProps)}
      isFocusVisible={isFocusVisible}
      ref={ref}
    >
      {props.children}
    </StyledButton>
  );
}
