import React, { useState } from "react";
import Axios from "axios";
import "./WantsToEdit.css";

// overlay for editing the "I want to..." section
const WantsToEdit = ({
  wantsToText,
  setWantsToState,
  setDidWantsToUpdate,
}: {
  wantsToText: string | undefined;
  setWantsToState: React.Dispatch<React.SetStateAction<boolean>>;
  setDidWantsToUpdate: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [newWantsToText, setNewWantsToText] = useState(
    wantsToText === null ? "" : wantsToText
  );

  // update wants_to portion of user
  const saveWantsTo = () => {
    Axios.patch("/user/wants-to", {
      newWantsToText: newWantsToText,
    })
      .then((res) => {
        if (res.status === 200) {
          setDidWantsToUpdate(newWantsToText!);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    setWantsToState(false);
  };

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
      <div onClick={saveWantsTo} className="wants-to-edit-container-save">
        <p>Save</p>
      </div>
    </div>
  );
};

export default WantsToEdit;
