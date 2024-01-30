"use client";

import { useState, useRef } from "react";

export default function AvatarUploadPage() {
  const inputFileRef = useRef(null);
  const [blob, setBlob] = useState(null);

  function copytext() {
    const text = document.getElementById("urltext");
    navigator.clipboard.writeText(text.innerText);
    const button = document.getElementById("copybutton");
    button.innerText = "✔";
    setTimeout(() => {
      button.innerText = "📋";
      }, 2000);
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen w-screen gap-4">
        <h1 className="text-4xl font-semibold">Upload Your file</h1>

        <form
          className="flex flex-col justify-center bg-neutral-800 bg-opacity-80 p-12 rounded-lg gap-4"
          onSubmit={async (e) => {
            e.preventDefault();

            const file = inputFileRef.current.files[0];

            console.log(file);
            const response = await fetch(
              `/api/upload/file?filename=${file.name}`,
              {
                method: "POST",
                body: file,
              },
            );

            const newBlob = await response.json();
            console.log(newBlob);
            setBlob(newBlob);
          }}
          >
          <label htmlFor="Upload" className="text-xl">
            Select file to Upload
          </label>
          <input
            type="file"
            ref={inputFileRef}
            name="Upload"
            id="Upload"
            required
          />
          <button
            type="submit"
            className="bg-white text-black rounded-md text-xl font-medium p-1"
            >
            Upload
          </button>
        </form>
        {blob && (
          <div>
            <h1 className="text-2xl p-2 text-center">Your URL</h1>
            <div className="bg-neutral-800 p-2 rounded-md">
              <p id="urltext" className="inline p-2">
                {blob.url}
              </p>
              <button
                id="copybutton"
                className="bg-black p-2 m-2 rounded-md bg-opacity-40"
                onClick={(e) => {
                  e.preventDefault();
                  copytext();
                }}
                >
                📋
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
