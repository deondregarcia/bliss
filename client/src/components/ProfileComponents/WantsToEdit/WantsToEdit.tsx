import React, { useState } from "react";
import "./WantsToEdit.css";

// overlay for editing the "I want to..." section
const WantsToEdit = ({ wantsToText }: { wantsToText: string | undefined }) => {
  const [newWantsToText, setNewWantsToText] = useState(
    wantsToText === null ? "" : wantsToText
  );

  console.log(wantsToText);
  console.log(newWantsToText);

  return (
    <div className="wants-to-edit-container">
      <textarea
        maxLength={90}
        id="wants-to"
        placeholder="What's something you want to do in the next week or two?"
        value={newWantsToText}
        onChange={(e) => setNewWantsToText(e.target.value)}
        className="wants-to-edit-container-input"
      />
      <input
        type="submit"
        value="Save"
        className="wants-to-edit-container-save"
      />
    </div>
  );
};

export default WantsToEdit;
