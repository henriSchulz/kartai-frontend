import React from "react";

type State<T> = { val: T, set: React.Dispatch<React.SetStateAction<T>> }

export default State