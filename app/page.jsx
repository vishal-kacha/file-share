"use client";

import { useState, useRef } from "react";

export default function AvatarUploadPage() {
  const inputFileRef = useRef(null);
  const [blob, setBlob] = useState(null);
  return (
    <>
      <h1>Upload Your Avatar</h1>

      <form
        onSubmit={async (e) => {
          e.preventDefault();

          const file = inputFileRef.current.files[0];

          console.log(file);
          const response = await fetch(
            `/api/upload/file?filename=${file.name}`,
            {
              method: "POST",
              body: file,
            }
          );

          const newBlob = await response.json();
          console.log(newBlob);
          setBlob(newBlob);
        }}
      >
        <input name="file" ref={inputFileRef} type="file" required />
        <button type="submit">Upload</button>
      </form>
      {blob && (
        <div>
          Blob url: <a href={blob.url}>{blob.url}</a>
        </div>
      )}
    </>
  );
}
