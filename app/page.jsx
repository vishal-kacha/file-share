"use client";

import { useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { QRCodeSVG } from "qrcode.react";
import axios from "axios";

export default function AvatarUploadPage() {
  const inputFileRef = useRef(null);

  // Upload mutation using React Query
  const uploadMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        `/api/upload/file?filename=${file.name}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      inputFileRef.current.value = "";
    },
    onError: (error) => {
      console.error(error.message || "Failed to upload file");
    },
  });

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-400">Upload Your File</h1>
          <p className="mt-2 text-blue-200">
            Share your files quickly and easily
          </p>
        </div>
        <form
          className="bg-gray-900 rounded-lg shadow-2xl p-8 space-y-6 border border-blue-500/20"
          onSubmit={(e) => {
            e.preventDefault();
            const file = inputFileRef.current.files[0];
            if (file) {
              uploadMutation.mutate(file);
            }
          }}
        >
          <div className="space-y-4">
            <label
              htmlFor="file"
              className="text-blue-300 text-lg font-medium block text-center"
            >
              Select file to Upload
            </label>
            <input
              type="file"
              ref={inputFileRef}
              id="file"
              className="w-full text-sm text-blue-200 file:mr-4 file:py-2 
                file:px-4 file:rounded-full file:border-0 file:text-sm 
                file:font-semibold file:bg-blue-900 file:text-blue-100
                hover:file:bg-blue-800 cursor-pointer"
              required
            />
          </div>

          <button
            type="submit"
            disabled={uploadMutation.isPending}
            className={`w-full py-3 px-4 rounded-md text-white font-medium
              ${
                uploadMutation.isPending
                  ? "bg-blue-800"
                  : "bg-blue-600 hover:bg-blue-700"
              }
              transition-colors duration-200 shadow-lg`}
          >
            {uploadMutation.isPending ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Uploading...
              </span>
            ) : (
              "Upload File"
            )}
          </button>
        </form>
        {uploadMutation.isSuccess && uploadMutation.data && (
          <div className="bg-gray-900 rounded-lg p-6 space-y-4 border border-blue-500/20">
            <h2 className="text-2xl font-semibold text-blue-400 text-center">
              File Uploaded Successfully
            </h2>
            <div className="flex items-center space-x-2 bg-gray-800 rounded-md p-3">
              <p className="text-blue-200 flex-1 truncate">
                {uploadMutation.data.url}
              </p>
              <button
                onClick={() => copyToClipboard(uploadMutation.data.url)}
                className="p-2 hover:bg-blue-900 rounded-md transition-colors text-blue-300"
              >
                📋
              </button>
            </div>
          </div>
        )}
        {uploadMutation.isSuccess && uploadMutation.data && (
          <div className="mt-4 flex justify-center">
            <QRCodeSVG
              value={uploadMutation.data.url}
              size={200}
              level="H"
              className="bg-white p-2 rounded-lg"
            />
          </div>
        )}
        {uploadMutation.isError && (
          <div className="bg-red-900/30 border border-red-500 rounded-lg p-4">
            <p className="text-red-200">
              {uploadMutation.error?.message || "An error occurred"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
