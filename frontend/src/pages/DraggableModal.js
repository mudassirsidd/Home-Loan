import React, { forwardRef } from "react";
import Draggable from "react-draggable";

// ForwardRef to pass DOM node directly
const DraggableModal = forwardRef(({ children }, ref) => {
  return (
    <Draggable handle=".modal-header" nodeRef={ref}>
      <div
        ref={ref}
        className="fixed bottom-1 right-20 w-80 bg-white border rounded-lg shadow-lg z-50 cursor-move"
      >
        {children}
      </div>
    </Draggable>
  );
});

export default DraggableModal;
