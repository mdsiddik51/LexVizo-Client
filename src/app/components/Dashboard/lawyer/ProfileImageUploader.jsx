"use client";
import React from "react";
import { Upload, X, User, CheckCircle } from "lucide-react";

export const ProfileImageUploader = ({
  profileImg,
  isImageLocked,
  selectedFile,
  isUploadingImage,
  fileInputRef,
  handleImageChange,
  removeImage,
  handleStandaloneImageUpload,
  triggerFileBrowser,
}) => {
  return (
    <div className="space-y-6">
      <div className="border border-[#131B2E] bg-[#090D1A]/40 p-6 flex flex-col items-center text-center space-y-4">
        <h3 className="w-full text-left text-sm font-mono uppercase tracking-wider text-[#FCBA80] border-b border-[#131B2E] pb-3">
          Profile Image
        </h3>

        <div className="p-4 border border-dashed border-[#131B2E] w-full flex flex-col items-center justify-center bg-[#050811] min-h-[220px]">
          <div className="w-28 h-32 bg-zinc-900 border border-zinc-800 relative overflow-hidden flex items-center justify-center text-zinc-600 group">
            {profileImg ? (
              <>
                <img
                  src={profileImg}
                  alt="Preview"
                  className="w-full h-full object-cover object-top"
                />
                {!isImageLocked && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-1 right-1 bg-black/70 p-1 text-red-400 border border-zinc-800 hover:bg-black transition-colors"
                    title="Remove Image"
                  >
                    <X size={10} />
                  </button>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center gap-1.5 p-2 text-center">
                <User size={24} className="text-zinc-700" />
                <div className="text-[9px] uppercase font-mono text-zinc-500 tracking-wider">
                  No Image Found
                </div>
              </div>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageChange}
            disabled={isImageLocked}
            className="hidden"
          />

          {isImageLocked ? (
            <div className="mt-4 w-full flex flex-col items-center gap-1 bg-emerald-950/10 border border-emerald-900/30 p-2.5">
              <div className="flex items-center gap-1 text-[10px] uppercase font-mono text-emerald-400 tracking-wider">
                <CheckCircle size={12} /> Image Registered
              </div>
              <div className="text-[8px] font-mono text-gray-500 leading-tight">
                This account already contains a confirmed professional image asset and cannot be overwritten.
              </div>
            </div>
          ) : selectedFile ? (
            <div className="w-full space-y-2 mt-4">
              <div className="text-[9px] font-mono text-amber-500 tracking-widest uppercase bg-amber-950/20 py-1 border border-amber-900/30">
                Unsaved Preview
              </div>
              <button
                type="button"
                disabled={isUploadingImage}
                onClick={handleStandaloneImageUpload}
                className="w-full justify-center border border-emerald-800 bg-emerald-950/40 hover:bg-emerald-900/60 px-3 py-1.5 font-mono text-[10px] tracking-wider uppercase text-emerald-300 flex items-center gap-1.5 transition-all"
              >
                {isUploadingImage ? "Uploading to ImgBB..." : "Save Image Separately"}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={triggerFileBrowser}
              className="mt-4 border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800/80 px-3 py-1.5 font-mono text-[10px] tracking-wider uppercase text-gray-300 flex items-center gap-1.5 transition-all"
            >
              <Upload size={11} /> Upload Photo
            </button>
          )}
        </div>
      </div>
    </div>
  );
};