"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, UploadCloud, File as FileIcon, X } from "lucide-react"

export function FileUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.size > 25 * 1024 * 1024) { // 25MB limit
        toast.error("File is too large. Maximum size is 25MB.")
        return
      }
      setFile(selectedFile)
      setResultUrl(null) 
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast.warning("Please select a file first.")
      return
    }

    setIsLoading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/files/upload`
      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
        credentials: "include",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "File upload failed")
      }

      const result = await response.json()
      toast.success("File uploaded successfully!")
      setResultUrl(result.publicUrl)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An error occurred during upload.";
      toast.error(message);
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyToClipboard = () => {
    if (resultUrl) {
      navigator.clipboard.writeText(resultUrl)
      toast.info("URL copied to clipboard!")
    }
  }
  
  const triggerFileInput = () => {
    document.getElementById("file-input-uploader")?.click()
  }

  const clearFile = () => {
    setFile(null)
    setResultUrl(null)
    const fileInput = document.getElementById("file-input-uploader") as HTMLInputElement
    if (fileInput) {
      fileInput.value = ""
    }
  }

  const handleDialogClose = () => {
    // Reset state when dialog is closed
    clearFile()
    setIsDialogOpen(false)
  }


  return (
    <>
      <Button
        type="button"
        onClick={() => setIsDialogOpen(true)}
        className="w-full bg-gradient-to-br from-[#ffffff]/5 via-[#9747ff]/5 to-[#5a5bed]/5 border border-[#ffffff]/10 text-white hover:from-[#9747ff]/10 hover:via-[#5a5bed]/8 hover:to-[#821db6]/10 hover:border-[#9747ff]/60 transition-all duration-300 rounded-xl"
      >
        <UploadCloud className="mr-2 h-4 w-4" />
        Upload File
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[480px] bg-gradient-to-br from-[#0a0a0a]/80 via-[#9747ff]/10 to-[#5a5bed]/20 backdrop-blur-xl border border-[#ffffff]/10 rounded-xl shadow-[0_0_30px_rgba(151,71,255,0.25)] text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Upload File</DialogTitle>
            <DialogDescription className="text-white/70">
              Upload a JPG, PNG, or ZIP file. Max size: 25MB.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Input
                id="file-input-uploader"
                type="file"
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.zip"
                className="hidden"
              />
              {!file ? (
                <div
                  onClick={triggerFileInput}
                  className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-[#ffffff]/20 rounded-xl cursor-pointer bg-[#ffffff]/5 hover:bg-[#ffffff]/10 hover:border-[#9747ff]/60 transition-all duration-300"
                >
                  <UploadCloud className="h-10 w-10 text-white/60 mb-2" />
                  <p className="text-base font-semibold text-white/80">Click to select a file</p>
                  <p className="text-sm text-white/50">or drag and drop</p>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 border border-[#ffffff]/20 rounded-xl bg-[#ffffff]/5">
                  <div className="flex items-center gap-3">
                    <FileIcon className="h-6 w-6 text-[#9747ff]" />
                    <span className="text-sm font-medium text-white truncate max-w-xs">{file.name}</span>
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={clearFile} className="h-7 w-7 text-white/70 hover:text-white hover:bg-white/10 rounded-full">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {resultUrl && (
              <div className="space-y-2">
                <Label htmlFor="public-url" className="text-white/80 font-semibold">
                  Public URL
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="public-url"
                    readOnly
                    value={resultUrl}
                    className="border-[#ffffff]/20 focus-visible:border-[#9747ff]/60 focus-visible:ring-[#9747ff] rounded-xl bg-[#0a0a0a]/50 text-white placeholder:text-white/40"
                  />
                  <Button type="button" size="icon" onClick={handleCopyToClipboard} className="bg-white/10 hover:bg-white/20 text-white rounded-lg">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              onClick={handleUpload}
              disabled={!file || isLoading}
              className="w-full bg-gradient-to-br from-[#9747ff]/80 to-[#5a5bed]/90 hover:from-[#9747ff] hover:to-[#5a5bed] text-white font-bold border border-[#9747ff]/40 hover:border-[#9747ff] transition-all duration-300 hover:scale-105 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.2)] hover:shadow-[0_0_25px_rgba(99,102,241,0.4)]"
            >
              {isLoading ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
